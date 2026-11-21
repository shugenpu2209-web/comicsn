'use strict';

const db = require('./db');

function formatStat(value) {
  const num = Number(value) || 0;
  if (num >= 1000) {
    const k = num / 1000;
    const text = k >= 100
      ? String(Math.round(k))
      : (Math.round(k * 10) / 10).toFixed(1).replace(/\.0$/, '');
    return `${text}K`;
  }
  return String(Math.round(num));
}

function publicPath(src) {
  if (!src) return '';
  const text = String(src);
  if (text.startsWith('/api/') || /^https?:/i.test(text) || text.startsWith('data:') || text.startsWith('blob:') || text.startsWith('idb:')) {
    return text;
  }
  return text.replace(/^(\.\.\/)+/, '');
}

function isPublic(work) {
  const status = work.publishStatus || 'published';
  return status === 'published' || status === 'on';
}

function sameList(a, b) {
  return JSON.stringify(a || []) === JSON.stringify(b || []);
}

function toPublicItem(work, kind) {
  const unit = kind === 'novel' ? '章' : '集';
  const cover = publicPath(work.cover) || 'assets/comics/thumb-1.webp';
  return {
    id: work.id,
    title: work.title || '',
    titleEn: work.titleEn || '',
    titlePt: work.titlePt || '',
    author: work.authorId || '',
    categories: work.categories || [],
    tags: work.tags || [],
    ep: `第${work.chapterCount || 0}${unit}`,
    eps: work.chapterCount || 0,
    views: formatStat(work.views),
    likes: formatStat(work.likes),
    status: work.progress || 'updating',
    free: work.vip === 'free',
    exclusive: !!work.exclusive,
    featured: !!work.recommend,
    hot: !!work.recommend,
    isNew: true,
    origin: work.origin || '',
    blurb: work.blurb || '',
    cover,
    poster: cover,
    duration: work.duration || '',
    published: work.createdAt || '',
  };
}

function diffPublic(work, seed, kind) {
  const patch = {};
  if ((work.title || '') !== (seed.title || '')) patch.title = work.title || '';
  if ((work.titleEn || '') !== (seed.titleEn || '')) patch.titleEn = work.titleEn || '';
  if ((work.titlePt || '') !== (seed.titlePt || '')) patch.titlePt = work.titlePt || '';
  if ((work.authorId || '') !== (seed.authorId || '')) patch.author = work.authorId || '';
  if (!sameList(work.categories, seed.categories)) patch.categories = work.categories || [];
  if (!sameList(work.tags, seed.tags)) patch.tags = work.tags || [];
  if ((work.progress || '') !== (seed.progress || '')) patch.status = work.progress || 'updating';
  if ((work.vip || '') !== (seed.vip || '')) patch.free = work.vip === 'free';
  if (!!work.exclusive !== !!seed.exclusive) patch.exclusive = !!work.exclusive;
  if (!!work.recommend !== !!seed.recommend) {
    patch.featured = !!work.recommend;
    patch.hot = !!work.recommend;
  }
  if (Number(work.views) !== Number(seed.views)) patch.views = formatStat(work.views);
  if (Number(work.likes) !== Number(seed.likes)) patch.likes = formatStat(work.likes);
  if (Number(work.chapterCount) !== Number(seed.chapterCount)) {
    const unit = kind === 'novel' ? '章' : '集';
    patch.ep = `第${work.chapterCount || 0}${unit}`;
    patch.eps = work.chapterCount || 0;
  }
  if ((work.duration || '') !== (seed.duration || '')) patch.duration = work.duration || '';
  if ((work.cover || '') !== (seed.cover || '')) {
    const cover = publicPath(work.cover) || 'assets/comics/thumb-1.webp';
    patch.cover = cover;
    patch.poster = cover;
  }
  if ((work.blurb || '') !== (seed.blurb || '')) patch.blurb = work.blurb || '';
  if ((work.origin || '') !== (seed.origin || '')) patch.origin = work.origin || '';
  return patch;
}

function rowsFor(kind) {
  const seeds = db.loadSeedMap(kind);
  const seen = new Set();
  const rows = [];
  db.loadWorks(kind).forEach((work) => {
    seen.add(work.id);
    if (!isPublic(work)) {
      rows.push({ id: work.id, hidden: true });
      return;
    }
    const seed = seeds.get(work.id);
    if (!seed) {
      rows.push({ id: work.id, hidden: false, item: toPublicItem(work, kind) });
      return;
    }
    const patch = diffPublic(work, seed, kind);
    const row = { id: work.id, hidden: false };
    if (Object.keys(patch).length) row.patch = patch;
    rows.push(row);
  });
  seeds.forEach((seed, id) => {
    if (!seen.has(id)) rows.push({ id, hidden: true });
  });
  return rows;
}

function publicEpisodes() {
  return db.loadUnits('episode').map((unit) => ({
    id: unit.id,
    comicId: unit.comicId,
    no: unit.no,
    title: unit.title || '',
    free: !!unit.free,
    status: unit.status || '',
    videoKey: publicPath(unit.videoKey || ''),
    videoUrl: unit.videoUrl || '',
    duration: unit.duration || '',
  }));
}

function publicAnimeWorks() {
  return db.loadWorks('anime').map((work) => ({
    id: work.id,
    trailerKey: publicPath(work.trailerKey || ''),
    trailerUrl: work.trailerUrl || '',
    publishStatus: work.publishStatus || 'published',
  }));
}

function publicCatalog() {
  return {
    comics: rowsFor('comic'),
    novels: rowsFor('novel'),
    anime: rowsFor('anime'),
    episodes: publicEpisodes(),
    animeWorks: publicAnimeWorks(),
  };
}

module.exports = {
  publicCatalog,
  formatStat,
  publicPath,
};
