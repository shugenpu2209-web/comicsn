(function () {
  'use strict';

  const shared = window.ComicsShared || {};
  if (!shared.bindCatalogPage) return;

  const kind = (document.currentScript && document.currentScript.dataset.catalog)
    || (location.pathname.includes('novel') ? 'novel' : 'manga');
  const isNovel = kind === 'novel';

  shared.bindCatalogPage({
    items: isNovel ? (shared.NOVELS || []) : (shared.COMICS || []),
    recommendId: isNovel ? 'novelRecommend' : 'mangaRecommend',
    gridId: isNovel ? 'novelGrid' : 'mangaGrid',
    sortWrapId: isNovel ? 'novelSort' : 'mangaSort',
    sortBtnId: isNovel ? 'novelSortBtn' : 'mangaSortBtn',
    sortLabelId: isNovel ? 'novelSortLabel' : 'mangaSortLabel',
    hrefOf(item) {
      if (isNovel) {
        return item.id ? `novel-detail.html?id=${encodeURIComponent(item.id)}` : 'novel-detail.html';
      }
      return item.id ? `comic.html?id=${encodeURIComponent(item.id)}` : 'comic.html';
    },
    emptyRecommend: '暂无推荐',
    emptyGrid: isNovel ? '暂无小说' : '暂无漫画',
  });
})();
