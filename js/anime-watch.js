(function () {
  'use strict';

  const shared = window.ComicsShared || {};
  const ANIMATIONS = shared.ANIMATIONS || [];
  const canRead = shared.canRead;
  const PLAY = shared.PLAY_ICON;
  const PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>';
  const formatCount = shared.formatCount;
  const publishedOf = shared.publishedOf;
  const escapeHtml = shared.escapeHtml;
  const parseViews = shared.parseViews;
  const EYE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';

  function byId(id) {
    if (!ANIMATIONS.length) return { id: '', title: '动画', author: '', views: '0', eps: 1, duration: '0分钟', durationSec: 1, tags: [], poster: 'assets/comics/thumb-2.webp' };
    return ANIMATIONS.find((item) => item.id === id) || ANIMATIONS[0];
  }

  function formatTime(sec) {
    const safe = Math.max(0, Math.floor(sec));
    const m = String(Math.floor(safe / 60)).padStart(2, '0');
    const s = String(safe % 60).padStart(2, '0');
    return m + ':' + s;
  }

  const VIP_FROM_EP = 7;

  function episodesOf(anime) {
    const count = Math.min(anime.eps, 12);
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      free: i + 1 < VIP_FROM_EP,
    }));
  }

  function pickItem(id, currentId, fallback) {
    return ANIMATIONS.find((item) => item.id === id && item.id !== currentId) || fallback;
  }

  function relatedVideosOf(current) {
    const pool = ANIMATIONS.filter((item) => item.id !== current.id);
    const templates = [
      { id: 'bully', ep: 2, free: true, isNew: true, time: '10秒' },
      { id: 'muscle', ep: 1, free: true, isNew: true, time: '7分钟' },
      { id: 'bully', ep: 1, free: true, isNew: true, time: '10秒' },
      { id: 'angel', ep: 1, free: false, isNew: true, time: '8分钟' },
      { id: 'angel', ep: 2, free: false, isNew: false, time: '6分钟' },
      { id: 'angel', ep: 4, free: false, isNew: true, time: '9分钟' },
    ];
    return templates.map((row, index) => {
      const item = pickItem(row.id, current.id, pool[index % Math.max(pool.length, 1)]);
      if (!item) return null;
      return { item, ep: row.ep, free: row.free, isNew: row.isNew, time: row.time };
    }).filter(Boolean);
  }

  function guessYouLike(current) {
    const preferred = ['bully', 'muscle', 'angel', 'witch'];
    const picked = [];
    preferred.forEach((id) => {
      const item = ANIMATIONS.find((entry) => entry.id === id && entry.id !== current.id);
      if (item) picked.push(item);
    });
    ANIMATIONS.forEach((item) => {
      if (item.id !== current.id && !picked.some((entry) => entry.id === item.id) && picked.length < 4) {
        picked.push(item);
      }
    });
    return picked.slice(0, 4);
  }

  const params = new URLSearchParams(window.location.search);
  const anime = byId(params.get('id'));
  const allEps = episodesOf(anime);
  let ep = Math.min(allEps.length, Math.max(1, Number(params.get('ep')) || 1));
  let current = 0;
  let playing = false;
  let timer = 0;
  let playDuration = anime.durationSec || 24;
  let videoSrc = '';
  let videoObjectUrl = '';
  const ADMIN_DB_KEY = 'comicsn-admin-db-v1';
  const ADMIN_ASSET_DB = 'comicsn-admin-assets-v1';

  const els = {
    player: document.getElementById('animePlayer'),
    shot: document.getElementById('animeShot'),
    video: document.getElementById('animeVideo'),
    title: document.getElementById('animeWatchTitle'),
    author: document.getElementById('animeWatchAuthor'),
    published: document.getElementById('animeWatchPublished'),
    exclusive: document.getElementById('animeExclusiveBadge'),
    hot: document.getElementById('animeHotBadge'),
    likes: document.getElementById('animeWatchLikes'),
    likeCount: document.getElementById('animeWatchLikeCount'),
    views: document.getElementById('animeWatchViews'),
    details: document.getElementById('animeWatchDetails'),
    tags: document.getElementById('animeWatchTags'),
    fav: document.getElementById('animeFavBtn'),
    share: document.getElementById('animeShareBtn'),
    start: document.getElementById('animeWatchStart'),
    relatedVideos: document.getElementById('animeRelatedVideos'),
    related: document.getElementById('animeRelated'),
    bigPlay: document.getElementById('animeBigPlay'),
    toggle: document.getElementById('animeToggle'),
    progress: document.getElementById('animeProgress'),
    time: document.getElementById('animeTime'),
    lock: document.getElementById('animeLock'),
    lockText: document.getElementById('animeLockText'),
    full: document.getElementById('animeFull'),
  };

  function syncFav() {
    if (!els.fav) return;
    const on = !!(shared.isBookmarked && shared.isBookmarked('anime', anime.id));
    els.fav.classList.toggle('is-on', on);
    els.fav.setAttribute('aria-pressed', String(on));
  }

  function baseLikeCount() {
    return Math.max(120, Math.round(parseViews(anime.views) * 0.025));
  }

  function syncLike() {
    if (!els.likes || !shared.bindLikeButton) return;
    shared.bindLikeButton(els.likes, 'anime', anime.id, {
      countEl: els.likeCount,
      baseCount: baseLikeCount(),
    });
  }

  function tt(key, fallback) {
    return (shared.t && shared.t(key, fallback)) || fallback || '';
  }

  function readAdminDb() {
    try {
      const db = JSON.parse(localStorage.getItem(ADMIN_DB_KEY) || 'null');
      return db && typeof db === 'object' ? db : null;
    } catch (err) {
      return null;
    }
  }

  function adminEpisodeOf(id, no) {
    const db = readAdminDb();
    const list = (db && db.episodes) || [];
    return list.find((item) => item.comicId === id && Number(item.no) === Number(no)) || null;
  }

  function adminWorkOf(id) {
    const db = readAdminDb();
    const list = (db && db.anime) || [];
    return list.find((item) => item.id === id) || null;
  }

  function adminAssetUrl(ref) {
    if (!ref) return Promise.resolve('');
    if (/^https?:\/\//i.test(ref) || ref.indexOf('blob:') === 0) return Promise.resolve(ref);
    if (String(ref).indexOf('idb:') !== 0) return Promise.resolve(ref);
    return new Promise((resolve) => {
      const req = indexedDB.open(ADMIN_ASSET_DB, 1);
      req.onerror = () => resolve('');
      req.onsuccess = () => {
        const idb = req.result;
        if (!idb.objectStoreNames.contains('files')) { resolve(''); return; }
        const tx = idb.transaction('files', 'readonly');
        const get = tx.objectStore('files').get(ref);
        get.onerror = () => resolve('');
        get.onsuccess = () => {
          const blob = get.result;
          if (!blob) { resolve(''); return; }
          if (typeof blob === 'string') { resolve(blob); return; }
          resolve(URL.createObjectURL(blob));
        };
      };
    });
  }

  function attachVideo(url) {
    const video = els.video;
    if (videoObjectUrl && videoObjectUrl.indexOf('blob:') === 0 && videoObjectUrl !== url) {
      try { URL.revokeObjectURL(videoObjectUrl); } catch (err) {}
    }
    videoObjectUrl = url && String(url).indexOf('blob:') === 0 ? url : '';
    videoSrc = url || '';
    if (els.player) els.player.classList.toggle('has-video', !!url);
    if (!video) return;
    if (url) {
      video.src = url;
      video.load();
    } else {
      video.removeAttribute('src');
      video.load();
    }
  }

  function loadEpisodeVideo() {
    playDuration = anime.durationSec || 24;
    const rec = adminEpisodeOf(anime.id, ep);
    const work = adminWorkOf(anime.id);
    const key = (rec && rec.videoKey) || '';
    const href = (rec && rec.videoUrl) || '';
    const trailerKey = (!key && !href && Number(ep) === 1 && work && work.trailerKey) || '';
    const trailerHref = (!key && !href && Number(ep) === 1 && work && work.trailerUrl) || '';
    if (key) return adminAssetUrl(key).then(attachVideo);
    if (href) { attachVideo(href); return Promise.resolve(); }
    if (trailerKey) return adminAssetUrl(trailerKey).then(attachVideo);
    if (trailerHref) { attachVideo(trailerHref); return Promise.resolve(); }
    attachVideo('');
    return Promise.resolve();
  }

  function renderMeta() {
    const locTitle = shared.localizedTitle ? shared.localizedTitle(anime) : anime.title;
    const epText = shared.epLabel ? shared.epLabel(ep, 'anime') : (`第${ep}集`);
    document.title = `${locTitle} ${epText} - ${tt('navAnime', '动画')} - COMICSN`;
    els.shot.src = anime.poster;
    els.shot.alt = locTitle;
    els.title.textContent = `${locTitle}`;
    if (els.author) els.author.textContent = shared.localizedPhrase ? shared.localizedPhrase(anime.author || '') : (anime.author || '');
    if (els.published) els.published.textContent = `${tt('published', '发布时间')}: ${publishedOf(anime)}`;
    if (els.exclusive) {
      els.exclusive.hidden = !(anime.featured || anime.exclusive);
      els.exclusive.textContent = tt('exclusive', '独播');
    }
    if (els.hot) els.hot.hidden = !anime.hot;
    const viewCount = parseViews(anime.views);
    syncLike();
    if (els.views) els.views.innerHTML = `${EYE}${formatCount(viewCount)}${tt('viewsTimes', '次观看')}`;
    if (els.details) {
      const lang = shared.currentLang ? shared.currentLang() : 'zh';
      const authorName = (shared.localizedPhrase && anime.author)
        ? shared.localizedPhrase(anime.author)
        : (anime.author || 'COMICSN');
      els.details.textContent = (lang === 'zh' && anime.blurb)
        ? anime.blurb
        : tt('animeBlurbTpl', '{title} 动画版，由 {author} 制作，现已更新至第{n}集。')
          .replace('{title}', locTitle)
          .replace('{author}', authorName)
          .replace('{n}', String(anime.eps));
    }
    els.tags.innerHTML = (anime.tags || []).map((tag) => `<span class="anime-watch-tag">#${escapeHtml(shared.localizedPhrase ? shared.localizedPhrase(tag) : tag)}</span>`).join('');
    syncFav();
    if (els.start) els.start.textContent = tt('freeWatch', '免费观看第1集 >');
    if (els.relatedVideos) {
      els.relatedVideos.innerHTML = relatedVideosOf(anime).map((row) => {
        const flagClass = row.free ? 'is-free' : 'is-vip';
        const flagText = row.free ? tt('tabFree', '免费') : 'VIP';
        const badge = row.isNew ? '<span class="anime-new-badge">NEW</span>' : '';
        const rowTitle = shared.localizedTitle ? shared.localizedTitle(row.item) : row.item.title;
        const time = shared.localizedDuration ? shared.localizedDuration(row.time) : row.time;
        return `<a href="anime-watch.html?id=${encodeURIComponent(row.item.id)}&ep=${row.ep}" class="anime-relvid">
          <div class="anime-relvid-thumb">
            ${badge}
            <img src="${row.item.poster}" alt="${escapeHtml(rowTitle)}" loading="lazy">
            <span class="anime-play-mark" aria-hidden="true">${PLAY}</span>
            <span class="anime-time">${escapeHtml(time)}</span>
          </div>
          <h3 class="anime-relvid-title">${escapeHtml(rowTitle)}</h3>
          <p class="anime-relvid-ep"><span>${shared.epLabel ? shared.epLabel(row.ep, 'anime') : ('第' + row.ep + '集')}</span><span class="anime-relvid-flag ${flagClass}">${flagText}</span></p>
        </a>`;
      }).join('');
    }
    if (els.related) {
      els.related.innerHTML = guessYouLike(anime).map((item) => {
        const title = shared.localizedTitle ? shared.localizedTitle(item) : item.title;
        const duration = shared.localizedDuration ? shared.localizedDuration(item.duration) : item.duration;
        return `<a href="anime-watch.html?id=${encodeURIComponent(item.id)}" class="anime-card">
          <div class="anime-thumb">
            <img src="${item.poster}" alt="${escapeHtml(title)}" loading="lazy">
            <span class="anime-play-mark" aria-hidden="true">${PLAY}</span>
            <span class="anime-time">${escapeHtml(duration)}</span>
          </div>
          <h3 class="anime-title">${escapeHtml(title)}</h3>
        </a>`;
      }).join('');
    }
  }

  function syncTime() {
    const total = playDuration || 1;
    els.progress.value = String((current / total) * 100);
    els.time.textContent = `${formatTime(current)} / ${formatTime(total)}`;
  }

  function setPlaying(on) {
    const episode = allEps[ep - 1];
    if (on && !canRead(episode)) return;
    playing = on;
    els.player.classList.toggle('is-playing', playing);
    els.toggle.innerHTML = playing ? PAUSE : PLAY;
    els.bigPlay.innerHTML = playing ? PAUSE : PLAY;
    window.clearInterval(timer);
    if (els.video && videoSrc) {
      if (playing) els.video.play().catch(() => setPlaying(false));
      else els.video.pause();
      return;
    }
    if (!playing) return;
    timer = window.setInterval(() => {
      current += 0.25;
      if (current >= playDuration) {
        current = playDuration;
        setPlaying(false);
      }
      syncTime();
    }, 250);
  }

  function showLock(show) {
    els.lock.hidden = !show;
    els.bigPlay.hidden = show;
    els.toggle.disabled = show;
    els.progress.disabled = show;
    if (els.lockText) els.lockText.textContent = tt('lockFromEp', '第{n}集起为 VIP 专属，开通后可继续观看').replace('{n}', String(VIP_FROM_EP));
  }

  function recordWatch() {
    if (shared.recordHistory && anime.id) shared.recordHistory('anime', anime.id, ep);
  }

  function goTo(nextEp, autoplay) {
    ep = nextEp;
    current = 0;
    setPlaying(false);
    history.replaceState({ ep }, '', `anime-watch.html?id=${anime.id}&ep=${ep}`);
    renderMeta();
    const readable = canRead(allEps[ep - 1]);
    showLock(!readable);
    syncTime();
    recordWatch();
    loadEpisodeVideo().then(() => {
      if (autoplay && readable) setPlaying(true);
    });
  }

  renderMeta();
  showLock(!canRead(allEps[ep - 1]));
  syncTime();
  recordWatch();
  els.toggle.innerHTML = PLAY;
  els.bigPlay.innerHTML = PLAY;
  loadEpisodeVideo();

  if (els.video) {
    els.video.addEventListener('loadedmetadata', () => {
      if (els.video.duration && isFinite(els.video.duration)) playDuration = els.video.duration;
      syncTime();
    });
    els.video.addEventListener('timeupdate', () => {
      if (!videoSrc) return;
      current = els.video.currentTime || 0;
      syncTime();
    });
    els.video.addEventListener('ended', () => setPlaying(false));
  }

  els.bigPlay.addEventListener('click', () => setPlaying(!playing));
  els.toggle.addEventListener('click', () => setPlaying(!playing));
  els.player.addEventListener('click', (event) => {
    if (event.target.closest('a, button, input') || !els.lock.hidden) return;
    setPlaying(!playing);
  });
  els.progress.addEventListener('input', () => {
    current = (Number(els.progress.value) / 100) * (playDuration || 1);
    if (els.video && videoSrc) els.video.currentTime = current;
    syncTime();
  });
  if (els.start) {
    els.start.addEventListener('click', () => goTo(1, true));
  }
  if (els.likes) window.addEventListener('comicsn:likechange', syncLike);
  if (els.fav) {
    if (shared.bindBookmarkButton) shared.bindBookmarkButton(els.fav, 'anime', anime.id);
    window.addEventListener('comicsn:bookmarkchange', syncFav);
  }
  if (shared.bindShareButton) {
    shared.bindShareButton(els.share, () => (
      shared.localizedTitle ? shared.localizedTitle(anime) : anime.title
    ));
  }
  els.full.addEventListener('click', () => {
    if (!document.fullscreenElement) els.player.requestFullscreen?.();
    else document.exitFullscreen?.();
  });
  window.addEventListener('comicsn:langchange', () => {
    renderMeta();
    showLock(!canRead(allEps[ep - 1]));
  });
})();
