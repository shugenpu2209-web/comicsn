(function () {
  'use strict';

  const shared = window.ComicsShared || {};
  const { prioritizeNew, bindSortMenu, coverOf } = shared;

  const TYPE_LABELS = {
    all: '全部',
    comic: '漫画',
    novel: '小说',
    anime: '动画',
  };

  const TYPE_HREF = {
    comic: (id) => `comic.html?id=${encodeURIComponent(id)}`,
    novel: (id) => `novel-detail.html?id=${encodeURIComponent(id)}`,
    anime: (id) => `anime-watch.html?id=${encodeURIComponent(id)}`,
  };

  function mapCatalog(list, kind) {
    return (list || []).map((item, index) => ({
      uid: `${kind}-${item.id}`,
      id: item.id,
      kind,
      title: item.title,
      ep: item.ep || (kind === 'anime' ? `第${item.eps || 1}集` : (shared.t ? shared.t('firstEp', '第一集') : '第一集')),
      isNew: !!item.isNew,
      hot: !!item.hot,
      poster: item.poster || coverOf(item, list),
      href: TYPE_HREF[kind](item.id),
      readOrder: index + 1,
    }));
  }

  const CATALOGS = {
    comic: shared.COMICS || [],
    novel: shared.NOVELS || [],
    anime: shared.ANIMATIONS || [],
  };

  const BASE_BOOKS = [
    ...mapCatalog(CATALOGS.comic, 'comic'),
    ...mapCatalog(CATALOGS.novel, 'novel'),
    ...mapCatalog(CATALOGS.anime, 'anime'),
  ];

  function epKindOf(kind) {
    return kind === 'novel' ? 'novel' : 'comic';
  }

  function mapHistory() {
    const rows = shared.loadHistory ? shared.loadHistory() : [];
    return rows.map((row) => {
      const list = CATALOGS[row.kind] || [];
      const item = list.find((entry) => entry.id === row.id);
      if (!item) return null;
      const epNum = Math.max(1, parseInt(row.ep, 10) || 1);
      return {
        uid: `${row.kind}-${item.id}`,
        id: item.id,
        kind: row.kind,
        title: item.title,
        ep: shared.epLabel ? shared.epLabel(epNum, epKindOf(row.kind)) : (row.kind === 'novel' ? `第${epNum}章` : `第${epNum}集`),
        epNum,
        isNew: !!item.isNew,
        hot: !!item.hot,
        poster: item.poster || coverOf(item, list),
        href: shared.historyHref ? shared.historyHref(row.kind, item.id, epNum) : TYPE_HREF[row.kind](item.id),
        at: row.at || 0,
      };
    }).filter(Boolean);
  }

  function filterByTab(list, tab) {
    if (tab === 'recent') return mapHistory();
    if (tab === 'favorites') {
      return list.filter((item) => shared.isBookmarked && shared.isBookmarked(item.kind, item.id));
    }
    if (tab === 'likes') {
      return list.filter((item) => shared.isLiked && shared.isLiked(item.kind, item.id));
    }
    return [];
  }

  function filterByType(list, kind) {
    if (!kind || kind === 'all') return list;
    return list.filter((item) => item.kind === kind);
  }

  function filterByQuery(list, query) {
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((item) => {
      const title = shared.localizedTitle ? shared.localizedTitle(item) : item.title;
      return String(item.title).toLowerCase().includes(q) || String(title).toLowerCase().includes(q);
    });
  }

  function filterRemoved(list, removedIds) {
    return list.filter((item) => !removedIds.has(item.uid));
  }

  function getDisplayData(state) {
    const source = state.tab === 'recent' ? mapHistory() : filterByTab(BASE_BOOKS, state.tab);
    const filtered = filterByQuery(
      filterByType(source, state.filter),
      state.query
    );
    const active = filterRemoved(filtered, state.removedIds);
    return state.tab === 'recent' ? active : prioritizeNew(active);
  }

  function buildCardHtml(item, index, tab, state) {
    const title = shared.localizedTitle ? shared.localizedTitle(item) : item.title;
    const ep = item.epNum && shared.epLabel
      ? shared.epLabel(item.epNum, epKindOf(item.kind))
      : (shared.localizedEp ? shared.localizedEp(item.ep, epKindOf(item.kind)) : item.ep);
    const newBadge = item.isNew ? '<span class="bookshelf-new-badge">NEW</span>' : '';
    const hotIcon = item.hot && shared.badgeUpHtml ? shared.badgeUpHtml() : '';
    const selectedClass = state.selected.has(item.uid) ? ' is-selected' : '';
    const selectCircle = '<span class="bookshelf-select-circle" aria-hidden="true"></span>';

    const body = `
      <div class="bookshelf-thumb">
        ${selectCircle}
        <img src="${item.poster}" alt="${title}" loading="lazy">
        ${newBadge}
      </div>
      <div class="bookshelf-title-row">
        <h3 class="bookshelf-title">${title}</h3>
        ${hotIcon}
      </div>
      <p class="bookshelf-meta">${ep}</p>
    `;

    if (state.editMode) {
      return `
        <button type="button" class="bookshelf-card is-edit-target${selectedClass}" data-id="${item.uid}">
          ${body}
        </button>
      `;
    }

    return `
      <a href="${item.href}" class="bookshelf-card">
        ${body}
      </a>
    `;
  }

  function renderBookshelfGrid(container, state) {
    const data = getDisplayData(state);

    if (!data.length) {
      const goHref = state.filter === 'novel' ? 'novel.html' : state.filter === 'anime' ? 'anime.html' : state.filter === 'comic' ? 'manga.html' : './';
      const lead = (shared.t && shared.t('emptyShelfLead', '暂无阅览，')) || '暂无阅览，';
      const go = (shared.t && shared.t('emptyShelfGo', '现在就去观看')) || '现在就去观看';
      container.innerHTML = `
        <div class="bookshelf-empty">
          <img class="bookshelf-empty-art" src="assets/empty_shelf.png" alt="" width="720" height="405">
          <p class="bookshelf-empty-text">
            <span>${lead}</span><a class="bookshelf-empty-go" href="${goHref}">${go}</a>
          </p>
        </div>
      `;
      return;
    }

    container.innerHTML = data.map((item, index) => (
      buildCardHtml(item, index, state.tab, state)
    )).join('');

    if (state.editMode) {
      container.querySelectorAll('.bookshelf-card.is-edit-target').forEach((card) => {
        card.addEventListener('click', () => {
          const id = card.dataset.id;
          if (!id) return;

          if (state.selected.has(id)) {
            state.selected.delete(id);
          } else {
            state.selected.add(id);
          }

          updateSelectCount(state);
          card.classList.toggle('is-selected', state.selected.has(id));
        });
      });
    }
  }

  function updateSelectCount(state) {
    const countEl = document.getElementById('bookshelfSelectCount');
    if (!countEl) return;
    countEl.textContent = ((shared.t && shared.t('selectedSeries', '您选择了“{n}”系列')) || '您选择了“{n}”系列').replace('{n}', String(state.selected.size));
  }

  function setEditMode(state, enabled, page, toolbarEdit, render, deleteModal) {
    state.editMode = enabled;

    if (!enabled) {
      state.selected.clear();
      if (deleteModal) deleteModal.close();
    }

    const countEl = document.getElementById('bookshelfSelectCount');

    page.classList.toggle('is-edit-mode', enabled);
    toolbarEdit.hidden = !enabled;
    if (countEl) countEl.hidden = !enabled;
    updateSelectCount(state);
    render();
  }

  function deleteSelectedBooks(state, render) {
    state.selected.forEach((id) => {
      const item = BASE_BOOKS.find((row) => row.uid === id);
      if (item && state.tab === 'recent' && shared.removeHistory) {
        shared.removeHistory(item.kind, item.id);
      }
      if (item && state.tab === 'favorites' && shared.isBookmarked && shared.toggleBookmark) {
        if (shared.isBookmarked(item.kind, item.id)) shared.toggleBookmark(item.kind, item.id);
      }
      if (item && state.tab === 'likes' && shared.isLiked && shared.toggleLike) {
        if (shared.isLiked(item.kind, item.id)) shared.toggleLike(item.kind, item.id);
      }
      state.removedIds.add(id);
    });
    state.selected.clear();
    updateSelectCount(state);
    render();
  }

  function initBookshelfDeleteModal(state, render) {
    const modal = document.getElementById('bookshelfDeleteModal');
    const cancelBtn = document.getElementById('bookshelfDeleteCancel');
    const confirmBtn = document.getElementById('bookshelfDeleteConfirm');
    if (!modal || !cancelBtn || !confirmBtn) return null;

    function close() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    }

    function open() {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
    }

    cancelBtn.addEventListener('click', close);
    confirmBtn.addEventListener('click', () => {
      deleteSelectedBooks(state, render);
      close();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });

    return { open, close };
  }

  function initBookshelfTabs(state, render) {
    const tabs = document.querySelectorAll('.bookshelf-tab');
    if (!tabs.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        if (state.editMode) return;

        state.tab = tab.dataset.tab || 'recent';

        tabs.forEach((t) => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');

        render();
      });
    });
  }

  function initBookshelfSort(state, render) {
    bindSortMenu({
      wrap: document.getElementById('bookshelfSort'),
      btn: document.getElementById('bookshelfSortBtn'),
      label: document.getElementById('bookshelfSortLabel'),
      options: document.querySelectorAll('.bookshelf-sort-option'),
      labels: TYPE_LABELS,
      fallbackKey: 'all',
      onChange(key) {
        state.filter = key;
        render();
      },
    });
  }

  function initBookshelfSearch(state, render) {
    const input = document.getElementById('bookshelfSearchInput');
    const searchBtn = document.querySelector('.bookshelf-search-btn');
    if (!input) return;

    searchBtn?.addEventListener('click', () => input.focus());

    input.addEventListener('input', () => {
      if (state.editMode) return;
      state.query = input.value;
      render();
    });
  }

  function initBookshelfEditMode(state, page, render, deleteModal) {
    const editBtn = document.getElementById('bookshelfEditBtn');
    const closeBtn = document.getElementById('bookshelfEditClose');
    const confirmBtn = document.getElementById('bookshelfEditDelete');
    const toolbarEdit = document.getElementById('bookshelfToolbarEdit');
    if (!editBtn || !closeBtn || !confirmBtn || !toolbarEdit) return;

    editBtn.addEventListener('click', () => {
      setEditMode(state, true, page, toolbarEdit, render, deleteModal);
    });

    closeBtn.addEventListener('click', () => {
      setEditMode(state, false, page, toolbarEdit, render, deleteModal);
    });

    confirmBtn.addEventListener('click', () => {
      if (!state.selected.size || !deleteModal) return;
      deleteModal.open();
    });
  }

  function initBookshelfPage() {
    const grid = document.getElementById('bookshelfGrid');
    const page = document.querySelector('.bookshelf-page');
    if (!grid || !page) return;

    const rawHash = (window.location.hash || '').replace('#', '');
    const hashTab = rawHash === 'vip' ? 'likes' : rawHash;
    const allowedTabs = ['recent', 'favorites', 'likes'];

    const state = {
      tab: allowedTabs.includes(hashTab) ? hashTab : 'recent',
      filter: 'all',
      query: '',
      editMode: false,
      selected: new Set(),
      removedIds: new Set(),
    };

    function render() {
      renderBookshelfGrid(grid, state);
    }

    if (state.tab !== 'recent') {
      document.querySelectorAll('.bookshelf-tab').forEach((tab) => {
        const active = tab.dataset.tab === state.tab;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
      });
    }

    initBookshelfTabs(state, render);
    initBookshelfSort(state, render);
    initBookshelfSearch(state, render);
    const deleteModal = initBookshelfDeleteModal(state, render);
    initBookshelfEditMode(state, page, render, deleteModal);
    render();
    window.addEventListener('comicsn:langchange', render);
  }

  initBookshelfPage();
})();
