(function () {
  'use strict';

  const shared = window.ComicsShared || {};
  const { THUMBS, BADGE_VIEW, rotateList, ANIMATIONS, COMICS } = shared;

  const MANGA_RANKING = [
    { id: 'bully', views: '277.2K', ep: '第24集', up: true },
    { id: 'evolution', views: '36K', ep: '第47集', up: true },
    { id: 'too-much', views: '20K', ep: '第88集' },
    { id: 'drawing', views: '15K', ep: '第62集' },
    { id: 'mom', views: '12K', ep: '第45集', up: true },
    { id: 'vengeance', views: '9.8K', ep: '第51集' },
    { id: 'classmate', views: '8.2K', ep: '第39集' },
    { id: 'asteroid', views: '7.5K', ep: '第28集' },
    { id: 'starry', views: '6.1K', ep: '第33集' },
    { id: 'white-hole', views: '5.4K', ep: '第19集' },
    { id: 'zombie', views: '4.9K', ep: '第22集' },
    { id: 'muscle', views: '2.7K', ep: '第29集', up: true },
    { id: 'yurong', views: '4.2K', ep: '第17集' },
    { id: 'no-hero', views: '3.8K', ep: '第41集' },
    { id: 'hunter', views: '3.1K', ep: '第26集' },
    { id: 'drink', views: '2.9K', ep: '第14集' },
    { id: 'angel', views: '1K', ep: '第25集', up: true },
    { id: 'boy-world', views: '2.4K', ep: '第31集' },
    { id: 'apocalypse', views: '2.1K', ep: '第18集' },
    { id: 'fantasy-tale', views: '1.9K', ep: '第24集' },
    { id: 'growth', views: '1.6K', ep: '第12集' },
    { id: 'space-return', views: '1.4K', ep: '第55集' },
    { id: 'secret-class', views: '1.2K', ep: '第67集' },
    { id: 'witch', views: '497', ep: '第33集', up: true },
    { id: 'love-letter', views: '980', ep: '第8集' },
    { id: 'maid', views: '860', ep: '第11集' },
    { id: 'neighbor', views: '740', ep: '第9集' },
    { id: 'concrete', views: '620', ep: '第16集' },
    { id: 'robot', views: '510', ep: '第7集' },
    { id: 'magical', views: '450', ep: '第27集', up: true },
  ].map((item) => {
    const found = (COMICS || []).find((row) => row.id === item.id);
    return { ...item, title: found ? found.title : item.id, href: `comic.html?id=${encodeURIComponent(item.id)}` };
  });

  const NOVEL_RANKING = [
    { id: 'night-store', views: '88K', ep: '第64章', up: true },
    { id: 'villain-love', views: '61K', ep: '第112章', up: true },
    { id: 'ceo-standin', views: '54K', ep: '第86章' },
    { id: 'campus-xianxia', views: '41K', ep: '第73章', up: true },
    { id: 'last-garden', views: '36K', ep: '第49章' },
    { id: 'starlight-her', views: '29K', ep: '第38章' },
    { id: 'library-reader', views: '24K', ep: '第55章' },
    { id: 'inn-rebirth', views: '21K', ep: '第91章', up: true },
    { id: 'cat-next-door', views: '18K', ep: '第27章' },
    { id: 'last-swordsman', views: '16K', ep: '第44章' },
    { id: 'rain-mystery', views: '13K', ep: '第33章' },
    { id: 'contract-marriage', views: '11K', ep: '第58章' },
    { id: 'magic-fail', views: '9.6K', ep: '第22章', up: true },
    { id: 'villain-moonlight', views: '8.1K', ep: '第47章' },
    { id: 'sea-lighthouse', views: '7.4K', ep: '第19章' },
    { id: 'fake-workplace', views: '6.2K', ep: '第31章' },
    { id: 'dragon-days', views: '5.5K', ep: '第16章' },
    { id: 'time-bookstore', views: '4.8K', ep: '第28章' },
    { id: 'after-masquerade', views: '4.1K', ep: '第12章' },
    { id: 'star-postman', views: '3.6K', ep: '第40章' },
    { id: 'winter-onsen', views: '2.9K', ep: '第15章' },
    { id: 'god-off-duty', views: '2.3K', ep: '第21章' },
    { id: 'silent-pianist', views: '1.8K', ep: '第9章' },
    { id: 'city-south', views: '1.2K', ep: '第18章' },
  ].map((item) => {
    const match = (shared.NOVELS || []).find((novel) => novel.id === item.id);
    return { ...item, title: match ? match.title : item.id, href: `novel-detail.html?id=${encodeURIComponent(item.id)}` };
  });

  const ANIME_RANKING = (ANIMATIONS || []).map((item) => ({
    id: item.id,
    title: item.title,
    views: item.views,
    ep: `第${item.eps}集`,
    up: item.status === 'updating',
    href: `anime-watch.html?id=${item.id}`,
    poster: item.poster,
  }));

  const CATALOGS = {
    manga: MANGA_RANKING,
    novel: NOVEL_RANKING,
    anime: ANIME_RANKING.length ? ANIME_RANKING : MANGA_RANKING,
  };

  const PERIOD_CONFIG = {
    weekly: { offset: 0, viewScale: 1 },
    monthly: { offset: 6, viewScale: 4 },
    quarterly: { offset: 12, viewScale: 8 },
    yearly: { offset: 18, viewScale: 12 },
  };

  const PERIOD_LABELS = {
    weekly: '周榜',
    monthly: '月榜',
    quarterly: '季度榜',
    yearly: '年榜',
  };

  const TYPE_OFFSET = {
    manga: 0,
    novel: 3,
    anime: 1,
  };

  function scaleViews(views, scale) {
    const match = String(views).match(/^([\d.]+)(K)?$/);
    if (!match) return views;

    const value = parseFloat(match[1]) * scale;
    if (match[2]) {
      return value >= 1000 ? `${Math.round(value / 100) / 10}M` : `${value % 1 === 0 ? value : value.toFixed(1)}K`;
    }
    return String(Math.round(parseFloat(match[1]) * scale));
  }

  function prioritizeUp(list) {
    const flagged = [];
    const rest = [];
    (list || []).forEach((item) => {
      if (item && item.up) flagged.push(item);
      else rest.push(item);
    });
    return flagged.concat(rest);
  }

  function getRankingData(type, period) {
    const list = CATALOGS[type] || CATALOGS.manga;
    const config = PERIOD_CONFIG[period] || PERIOD_CONFIG.weekly;
    const offset = config.offset + (TYPE_OFFSET[type] || 0);
    return prioritizeUp(rotateList(list, offset)).map((item) => ({
      ...item,
      views: scaleViews(item.views, config.viewScale),
    }));
  }

  function renderRankingGrid(container, type, period) {
    const data = getRankingData(type, period);
    const localizedTitle = shared.localizedTitle;
    const localizedEp = shared.localizedEp;

    container.innerHTML = data.map((item, index) => {
      const rank = index + 1;
      const thumb = item.poster || THUMBS[index % THUMBS.length];
      const rankHtml = rank <= 3 ? `<span class="ranking-num">${rank}</span>` : '';
      const badgeHtml = item.up && shared.badgeUpHtml
        ? `<span class="ranking-badges">${shared.badgeUpHtml()}</span>`
        : '';
      const source = (type === 'novel' ? shared.NOVELS : type === 'anime' ? ANIMATIONS : COMICS || [])
        .find((row) => row.title === item.title || row.id === item.id) || item;
      const title = localizedTitle ? localizedTitle(source) : item.title;
      const ep = localizedEp ? localizedEp(item.ep, type === 'novel' ? 'novel' : 'comic') : item.ep;

      return `
        <a href="${item.href}" class="ranking-card">
          <div class="ranking-thumb">
            <img src="${thumb}" alt="${title}" loading="lazy">
            ${rankHtml}
          </div>
          <div class="ranking-title-row">
            <h3 class="ranking-title">${title}</h3>
            ${badgeHtml}
          </div>
          <div class="comic-meta ranking-meta">
            <span class="ep">${ep}</span>
            <span class="views"><img src="${BADGE_VIEW}" alt=""> ${item.views}</span>
          </div>
        </a>
      `;
    }).join('');
  }

  function typeFromLocation() {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get('type');
    const fromHash = (window.location.hash || '').replace('#', '');
    const value = fromQuery || fromHash;
    return ['manga', 'novel', 'anime'].includes(value) ? value : 'manga';
  }

  function applyTypeTab(type) {
    document.querySelectorAll('.ranking-type').forEach((tab) => {
      const active = tab.dataset.type === type;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
    });
  }

  function initRankingPage() {
    const grid = document.getElementById('rankingGrid');
    if (!grid) return;

    const state = { type: typeFromLocation(), period: 'weekly' };
    applyTypeTab(state.type);

    function render() {
      renderRankingGrid(grid, state.type, state.period);
    }

    if (typeof shared.bindGroup === 'function') {
      shared.bindGroup('.ranking-type', 'type', state, 'type', render, (type) => {
        const url = new URL(window.location.href);
        url.searchParams.set('type', type);
        url.hash = '';
        history.replaceState(null, '', url.pathname + url.search);
      });
    }

    window.addEventListener('hashchange', () => {
      const next = typeFromLocation();
      if (next === state.type) return;
      state.type = next;
      applyTypeTab(next);
      render();
    });

    if (typeof shared.bindSortMenu === 'function') {
      shared.bindSortMenu({
        wrap: document.getElementById('rankingPeriod'),
        btn: document.getElementById('rankingPeriodBtn'),
        label: document.getElementById('rankingPeriodLabel'),
        options: document.querySelectorAll('.ranking-period-option'),
        labels: PERIOD_LABELS,
        fallbackKey: 'weekly',
        onChange(period) {
          state.period = period;
          render();
        },
      });
    }

    render();
    window.addEventListener('comicsn:langchange', render);
  }

  initRankingPage();
})();
