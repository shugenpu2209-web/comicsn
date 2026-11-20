(function () {
  'use strict';

  const shared = window.ComicsShared || {};
  const COMIC_ID = new URLSearchParams(window.location.search).get('id') || 'bully';
  const BACK_HREF = `comic.html?id=${encodeURIComponent(COMIC_ID)}`;
  const PROGRESS_KEY = 'comicsn-reader-progress';
  const SETTINGS_KEY = 'comicsn-reader-settings';
  const canRead = shared.canRead;
  function tt(key, fallback) {
    return (shared.t && shared.t(key, fallback)) || fallback || '';
  }
  function phrase(text) {
    return shared.localizedPhrase ? shared.localizedPhrase(text) : text;
  }
  const STORY_I18N = {
    '开学第一天。优丸只想安稳地走过那条最热闹的走廊。': { en: 'First day of school. Youwan only wanted to walk the busiest hallway in peace.', pt: 'Primeiro dia de aula. Youwan só queria atravessar o corredor mais movimentado em paz.' },
    '对、对不起！我不是故意撞到你的……': { en: 'I-I’m sorry! I didn’t mean to bump into you…', pt: 'D-desculpa! Eu não quis esbarrar em você…' },
    '看路啊，小不点。': { en: 'Watch where you’re going, shorty.', pt: 'Olha por onde anda, baixinha.' },
    '校园传说里的「恶霸」，原来只是靠得太近。': { en: 'The campus “bully” of legend was just standing too close.', pt: 'A “valentona” da lenda só estava perto demais.' },
    '（心跳）……她记住我了？': { en: '(heartbeat) …She remembered me?', pt: '(coração) …Ela lembrou de mim?' },
    '第二天，优丸在布告栏前看见一张字条。': { en: 'The next day, Youwan finds a note on the board.', pt: 'No dia seguinte, Youwan vê um bilhete no mural.' },
    '「放学后，天台。不准迟到。」……这是给我的？': { en: '“Rooftop after school. Don’t be late.” …Is this for me?', pt: '“Terraço depois da aula. Não se atrase.” …Isso é para mim?' },
    '来都来了。从今天起，你负责帮我跑腿。': { en: 'You’re here. From today, you run my errands.', pt: 'Já que veio. A partir de hoje, você faz os recados.' },
    '所谓约定，其实是一场逃不掉的同居式相处。': { en: 'The so-called promise is really a closeness neither can escape.', pt: 'A tal promessa é uma convivência da qual não dá para fugir.' },
    '食堂永远拥挤。优丸端着托盘，却找不到位子。': { en: 'The cafeteria is always packed. Youwan holds a tray and cannot find a seat.', pt: 'O refeitório está sempre cheio. Youwan segura a bandeja e não acha lugar.' },
    '那桌是她的。谁敢坐？': { en: 'That table is hers. Who would dare sit?', pt: 'Aquela mesa é dela. Quem ousa sentar?' },
    '你愣着干什么。坐过来。': { en: 'What are you standing there for? Sit.', pt: 'Está parado para quê? Senta.' },
    '一顿午饭，让走廊上的窃窃私语更响了。': { en: 'One lunch makes the hallway whispers even louder.', pt: 'Um almoço deixa os sussurros do corredor ainda mais altos.' },
    '旧教学楼三层，有一间没人用的音乐教室。': { en: 'On the third floor of the old building is an unused music room.', pt: 'No terceiro andar do prédio antigo há uma sala de música vazia.' },
    '原来你午休都躲在这里……': { en: 'So this is where you hide at lunch…', pt: 'Então é aqui que você se esconde no intervalo…' },
    '外面太吵。这里只有你知道。': { en: 'It’s too loud out there. You’re the only one who knows this place.', pt: 'Lá fora é barulho demais. Só você sabe deste lugar.' },
    '秘密一旦分享，就不再只属于一个人。': { en: 'Once a secret is shared, it no longer belongs to one person.', pt: 'Quando o segredo é compartilhado, deixa de ser de uma só pessoa.' },
    '放学时下起暴雨。校门口只剩一把伞。': { en: 'A storm hits at dismissal. Only one umbrella is left at the gate.', pt: 'A tempestade cai na saída. Só resta um guarda-chuva no portão.' },
    '我送你吧。路有点远。': { en: 'I’ll walk you. It’s a bit far.', pt: 'Eu te acompanho. O caminho é um pouco longo.' },
    '……那就走慢一点。': { en: '…Then walk a little slower.', pt: '…Então anda um pouco mais devagar.' },
    '雨声很大。心跳更大。': { en: 'The rain is loud. The heartbeat is louder.', pt: 'A chuva é alta. O coração é mais alto.' },
    '新学期的班会，优丸被叫到讲台。': { en: 'At the new-term meeting, Youwan is called to the front.', pt: 'Na reunião do novo semestre, Youwan é chamado à frente.' },
    '我、我可以坐在她旁边吗？': { en: 'C-can I sit next to her?', pt: 'E-eu posso sentar ao lado dela?' },
    '问完才知道害羞，晚了。': { en: 'Too late to get shy after asking.', pt: 'Tarde demais para ter vergonha depois de perguntar.' },
    '故事才刚开始。走廊尽头，阳光很好。': { en: 'The story is only beginning. At the end of the hallway, the light is good.', pt: 'A história só está começando. No fim do corredor, a luz está boa.' },
  };
  function locStory(text) {
    const raw = String(text || '');
    let zh = raw;
    let pack = STORY_I18N[raw];
    if (!pack) {
      const hit = Object.entries(STORY_I18N).find(([, item]) => item.en === raw || item.pt === raw);
      if (hit) {
        zh = hit[0];
        pack = hit[1];
      }
    }
    const lang = shared.currentLang ? shared.currentLang() : 'zh';
    if (lang === 'zh' || !pack) return zh;
    return pack[lang] || zh;
  }
  const THUMB = 'assets/comics/thumb-2.webp';
  const CUTS = {
    a: 'assets/comics/thumb-2.webp',
    b: 'assets/comics/thumb-4.webp',
    c: 'assets/comics/thumb-5.webp',
    d: 'assets/comics/thumb-1.webp',
  };

  const EPISODES = [
    { id: 1, title: '初次相遇', date: '2025.08.01', free: true },
    { id: 2, title: '意外的约定', date: '2025.08.08', free: false },
    { id: 3, title: '食堂风波', date: '2025.08.15', free: false },
    { id: 4, title: '秘密基地', date: '2025.08.22', free: false },
    { id: 5, title: '雨天的告白', date: '2025.08.29', free: false },
    { id: 6, title: '新的开始', date: '2025.09.05', free: false },
  ];

  const STORIES = {
    1: [
      { t: 'caption', text: '开学第一天。优丸只想安稳地走过那条最热闹的走廊。' },
      { t: 'art', src: CUTS.a, pos: 'center 12%' },
      { t: 'say', name: '优丸', text: '对、对不起！我不是故意撞到你的……' },
      { t: 'art', src: CUTS.b, pos: 'center 30%' },
      { t: 'say', name: '学姐', text: '看路啊，小不点。', other: true },
      { t: 'caption', text: '校园传说里的「恶霸」，原来只是靠得太近。' },
      { t: 'art', src: CUTS.a, pos: 'center 55%' },
      { t: 'say', name: '优丸', text: '（心跳）……她记住我了？' },
    ],
    2: [
      { t: 'caption', text: '第二天，优丸在布告栏前看见一张字条。' },
      { t: 'art', src: CUTS.d, pos: 'center 20%' },
      { t: 'say', name: '优丸', text: '「放学后，天台。不准迟到。」……这是给我的？' },
      { t: 'art', src: CUTS.a, pos: 'center 50%' },
      { t: 'say', name: '学姐', text: '来都来了。从今天起，你负责帮我跑腿。', other: true },
      { t: 'caption', text: '所谓约定，其实是一场逃不掉的同居式相处。' },
    ],
    3: [
      { t: 'caption', text: '食堂永远拥挤。优丸端着托盘，却找不到位子。' },
      { t: 'art', src: CUTS.b, pos: 'center 25%' },
      { t: 'say', name: '同学', text: '那桌是她的。谁敢坐？', other: true },
      { t: 'art', src: CUTS.a, pos: 'center 8%' },
      { t: 'say', name: '学姐', text: '你愣着干什么。坐过来。', other: true },
      { t: 'caption', text: '一顿午饭，让走廊上的窃窃私语更响了。' },
    ],
    4: [
      { t: 'caption', text: '旧教学楼三层，有一间没人用的音乐教室。' },
      { t: 'art', src: CUTS.c, pos: 'center 30%' },
      { t: 'say', name: '优丸', text: '原来你午休都躲在这里……' },
      { t: 'art', src: CUTS.a, pos: 'center 20%' },
      { t: 'say', name: '学姐', text: '外面太吵。这里只有你知道。', other: true },
      { t: 'caption', text: '秘密一旦分享，就不再只属于一个人。' },
    ],
    5: [
      { t: 'caption', text: '放学时下起暴雨。校门口只剩一把伞。' },
      { t: 'art', src: CUTS.d, pos: 'center 40%' },
      { t: 'say', name: '优丸', text: '我送你吧。路有点远。' },
      { t: 'art', src: CUTS.a, pos: 'center 70%' },
      { t: 'say', name: '学姐', text: '……那就走慢一点。', other: true },
      { t: 'caption', text: '雨声很大。心跳更大。' },
    ],
    6: [
      { t: 'caption', text: '新学期的班会，优丸被叫到讲台。' },
      { t: 'art', src: CUTS.b, pos: 'center 18%' },
      { t: 'say', name: '优丸', text: '我、我可以坐在她旁边吗？' },
      { t: 'art', src: CUTS.a, pos: 'center 15%' },
      { t: 'say', name: '学姐', text: '问完才知道害羞，晚了。', other: true },
      { t: 'caption', text: '故事才刚开始。走廊尽头，阳光很好。' },
    ],
  };

  const els = {
    reader: document.getElementById('reader'),
    stage: document.getElementById('readerStage'),
    label: document.getElementById('readerEpisodeLabel'),
    bar: document.getElementById('readerProgressBar'),
    prev: document.getElementById('readerPrev'),
    next: document.getElementById('readerNext'),
    listBtn: document.getElementById('readerListBtn'),
    listSheet: document.getElementById('readerListSheet'),
    list: document.getElementById('readerEpisodeList'),
    settingsBtn: document.getElementById('readerSettingsBtn'),
    settingsSheet: document.getElementById('readerSettingsSheet'),
    brightness: document.getElementById('readerBrightness'),
    brightnessValue: document.getElementById('readerBrightnessValue'),
  };

  let currentEp = 1;
  let hideTimer = 0;
  let ignoreScroll = false;

  function clampEp(value) {
    const num = Number(value) || 1;
    return Math.min(EPISODES.length, Math.max(1, num));
  }

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) || 'null') || {};
    } catch (err) {
      return {};
    }
  }

  function saveProgress(extra) {
    const payload = Object.assign({ comicId: COMIC_ID, ep: currentEp, ratio: 0 }, loadProgress(), extra);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(payload));
  }

  function loadSettings() {
    try {
      return Object.assign({ width: 'regular', brightness: 100 }, JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null'));
    } catch (err) {
      return { width: 'regular', brightness: 100 };
    }
  }

  function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  function applySettings(settings) {
    els.stage.classList.remove('is-narrow', 'is-regular', 'is-wide');
    els.stage.classList.add('is-' + settings.width);
    els.stage.style.setProperty('--reader-brightness', String(settings.brightness / 100));
    document.querySelectorAll('[data-width]').forEach((btn) => {
      btn.classList.toggle('is-on', btn.dataset.width === settings.width);
    });
    if (els.brightness) els.brightness.value = String(settings.brightness);
    if (els.brightnessValue) els.brightnessValue.textContent = settings.brightness + '%';
  }

  function episodeById(id) {
    return EPISODES.find((item) => item.id === id) || EPISODES[0];
  }

  function renderCover(episode) {
    return `
      <section class="reader-cover">
        <p class="reader-cover-kicker">COMICSN ORIGINAL</p>
        <h2>${(shared.localizedTitle && shared.localizedTitle({ id: COMIC_ID, title: '恶霸的爱情故事' })) || '恶霸的爱情故事'}</h2>
        <p>${shared.epLabel ? shared.epLabel(episode.id, 'comic') : ('第' + episode.id + '集')} · ${phrase(episode.title)}</p>
      </section>
    `;
  }

  function renderPanels(episode, locked) {
    const story = STORIES[episode.id] || [];
    const visible = locked ? story.slice(0, 2) : story;
    return visible.map((panel) => {
      if (panel.t === 'caption') {
        return `<p class="reader-caption">${locStory(panel.text)}</p>`;
      }
      if (panel.t === 'say') {
        const side = panel.other ? ' is-other' : '';
        return `<figure class="reader-balloon${side}"><figcaption>${phrase(panel.name)}</figcaption><blockquote>${locStory(panel.text)}</blockquote></figure>`;
      }
      if (panel.t === 'art') {
        return `<figure class="reader-cut"><img src="${panel.src}" alt="" style="object-position:${panel.pos || 'center'}"></figure>`;
      }
      return '';
    }).join('');
  }

  function renderLock(episode) {
    return `
      <section class="reader-lock">
        <p class="reader-lock-kicker">${tt('membership', '会员资格')}</p>
        <h2>${tt('continueRead', '开通 VIP 继续阅读')}</h2>
        <p>${tt('lockFromEp', '第{n}集起为 VIP 专属，开通后可继续观看').replace('{n}', String(episode.id))}</p>
        <a class="reader-lock-btn" href="mypage.html#vip">${tt('goVip', '前往充值')}</a>
      </section>
    `;
  }

  function renderEnd(episode) {
    const next = episodeById(episode.id + 1);
    const hasNext = episode.id < EPISODES.length;
    return `
      <section class="reader-end">
        <h2>${tt('epDone', '第{n}集 完').replace('{n}', String(episode.id))}</h2>
        <p>${hasNext ? tt('nextEp', '下一集：') + phrase(next.title) : tt('latestEp', '已是最新一集')}</p>
        <div class="reader-end-actions">
          ${hasNext ? `<button type="button" class="reader-end-btn is-primary" data-go-ep="${next.id}">${tt('readNextEp', '阅读下一集')}</button>` : ''}
          <a class="reader-end-btn is-ghost" href="${BACK_HREF}">${tt('backToWork', '返回作品页')}</a>
        </div>
      </section>
    `;
  }

  function renderEpisodeList() {
    els.list.innerHTML = EPISODES.map((item) => `
      <button type="button" class="reader-ep-item${item.id === currentEp ? ' is-current' : ''}" data-go-ep="${item.id}">
        <img src="${THUMB}" alt="">
        <span>
          <strong>${shared.epLabel ? shared.epLabel(item.id, 'comic') : ('第' + item.id + '集')} · ${phrase(item.title)}</strong>
          <small>${item.date}</small>
        </span>
        <span class="reader-ep-badge ${item.free ? 'is-free' : 'is-vip'}">${item.free ? tt('tabFree', '免费') : tt('members', '会员')}</span>
      </button>
    `).join('');
  }

  function updateProgress() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const ratio = max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max));
    if (els.bar) els.bar.style.width = (ratio * 100).toFixed(1) + '%';
    saveProgress({ ep: currentEp, ratio: Number(ratio.toFixed(3)) });
  }

  function showChrome(autoHide) {
    els.reader.classList.add('is-chrome-on');
    clearTimeout(hideTimer);
    if (autoHide) {
      hideTimer = window.setTimeout(() => els.reader.classList.remove('is-chrome-on'), 2800);
    }
  }

  function setSheet(sheet, open) {
    if (!sheet) return;
    sheet.classList.toggle('is-open', open);
    sheet.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function closeSheets() {
    setSheet(els.listSheet, false);
    setSheet(els.settingsSheet, false);
  }

  function render(ep, options) {
    const episode = episodeById(ep);
    const locked = !canRead(episode);
    currentEp = episode.id;
    const workTitle = (shared.localizedTitle && shared.localizedTitle({ id: COMIC_ID, title: '恶霸的爱情故事' })) || '恶霸的爱情故事';
    document.title = `${phrase(episode.title)} - ${workTitle} - COMICSN`;
    els.label.textContent = `${shared.epLabel ? shared.epLabel(episode.id, 'comic') : ('第' + episode.id + '集')} · ${phrase(episode.title)}`;
    els.prev.disabled = episode.id <= 1;
    els.next.disabled = episode.id >= EPISODES.length;
    els.stage.innerHTML = renderCover(episode) + renderPanels(episode, locked) + (locked ? renderLock(episode) : renderEnd(episode));
    renderEpisodeList();
    history[options && options.push ? 'pushState' : 'replaceState']({ ep: episode.id }, '', `reader.html?id=${encodeURIComponent(COMIC_ID)}&ep=${episode.id}`);
    ignoreScroll = true;
    window.scrollTo(0, 0);
    if (options && options.restore && options.ratio) {
      window.setTimeout(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, Math.max(0, max * options.ratio));
        updateProgress();
        ignoreScroll = false;
      }, 180);
    } else {
      updateProgress();
      window.requestAnimationFrame(() => {
        ignoreScroll = false;
      });
    }
    showChrome(true);
    if (shared.recordHistory) shared.recordHistory('comic', COMIC_ID, episode.id);
  }

  function goTo(ep, push) {
    render(clampEp(ep), { push: Boolean(push) });
  }

  function initialEpisode() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('ep')) return clampEp(params.get('ep'));
    const saved = loadProgress();
    if (saved.comicId === COMIC_ID && saved.ep) return clampEp(saved.ep);
    return 1;
  }

  function applyReaderChrome() {
    const lang = shared.currentLang ? shared.currentLang() : 'zh';
    document.documentElement.lang = lang === 'en' ? 'en' : lang === 'pt' ? 'pt-BR' : 'zh-CN';
    const workTitle = (shared.localizedTitle && shared.localizedTitle({ id: COMIC_ID, title: '恶霸的爱情故事' })) || '恶霸的爱情故事';
    const heading = document.querySelector('.reader-comic');
    if (heading) heading.textContent = workTitle;
    if (els.prev) els.prev.textContent = tt('prevEp', '上一集');
    if (els.next) els.next.textContent = tt('nextEpBtn', '下一集');
    if (els.listBtn) {
      const label = els.listBtn.childNodes[els.listBtn.childNodes.length - 1];
      if (label && label.nodeType === 3) label.textContent = '\n        ' + tt('toc', '目录') + '\n      ';
      else {
        const span = document.createElement('span');
        span.textContent = tt('toc', '目录');
      }
    }
    const listTitle = document.getElementById('readerListTitle');
    if (listTitle) listTitle.textContent = tt('pickEp', '选集');
    const settingsTitle = document.getElementById('readerSettingsTitle');
    if (settingsTitle) settingsTitle.textContent = tt('readerSettings', '阅读设置');
    const widthLabel = document.querySelector('.reader-setting-label');
    if (widthLabel && !widthLabel.querySelector('#readerBrightnessValue')) widthLabel.textContent = tt('panelWidth', '画面宽度');
    document.querySelectorAll('[data-width]').forEach((btn) => {
      const map = { narrow: 'widthNarrow', regular: 'widthRegular', wide: 'widthWide' };
      if (map[btn.dataset.width]) btn.textContent = tt(map[btn.dataset.width], btn.textContent);
    });
    const brightLabel = document.querySelector('#readerBrightness')?.closest('.reader-setting')?.querySelector('.reader-setting-label');
    if (brightLabel) {
      const value = document.getElementById('readerBrightnessValue');
      brightLabel.childNodes[0].textContent = tt('brightness', '亮度') + ' ';
      if (value && !brightLabel.contains(value)) brightLabel.appendChild(value);
    }
    document.querySelectorAll('[data-close-sheet]').forEach((btn) => {
      btn.setAttribute('aria-label', tt('close', '关闭'));
    });
    document.querySelector('.reader-seg')?.setAttribute('aria-label', tt('panelWidth', '画面宽度'));
    const back = document.getElementById('readerBackBtn');
    if (back) back.setAttribute('aria-label', tt('backToWork', '返回作品页'));
    const bookmarkBtn = document.getElementById('readerBookmarkBtn');
    if (bookmarkBtn) bookmarkBtn.setAttribute('aria-label', tt('bookmark', '收藏'));
    if (els.settingsBtn) els.settingsBtn.setAttribute('aria-label', tt('readerSettings', '阅读设置'));
  }

  function bind() {
    const backBtn = document.getElementById('readerBackBtn');
    if (backBtn) backBtn.href = BACK_HREF;
    els.stage.addEventListener('click', (event) => {
      if (event.target.closest('a, button')) return;
      els.reader.classList.toggle('is-chrome-on');
    });

    els.prev.addEventListener('click', () => {
      if (currentEp > 1) goTo(currentEp - 1, true);
    });
    els.next.addEventListener('click', () => {
      if (currentEp < EPISODES.length) goTo(currentEp + 1, true);
    });

    els.listBtn.addEventListener('click', () => {
      renderEpisodeList();
      setSheet(els.listSheet, true);
    });
    els.settingsBtn.addEventListener('click', () => setSheet(els.settingsSheet, true));

    document.querySelectorAll('[data-close-sheet]').forEach((btn) => {
      btn.addEventListener('click', closeSheets);
    });

    els.list.addEventListener('click', (event) => {
      const target = event.target.closest('[data-go-ep]');
      if (!target) return;
      closeSheets();
      goTo(target.dataset.goEp, true);
    });

    els.stage.addEventListener('click', (event) => {
      const target = event.target.closest('[data-go-ep]');
      if (!target) return;
      goTo(target.dataset.goEp, true);
    });

    const settings = loadSettings();
    applySettings(settings);
    document.querySelectorAll('[data-width]').forEach((btn) => {
      btn.addEventListener('click', () => {
        settings.width = btn.dataset.width;
        saveSettings(settings);
        applySettings(settings);
      });
    });
    els.brightness.addEventListener('input', () => {
      settings.brightness = Number(els.brightness.value);
      saveSettings(settings);
      applySettings(settings);
    });

    window.addEventListener('scroll', () => {
      updateProgress();
      if (!ignoreScroll) els.reader.classList.remove('is-chrome-on');
    }, { passive: true });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (els.listSheet.classList.contains('is-open') || els.settingsSheet.classList.contains('is-open')) {
          closeSheets();
          return;
        }
        window.location.href = BACK_HREF;
        return;
      }
      if (event.key === 'ArrowLeft' && currentEp > 1) goTo(currentEp - 1, true);
      if (event.key === 'ArrowRight' && currentEp < EPISODES.length) goTo(currentEp + 1, true);
    });

    window.addEventListener('popstate', (event) => {
      const ep = event.state && event.state.ep ? event.state.ep : initialEpisode();
      render(clampEp(ep));
    });

    window.addEventListener('comicsn:langchange', () => {
      applyReaderChrome();
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const ratio = max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max));
      render(currentEp, { restore: true, ratio });
    });
  }

  bind();
  if (shared.bindBookmarkButton) {
    shared.bindBookmarkButton(document.getElementById('readerBookmarkBtn'), 'comic', COMIC_ID);
  }
  applyReaderChrome();
  const params = new URLSearchParams(window.location.search);
  const saved = loadProgress();
  if (!params.get('ep') && saved.comicId === COMIC_ID && saved.ratio) {
    render(initialEpisode(), { restore: true, ratio: saved.ratio });
  } else {
    render(initialEpisode());
  }
})();
