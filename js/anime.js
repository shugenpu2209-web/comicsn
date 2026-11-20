(function () {
  'use strict';

  const shared = window.ComicsShared || {};
  const ANIMATIONS = shared.ANIMATIONS || [];
  const sortCatalogList = shared.sortCatalogList;
  const bindSortMenu = shared.bindSortMenu;
  const PLAY_ICON = shared.PLAY_ICON;

  const SORT_LABELS = {
    popularity: '按人气排序',
    views: '播放量最高',
    latest: '最新',
  };

  function filterList(tab) {
    if (!tab || tab === 'all') return ANIMATIONS;
    if (tab === 'updating') return ANIMATIONS.filter((item) => item.status === 'updating');
    if (tab === 'ended') return ANIMATIONS.filter((item) => item.status === 'ended');
    if (tab === 'vip') return ANIMATIONS.filter((item) => !item.free);
    if (tab === 'free') return ANIMATIONS.filter((item) => item.free);
    return ANIMATIONS;
  }

  function cardHtml(item) {
    const title = shared.localizedTitle ? shared.localizedTitle(item) : item.title;
    const ep = shared.localizedEp ? shared.localizedEp(`第${item.eps}集`) : `第${item.eps}集`;
    const duration = shared.localizedDuration ? shared.localizedDuration(item.duration) : item.duration;
    const plays = (shared.t && shared.t('plays', '播放')) || '播放';
    const newBadge = item.isNew ? '<span class="anime-new-badge">NEW</span>' : '';
    const vipBadge = item.free ? '' : '<span class="anime-vip-badge">VIP</span>';
    const hotIcon = item.hot ? (shared.badgeUpHtml ? shared.badgeUpHtml() : '') : '';
    return `
      <a href="anime-watch.html?id=${item.id}" class="anime-card">
        <div class="anime-thumb">
          <img src="${item.poster}" alt="${title}" loading="lazy">
          ${newBadge}
          ${vipBadge}
          <span class="anime-play-mark" aria-hidden="true">${PLAY_ICON}</span>
          <span class="anime-time">${duration}</span>
        </div>
        <div class="anime-title-row">
          <h3 class="anime-title">${title}</h3>
          ${hotIcon}
        </div>
        <p class="anime-meta">${ep} · ${item.views} ${plays}</p>
      </a>
    `;
  }

  function renderRecommend() {
    const row = document.getElementById('animeRecommend');
    if (!row) return;
    row.innerHTML = ANIMATIONS.filter((item) => item.featured).slice(0, 3)
      .map((item) => cardHtml(item)).join('');
  }

  function renderGrid(state) {
    const grid = document.getElementById('animeGrid');
    if (!grid) return;
    const data = sortCatalogList(filterList(state.tab), state.sort);
    grid.innerHTML = data.length
      ? data.map((item) => cardHtml(item)).join('')
      : `<p class="anime-empty">${(shared.t && shared.t('emptyAnime', '暂无动画')) || '暂无动画'}</p>`;
  }

  function initSort(state, render) {
    if (!bindSortMenu) return;
    bindSortMenu({
      wrap: document.getElementById('animeSort'),
      btn: document.getElementById('animeSortBtn'),
      label: document.getElementById('animeSortLabel'),
      options: document.querySelectorAll('.anime-sort-option'),
      labels: SORT_LABELS,
      fallbackKey: 'popularity',
      onChange(key) {
        state.sort = key;
        render();
      },
    });
  }

  const state = { tab: 'all', sort: 'popularity' };
  function render() {
    renderGrid(state);
  }

  renderRecommend();
  if (typeof shared.bindGroup === 'function') {
    shared.bindGroup('.anime-filter', 'tab', state, 'tab', render);
  }
  initSort(state, render);
  render();
  window.addEventListener('comicsn:langchange', () => {
    renderRecommend();
    render();
  });
})();
