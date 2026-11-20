(function () {
  'use strict';

  const S = window.AdminStore;
  const root = document.getElementById('app');
  let pageIndex = 1;
  let pageSize = 10;
  let query = {};

  const MENU = [
    { type: 'link', page: 'dashboard', name: '运营总览', icon: 'home' },
    { type: 'group', key: 'manga', label: '漫画', icon: 'book', items: [
      { id: 'comics', name: '作品' }, { id: 'chapters', name: '章节' },
      { id: 'comic-authors', name: '作者' }, { id: 'comic-categories', name: '分类' }, { id: 'comic-tags', name: '标签' }, { id: 'comic-review', name: '审核' },
    ] },
    { type: 'group', key: 'novel', label: '小说', icon: 'doc', items: [
      { id: 'novels', name: '作品' }, { id: 'novel-chapters', name: '章节' },
      { id: 'novel-authors', name: '作者' }, { id: 'novel-categories', name: '分类' }, { id: 'novel-tags', name: '标签' }, { id: 'novel-review', name: '审核' },
    ] },
    { type: 'group', key: 'anime', label: '动画', icon: 'play', items: [
      { id: 'anime', name: '作品' }, { id: 'episodes', name: '剧集' },
      { id: 'anime-authors', name: '作者' }, { id: 'anime-categories', name: '分类' }, { id: 'anime-tags', name: '标签' }, { id: 'anime-review', name: '审核' },
    ] },
    { type: 'group', key: 'ops', label: '首页运营', icon: 'star', items: [
      { id: 'banners', name: '首页 Banner' }, { id: 'recommends', name: '首页推荐位' }, { id: 'ranking', name: '频道排行' },
      { id: 'exclusive', name: '独播作品' }, { id: 'freezone', name: '免费专区' },
      { id: 'search-ops', name: '搜索热词' }, { id: 'campaigns', name: '活动专区' },
    ] },
    { type: 'group', key: 'users', label: '用户管理', icon: 'users', items: [
      { id: 'users', name: '用户列表' }, { id: 'vip-users', name: 'VIP用户' }, { id: 'behavior', name: '用户行为' },
      { id: 'logins', name: '登录记录' }, { id: 'blacklist', name: '黑名单' }, { id: 'feedback', name: '反馈' },
    ] },
    { type: 'group', key: 'vip', label: 'VIP / 商品', icon: 'crown', items: [
      { id: 'plans', name: 'VIP套餐' }, { id: 'products', name: '商品' }, { id: 'perks', name: '权益' },
      { id: 'coupons', name: '优惠券' }, { id: 'campaigns2', name: '营销活动' },
    ] },
    { type: 'group', key: 'finance', label: '订单财务', icon: 'card', items: [
      { id: 'orders', name: '订单' }, { id: 'payments', name: '支付' }, { id: 'refunds', name: '退款' }, { id: 'finance', name: '财务报表' },
    ] },
    { type: 'group', key: 'community', label: '社区管理', icon: 'chat', items: [
      { id: 'comments', name: '评论' }, { id: 'reports', name: '举报' }, { id: 'words', name: '敏感词' },
    ] },
    { type: 'group', key: 'agent', label: '推广运营', icon: 'promo', items: [
      { id: 'agents', name: '代理管理' }, { id: 'channels', name: '渠道' }, { id: 'commission', name: '佣金规则' }, { id: 'withdrawals', name: '提现结算' },
    ] },
    { type: 'group', key: 'stats', label: '数据中心', icon: 'chart', items: [
      { id: 'stats-users', name: '用户数据' }, { id: 'stats-content', name: '内容数据' }, { id: 'stats-revenue', name: '收入数据' },
      { id: 'stats-vip', name: 'VIP数据' }, { id: 'stats-channel', name: '渠道数据' },
    ] },
    { type: 'group', key: 'msg', label: '消息中心', icon: 'bell', items: [
      { id: 'notices', name: '首页公告条' }, { id: 'news', name: '最新消息' }, { id: 'faq', name: '常见问题' },
      { id: 'messages', name: '站内信' }, { id: 'templates', name: '模板' },
    ] },
    { type: 'group', key: 'sys', label: '系统设置', icon: 'cog', items: [
      { id: 'admins', name: '管理员' }, { id: 'roles', name: '角色权限' }, { id: 'settings', name: '参数' }, { id: 'logs', name: '操作日志' },
    ] },
    { type: 'link', page: 'monitor', name: '系统监控', icon: 'pulse' },
  ];

  const TITLE = {};
  MENU.forEach((g) => {
    if (g.type === 'link') TITLE[g.page] = g.name;
    else (g.items || []).forEach((it) => { TITLE[it.id] = it.name; });
  });
  const KINDS = {
    comic: {
      key: 'comic', list: 'comics', units: 'chapters', page: 'comics', unitPage: 'chapters',
      title: '漫画作品', add: '新增漫画', unitTitle: '漫画章节', unitAdd: '新增章节 / 批量传图',
      unitName: '章节', unit: '话', preview: (id) => `../comic.html?id=${encodeURIComponent(id)}`,
      hasOrigin: true, hasDuration: false, body: false, files: true, module: '漫画',
      catalog: '../manga.html',
    },
    novel: {
      key: 'novel', list: 'novels', units: 'novelChapters', page: 'novels', unitPage: 'novel-chapters',
      title: '小说作品', add: '新增小说', unitTitle: '小说章节', unitAdd: '新增章节',
      unitName: '章节', unit: '章', preview: (id) => `../novel-detail.html?id=${encodeURIComponent(id)}`,
      hasOrigin: false, hasDuration: false, body: true, files: false, module: '小说',
      catalog: '../novel.html',
    },
    anime: {
      key: 'anime', list: 'anime', units: 'episodes', page: 'anime', unitPage: 'episodes',
      title: '动画作品', add: '新增动画', unitTitle: '动画剧集', unitAdd: '新增剧集 / 上传视频',
      unitName: '剧集', unit: '集', preview: (id) => `../anime-watch.html?id=${encodeURIComponent(id)}`,
      hasOrigin: false, hasDuration: true, body: false, files: false, video: true, module: '动画',
      catalog: '../anime.html',
    },
  };
  const VIDEO_ACCEPT = 'video/mp4,video/webm,video/ogg,video/quicktime,.mp4,.webm,.mov,.m4v';
  const SIDE_KEY = 'comicsn-admin-side';
  const SLOT_LABELS = {
    'rank-manga': '首页 · 漫画排行',
    'rank-novel': '首页 · 小说排行',
    'rank-anime': '首页 · 动画排行',
    more: '首页 · 其他推荐',
    exclusive: '独播推荐',
    week: '本周热门',
    home: '首页推荐',
  };
  const BANNER_SLOTS = [
    { v: 'home', l: '首页轮播' },
    { v: 'menu', l: '侧栏充值广告' },
    { v: 'ad', l: '活动落地页' },
  ];
  const JUMP_TYPES = [
    { v: 'comic', l: '漫画详情' },
    { v: 'novel', l: '小说详情' },
    { v: 'anime', l: '动画播放' },
    { v: 'url', l: '站内链接' },
    { v: 'ad', l: '活动页' },
  ];
  const RANK_TABS = [
    { id: 'comic', name: '漫画', preview: '../ranking.html?type=manga' },
    { id: 'novel', name: '小说', preview: '../ranking.html?type=novel' },
    { id: 'anime', name: '动画', preview: '../ranking.html?type=anime' },
  ];

  function hasVideoFile(row) {
    return !!(row && (row.videoKey || (/^https?:\/\//i.test(row.videoUrl || ''))));
  }

  function videoChip(row, fallback) {
    if (!row) return '';
    const has = row.videoKey || row.trailerKey
      || /^https?:\/\//i.test(row.videoUrl || '')
      || /^https?:\/\//i.test(row.trailerUrl || '');
    if (!has) return '';
    const name = row.videoName || row.trailerName || fallback || '已上传视频';
    return `<div class="file-preview video-preview"><span class="video-chip">${esc(name)}</span></div>`;
  }
  const CHEVRON = '<svg class="chevron" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 4.5L6 7.5 9 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const ICONS = {
    home: '<path d="M4 10.5L12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    book: '<path d="M5 6.2A2.2 2.2 0 0 1 7.2 4H19v15.5H7.4A2.4 2.4 0 0 0 5 21.9V6.2z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M9 8h6M9 12h6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    doc: '<path d="M7 4h7l4 4v12H7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M14 4v4h4M9 12h6M9 16h6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    play: '<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M10 9l6 3-6 3z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    tag: '<path d="M4 12.5V5h7.5L20 13.5 12.5 21z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="8" cy="9" r="1.1" fill="currentColor"/>',
    star: '<path d="M12 4.5l2.1 4.4 4.9.6-3.6 3.4.9 4.8L12 15.8 7.7 17.7l.9-4.8-3.6-3.4 4.9-.6z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    users: '<path d="M16.5 7.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM8 9a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 19c.4-2.4 2.4-4 5-4 .8 0 1.5.1 2.2.4M12 15c2.8 0 5.1 1.6 5.6 4.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    crown: '<path d="M4 16.5h16l-1.2-8.2-3.8 3.2L12 6.5 9 11.5 5.2 8.3zM6 19h12" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    card: '<rect x="3.5" y="6" width="17" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 10h17M7 15h4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    chat: '<path d="M5 17.5 4 21l3.8-1.4A8.5 8.5 0 1 0 5 17.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    promo: '<path d="M4 10v4h3l5 4V6L7 10H4zM16 9.2a3.5 3.5 0 0 1 0 5.6M18.4 7.2a6.5 6.5 0 0 1 0 9.6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
    chart: '<path d="M5 19V9M12 19V5M19 19v-7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    bell: '<path d="M12 4a5 5 0 0 1 5 5c0 5 2 6.2 2 6.2H5S7 14 7 9a5 5 0 0 1 5-5zM10 19a2 2 0 0 0 4 0" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
    cog: '<path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M12 4.5v1.8M12 17.7v1.8M4.5 12h1.8M17.7 12h1.8M6.4 6.4l1.3 1.3M16.3 16.3l1.3 1.3M17.6 6.4l-1.3 1.3M7.7 16.3l-1.3 1.3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    pulse: '<path d="M3 12h4l2-5 4 10 2-5h6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>',
  };
  function ico(name) {
    return `<svg class="nav-ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.home}</svg>`;
  }

  function pagePerm(page) {
    if (page === 'campaigns2') return 'campaigns';
    if (page === 'search-ops') return 'banners';
    if (page === 'exclusive') return 'ranking';
    if (page === 'news' || page === 'faq') return 'notices';
    const hit = String(page || '').match(/^(comic|novel|anime)-(authors|categories|tags|review)$/);
    if (hit) return hit[2];
    return page;
  }

  function itemPerm(it) {
    return pagePerm(it.id);
  }

  function visibleItems(group) {
    return (group.items || []).filter((it) => S.can(itemPerm(it)));
  }

  function sideState() {
    try { return JSON.parse(sessionStorage.getItem(SIDE_KEY) || '{}'); }
    catch (err) { return {}; }
  }

  function setGroupOpen(key, open) {
    const st = sideState();
    st[key] = open;
    sessionStorage.setItem(SIDE_KEY, JSON.stringify(st));
  }

  function isGroupOpen(key, containsPage) {
    if (containsPage) return true;
    return sideState()[key] === true;
  }

  function crumbOf(page) {
    for (let i = 0; i < MENU.length; i += 1) {
      const g = MENU[i];
      if (g.type === 'link' && g.page === page) return g.name;
      const hit = (g.items || []).find((it) => it.id === page);
      if (hit) return hit.name;
    }
    return TITLE[page] || '运营总览';
  }

  function crumbPath(page) {
    for (let i = 0; i < MENU.length; i += 1) {
      const g = MENU[i];
      if (g.type === 'link' && g.page === page) return `COMICSN / ${g.name}`;
      const hit = (g.items || []).find((it) => it.id === page);
      if (hit) return `COMICSN / ${g.label}`;
    }
    return 'COMICSN / 运营总览';
  }

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  }

  function toast(text) {
    let el = document.querySelector('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = text;
    el.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => { el.hidden = true; }, 2800);
  }

  function hashPage() {
    const h = (location.hash || '#/dashboard').replace(/^#\/?/, '');
    const page = h.split('?')[0] || 'dashboard';
    const aliases = { authors: 'comic-authors', categories: 'comic-categories', tags: 'comic-tags', review: 'comic-review' };
    return aliases[page] || page;
  }

  function actor() {
    return S.session() || { name: '系统', role: '' };
  }

  function log(module, action, detail) {
    const a = actor();
    S.commit(() => {}, { actor: a.name, role: a.role, module, action, detail });
  }

  function confirmBox(text) {
    return new Promise((resolve) => {
      const mask = document.createElement('div');
      mask.className = 'modal-mask';
      mask.innerHTML = `<div class="modal" style="width:420px"><h3>二次确认</h3><p style="color:var(--muted);line-height:1.6">${esc(text)}</p><div class="modal-actions"><button class="btn" data-no>取消</button><button class="btn btn-primary" data-ok>确认</button></div></div>`;
      document.body.appendChild(mask);
      mask.addEventListener('click', (e) => {
        if (e.target.closest('[data-ok]')) { mask.remove(); resolve(true); }
        else if (e.target.closest('[data-no]') || e.target === mask) { mask.remove(); resolve(false); }
      });
    });
  }

  function closeModal() {
    document.querySelectorAll('.modal-mask').forEach((m) => m.remove());
  }

  function mediaImg(src, cls) {
    const s = String(src || '');
    if (!s) return `<img class="${cls}" alt="">`;
    if (s.indexOf('idb:') === 0) return `<img class="${cls}" alt="" data-asset="${esc(s)}">`;
    return `<img class="${cls}" src="${esc(s)}" alt="">`;
  }

  function hydrateAssets(scope) {
    const rootEl = scope || document;
    rootEl.querySelectorAll('[data-asset]').forEach((el) => {
      const ref = el.getAttribute('data-asset');
      if (!ref || !S.assetUrl) return;
      S.assetUrl(ref).then((url) => { if (url) el.src = url; }).catch(() => {});
    });
  }

  function fileListOf(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter((f) => f instanceof Blob);
    if (value instanceof FileList) return [...value];
    if (value instanceof Blob) return [value];
    return [];
  }

  function saveImages(files, opts) {
    const list = fileListOf(files).slice().sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'en', { numeric: true }));
    return list.reduce((p, file, i) => p.then((acc) => S.saveImage(file, opts).then((key) => {
      acc.push({ key, sort: i + 1, object_key: file.name || ('p_' + (i + 1)) });
      return acc;
    })), Promise.resolve([]));
  }

  function openForm({ title, fields, value, onSubmit }) {
    const val = Object.assign({}, value || {});
    const mask = document.createElement('div');
    mask.className = 'modal-mask';
    mask.innerHTML = `<div class="modal"><h3>${esc(title)}</h3><div class="form-grid" id="formGrid"></div><div class="modal-actions"><button class="btn" data-no>取消</button><button class="btn btn-primary" data-ok>保存</button></div></div>`;
    document.body.appendChild(mask);
    const grid = mask.querySelector('#formGrid');
    fields.forEach((f) => {
      const wrap = document.createElement('div');
      wrap.className = f.span === 2 ? 'field span-2' : 'field';
      const cur = val[f.key] == null ? (f.value || '') : val[f.key];
      let control = '';
      if (f.type === 'select') {
        control = `<select name="${f.key}">${(f.options || []).map((o) => `<option value="${esc(o.v)}" ${String(cur) === String(o.v) ? 'selected' : ''}>${esc(o.l)}</option>`).join('')}</select>`;
      } else if (f.type === 'textarea') {
        control = `<textarea name="${f.key}" rows="${f.rows || 4}">${esc(cur)}</textarea>`;
      } else if (f.type === 'file') {
        const accept = f.accept || 'image/jpeg,image/png,image/webp,image/gif';
        const multiple = f.multiple ? ' multiple' : '';
        const hint = f.hint || (f.multiple ? '可一次选择多张，按文件名排序' : '支持 jpg / png / webp');
        const preview = f.preview || '';
        control = `${preview}<label class="drop"><input type="file" name="${f.key}" accept="${esc(accept)}"${multiple}><span>点击选择或拖入文件</span></label><p class="file-hint">${esc(hint)}</p>`;
      } else {
        control = `<input type="${f.type || 'text'}" name="${f.key}" value="${esc(cur)}"${f.readonly ? ' readonly' : ''}>`;
      }
      wrap.innerHTML = `<label>${esc(f.label)}</label>${control}`;
      grid.appendChild(wrap);
    });
    hydrateAssets(mask);
    const okBtn = mask.querySelector('[data-ok]');
    mask.addEventListener('click', async (e) => {
      if (e.target.closest('[data-no]') || e.target === mask) { mask.remove(); return; }
      if (!e.target.closest('[data-ok]')) return;
      if (okBtn.disabled) return;
      const data = Object.assign({}, val);
      fields.forEach((f) => {
        const el = mask.querySelector(`[name="${f.key}"]`);
        if (!el) return;
        if (f.type === 'file') {
          const list = [...(el.files || [])];
          data[f.key] = f.multiple ? list : (list[0] || null);
        } else data[f.key] = el.value;
      });
      okBtn.disabled = true;
      try {
        await onSubmit(data);
        mask.remove();
      } catch (err) {
        okBtn.disabled = false;
        toast((err && err.message) || '保存失败');
      }
    });
  }

  function badge(status) {
    const map = {
      published: ['badge-on', '已发布'], draft: ['badge-warn', '草稿'], pending: ['badge-warn', '待处理'], unpaid: ['badge-warn', '待支付'],
      reviewing: ['badge-info', '审核中'], rejected: ['badge-off', '驳回'], offline: ['badge-off', '已下架'],
      on: ['badge-on', '启用'], off: ['badge-off', '停用'], active: ['badge-on', '正常'], banned: ['badge-off', '封禁'],
      success: ['badge-on', '成功'], failed: ['badge-off', '失败'], closed: ['', '关闭'],
      refunding: ['badge-warn', '退款中'], paid: ['badge-on', '已打款'], settled: ['badge-on', '已结算'],
      approved: ['badge-on', '通过'], hidden: ['badge-warn', '隐藏'], open: ['badge-warn', '待处理'], done: ['badge-on', '已处理'],
      vip: ['badge-info', 'VIP'], free: ['badge-on', '免费'], full: ['badge-info', '全VIP'], partial: ['badge-warn', '部分VIP'],
      updating: ['badge-info', '连载中'], ended: ['', '已完结'], korean: ['', '韩漫'], japanese: ['', '日漫'],
    };
    const hit = map[status] || ['', status];
    return `<span class="badge ${hit[0]}">${esc(hit[1])}</span>`;
  }

  function paginate(list) {
    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / pageSize));
    if (pageIndex > pages) pageIndex = pages;
    const start = (pageIndex - 1) * pageSize;
    return { rows: list.slice(start, start + pageSize), total, pages };
  }

  function pagerHtml(p) {
    return `<div class="pager"><span>共 ${p.total} 条</span><button class="btn" data-page="${Math.max(1, pageIndex - 1)}">上一页</button><span>${pageIndex}/${p.pages}</span><button class="btn" data-page="${Math.min(p.pages, pageIndex + 1)}">下一页</button></div>`;
  }

  function userName(id) {
    const u = S.db().users.find((x) => x.id === id);
    return u ? u.nickname : id;
  }

  function comicName(id) {
    const d = S.db();
    const hit = (d.comics || []).concat(d.novels || [], d.anime || []).find((x) => x.id === id);
    return hit ? hit.title : id;
  }

  function allWorks() {
    return ['comic', 'novel', 'anime'].reduce((acc, kind) => {
      const cfg = KINDS[kind];
      return acc.concat((S.db()[cfg.list] || []).map((w) => Object.assign({}, w, {
        kind, kindLabel: cfg.module, list: cfg.list, preview: cfg.preview(w.id),
      })));
    }, []);
  }

  function workOpts() {
    return allWorks().map((w) => ({ v: w.kind + ':' + w.id, l: w.kindLabel + ' · ' + w.title }));
  }

  function parseWorkKey(key) {
    const s = String(key || '');
    const i = s.indexOf(':');
    if (i < 0) return { kind: 'comic', id: s };
    return { kind: s.slice(0, i), id: s.slice(i + 1) };
  }

  function jumpHref(type, id) {
    const target = String(id || '').trim();
    if (type === 'comic') return '../comic.html?id=' + encodeURIComponent(target);
    if (type === 'novel') return '../novel-detail.html?id=' + encodeURIComponent(target);
    if (type === 'anime') return '../anime-watch.html?id=' + encodeURIComponent(target);
    if (!target) return '../index.html';
    if (/^https?:\/\//i.test(target)) return target;
    return '../' + target.replace(/^\.\.\//, '');
  }

  function opsHint(text, href, label) {
    const link = href ? ` <a href="${esc(href)}" target="_blank" rel="noopener">${esc(label || '打开前台')}</a>` : '';
    return `<div class="info-banner">${text}${link}</div>`;
  }

  function renderLogin() {
    let a = 4 + Math.floor(Math.random() * 6);
    let b = 2 + Math.floor(Math.random() * 7);
    function captchaText() { return `${a} + ${b}`; }
    root.innerHTML = `<div class="login-page"><form class="login-card" id="loginForm">
      <div class="brand-mark" style="margin-bottom:14px">CS</div>
      <h1>漫画平台后台管理系统</h1>
      <p>独立部署 · RBAC 权限 · 与前台站点数据打通</p>
      <div class="field"><label>账号</label><input name="username" autocomplete="username" value="admin"></div>
      <div class="field"><label>密码</label><input name="password" type="password" autocomplete="current-password" value="admin123"></div>
      <div class="field"><label>验证码</label><div class="captcha-row"><input name="captcha" placeholder="计算结果"><button type="button" class="captcha-btn" id="capBtn">${captchaText()}</button></div></div>
      <div class="login-error" id="loginErr"></div>
      <button class="btn btn-primary btn-block" type="submit">登录</button>
      <div class="login-accounts">演示账号（密码均为账号+123，超管为 admin123）<br>
      <b>admin</b> 超管 · <b>content</b> 内容 · <b>review</b> 审核 · <b>ops</b> 运营<br>
      <b>cs</b> 客服 · <b>finance</b> 财务 · <b>data</b> 数据 · <b>agent</b> 代理</div>
    </form></div>`;
    root.querySelector('#capBtn').onclick = () => {
      a = 4 + Math.floor(Math.random() * 6);
      b = 2 + Math.floor(Math.random() * 7);
      root.querySelector('#capBtn').textContent = captchaText();
    };
    root.querySelector('#loginForm').onsubmit = (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const err = root.querySelector('#loginErr');
      if (Number(fd.get('captcha')) !== a + b) { err.textContent = '验证码错误'; return; }
      const res = S.login(String(fd.get('username') || '').trim(), String(fd.get('password') || ''));
      if (!res.ok) { err.textContent = res.error; return; }
      location.hash = '#/dashboard';
      render();
    };
  }

  function layout(inner) {
    const s = S.session();
    const page = hashPage();
    const groups = MENU.map((g) => {
      if (g.type === 'link') {
        if (!S.can(g.page) && g.page !== 'dashboard') return '';
        return `<a class="side-link top ${page === g.page ? 'is-active' : ''}" href="#/${g.page}">${ico(g.icon)}${esc(g.name)}</a>`;
      }
      const visible = visibleItems(g);
      if (!visible.length) return '';
      const current = visible.some((it) => it.id === page);
      const open = isGroupOpen(g.key, current);
      return `<div class="side-group ${open ? 'is-open' : ''}">
        <button type="button" class="side-toggle ${current ? 'is-current' : ''}" data-group="${esc(g.key)}" aria-expanded="${open}">
          <span class="side-toggle-l">${ico(g.icon)}<span>${esc(g.label)}</span></span>${CHEVRON}
        </button>
        <div class="side-children">${visible.map((it) => (
          `<a class="side-link ${page === it.id ? 'is-active' : ''}" href="#/${it.id}">${esc(it.name)}</a>`
        )).join('')}</div>
      </div>`;
    }).join('');
    const initial = (s.name || '运').trim().slice(0, 1);
    return `<div class="shell">
      <aside class="sidebar">
        <div class="side-brand">
          <div class="brand-mark">CS</div>
          <div><strong>COMICSN</strong><em>运营管理台</em></div>
        </div>
        <div class="side-section">运营工作台</div>
        <nav class="side-nav" aria-label="后台菜单">${groups}</nav>
      </aside>
      <div class="main">
        <div class="topbar">
          <div class="crumb-wrap">
            <button type="button" class="menu-btn" id="menuBtn" aria-label="折叠菜单">☰</button>
            <div>
              <div class="crumb-path">${esc(crumbPath(page))}</div>
              <div class="crumb">${esc(crumbOf(page))}</div>
            </div>
          </div>
          <div class="top-user">
            <span class="avatar">${esc(initial)}</span>
            <div class="user-meta"><b>${esc(s.name)}</b><small>${esc(S.ROLES[s.role].name)}</small></div>
            <button class="btn" id="resetBtn">重置演示数据</button>
            <button class="btn" id="logoutBtn">退出</button>
          </div>
        </div>
        <div class="content">${inner}</div>
      </div>
    </div>`;
  }

  function bindChrome() {
    const logout = document.getElementById('logoutBtn');
    if (logout) logout.onclick = () => { S.logout(); location.hash = '#/login'; render(); };
    const reset = document.getElementById('resetBtn');
    if (reset) reset.onclick = async () => {
      if (!(await confirmBox('将清空本地后台演示数据并重新初始化，是否继续？'))) return;
      S.reset().then(() => {
        log('系统', '重置数据', 'seed v1');
        toast('已重置');
        render();
      });
    };
    document.querySelectorAll('[data-page]').forEach((btn) => {
      btn.onclick = () => { pageIndex = Number(btn.dataset.page) || 1; render(); };
    });
    document.querySelectorAll('[data-group]').forEach((btn) => {
      btn.onclick = () => {
        const key = btn.dataset.group;
        const group = btn.closest('.side-group');
        const open = !group.classList.contains('is-open');
        group.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
        setGroupOpen(key, open);
      };
    });
    const menuBtn = document.getElementById('menuBtn');
    if (menuBtn) menuBtn.onclick = () => document.body.classList.toggle('side-collapsed');
    const refresh = document.getElementById('refreshDash');
    if (refresh) refresh.onclick = () => { toast('已刷新'); render(); };
  }

  function deny() {
    return layout(`<div class="deny">无权限访问该菜单 / API<br><span style="font-size:13px">当前角色：${esc(S.ROLES[actor().role].name)}</span></div>`);
  }

  function renderDashboard() {
    const d = S.db();
    const todayPay = d.orders.filter((o) => o.status === 'success').reduce((s, o) => s + o.amount, 0);
    const vip = d.users.filter((u) => u.vip).length;
    const reads = d.comics.reduce((s, c) => s + c.views, 0);
    const bars = [42, 55, 48, 70, 66, 90, 81];
    const max = Math.max.apply(null, bars);
    const days = ['一', '二', '三', '四', '五', '六', '日'];
    const kpi = (tone, glyph, label, value, sub, subClass) =>
      `<div class="kpi"><div class="kpi-ico ${tone}">${glyph}</div><div class="copy"><div class="label">${label}</div><div class="value">${value}</div><div class="sub${subClass ? ` ${subClass}` : ''}">${sub}</div></div></div>`;
    const gDoc = '<svg viewBox="0 0 24 24"><path d="M8 4h6l4 4v12H8z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M14 4v4h4" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
    const gOk = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 12.2l2.3 2.3 4.7-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    const gClock = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 8v4.5l3 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    const gVip = '<svg viewBox="0 0 24 24"><path d="M5 16.5h14l-1.2-8-3.6 3-2.2-5.2L9.8 11.5 6.2 8.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>';
    const gUser = '<svg viewBox="0 0 24 24"><circle cx="12" cy="9" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6 18.5c.8-2.6 3-4 6-4s5.2 1.4 6 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    const gPulse = '<svg viewBox="0 0 24 24"><path d="M4 13h3.5l2-4 3 8 2-4H20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const gPeople = '<svg viewBox="0 0 24 24"><circle cx="9" cy="9" r="2.6" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="16" cy="10" r="2.1" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M4.8 18c.6-2.2 2.3-3.4 4.2-3.4 1.9 0 3.6 1.2 4.2 3.4M14 14.8c1.4 0 2.7.8 3.3 2.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
    const gAgent = '<svg viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 7V6a4 4 0 0 1 8 0v1" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';
    return layout(`
      <div class="page-head">
        <div>
          <p class="page-kicker">OPERATIONS OVERVIEW</p>
          <h1>站点运营总览</h1>
          <p class="page-desc">对齐前台首页、排行、搜索、消息与书架能力，聚合内容供给、发布状态与收款表现。</p>
        </div>
        <button class="btn" id="refreshDash">刷新数据</button>
      </div>
      <div class="info-banner">支付数据未接入，收入、付费人数与订单指标使用演示数据，不代表真实通道。</div>
      <div class="kpis">
        ${kpi('tone-blue', gDoc, '今日新增用户', '86', '较昨日 +12%', 'up')}
        ${kpi('tone-green', gOk, 'DAU', '12,480', '较昨日 +4%', 'up')}
        ${kpi('tone-orange', gClock, 'VIP 用户', vip, `付费用户 ${d.orders.filter((o)=>o.status==='success').length}`)}
        ${kpi('tone-purple', gVip, '充值金额', `¥${todayPay}`, `订单 ${d.orders.length}`)}
      </div>
      <div class="kpis">
        ${kpi('tone-blue', gUser, '阅读量', `${(reads/1000).toFixed(1)}K`, `漫画 ${d.comics.length} · 小说 ${(d.novels||[]).length} · 动画 ${(d.anime||[]).length}`)}
        ${kpi('tone-green', gPulse, '待审核', d.reviews.filter((r)=>r.status==='pending').length, `需处理评论 ${d.comments.filter((c)=>c.status==='pending').length}`, 'down')}
        ${kpi('tone-purple', gPeople, '待退款', d.refunds.filter((r)=>r.status==='pending').length, `待提现 ${d.withdrawals.filter((w)=>w.status==='pending').length}`, 'down')}
        ${kpi('tone-orange', gAgent, '代理业绩', `¥${d.agents.reduce((s,a)=>s+a.sales,0)}`, `佣金 ¥${d.agents.reduce((s,a)=>s+a.commission,0)}`)}
      </div>
      <div class="grid-2">
        <div class="panel"><div class="panel-h"><h3>近7日收入趋势</h3></div>
          <div class="bars">${bars.map((n,i)=>`<div class="bar" style="height:${Math.round(n/max*120)}px"><span>周${days[i]}</span></div>`).join('')}</div>
        </div>
        <div class="panel"><div class="panel-h"><h3>实时动态</h3>
          <div class="toolbar">
            <a class="btn btn-primary" href="#/comics">新增漫画</a>
            <a class="btn" href="#/banners">首页 Banner</a>
            <a class="btn" href="#/ranking">频道排行</a>
            <a class="btn" href="#/news">最新消息</a>
            <a class="btn" href="#/search-ops">搜索热词</a>
            <a class="btn" href="#/orders">查看订单</a>
          </div>
        </div>
        <ul class="feed">
          ${d.loginLogs.slice(0,4).map((x)=>`<li><span>登录 ${esc(x.username)}</span><span class="t">${esc(x.createdAt)}</span></li>`).join('')}
          ${d.orders.slice(0,3).map((x)=>`<li><span>订单 ${esc(x.id)} ¥${x.amount} ${badge(x.status)}</span><span class="t">${esc(x.createdAt)}</span></li>`).join('')}
          ${d.alerts.map((x)=>`<li><span>告警 ${esc(x.message)}</span><span class="t">${esc(x.createdAt)}</span></li>`).join('')}
        </ul>
        </div>
      </div>
    `);
  }

  function hashQuery() {
    return new URLSearchParams((location.hash.split('?')[1] || ''));
  }

  function splitKeys(text) {
    return String(text || '').split(/[,，、\s]+/).map((s) => s.trim()).filter(Boolean);
  }

  function extraCatsOfTag(name) {
    const extra = S.EXTRA_BY_CAT || {};
    return Object.keys(extra).filter((k) => (extra[k] || []).includes(name));
  }

  function numOf(v) {
    const n = Number(String(v == null ? '' : v).replace(/,/g, ''));
    return Number.isFinite(n) ? n : 0;
  }

  function fmtCount(v) {
    const n = numOf(v);
    if (n >= 1000000) {
      const t = (n / 1000000).toFixed(n % 1000000 ? 1 : 0).replace(/\.0$/, '');
      return t + 'M';
    }
    if (n >= 1000) {
      const t = (n / 1000).toFixed(n % 1000 ? 1 : 0).replace(/\.0$/, '');
      return t + 'K';
    }
    return String(n);
  }

  function statCell(v) {
    const n = numOf(v);
    return `<div class="stat-cell"><b>${esc(fmtCount(n))}</b><span>${n.toLocaleString()}</span></div>`;
  }

  function sortMark(cur, key) {
    if (cur === key + '-desc') return ' ↓';
    if (cur === key + '-asc') return ' ↑';
    return '';
  }

  function workMatchesMeta(c, author, cat, tag) {
    if (author && c.authorId !== author) return false;
    if (cat) {
      if (cat === 'korean' || cat === 'japanese') {
        if ((c.origin || 'korean') !== cat) return false;
      } else if (!((c.categories || []).includes(cat))) return false;
    }
    if (tag) {
      const tags = c.tags || [];
      const cats = c.categories || [];
      const nameMap = S.CAT_MAP || {};
      const tagIsCat = Object.keys(nameMap).find((k) => nameMap[k] === tag) || '';
      const extraCats = extraCatsOfTag(tag);
      if (!(tags.includes(tag) || cats.includes(tag)
        || (tagIsCat && cats.includes(tagIsCat))
        || extraCats.some((k) => cats.includes(k)))) return false;
    }
    return true;
  }

  function renderWorks(kind) {
    const cfg = KINDS[kind];
    const d = S.db();
    const viewLabel = kind === 'anime' ? '观看 / 播放' : '观看次数';
    const reset = query._resetWorks;
    if (reset) query = {};
    const pick = (id, fallback) => {
      if (reset) return fallback || '';
      const el = document.getElementById(id);
      if (el) return el.value;
      return query[id] || fallback || '';
    };
    const q = pick('q');
    const st = pick('st');
    const vmin = pick('vmin');
    const lmin = pick('lmin');
    const vband = pick('vband');
    const lband = pick('lband');
    const sortStat = pick('sortStat', 'views-desc');
    const author = hashQuery().get('author') || '';
    const cat = hashQuery().get('cat') || '';
    const tag = hashQuery().get('tag') || '';
    query = { q, st, vmin, lmin, vband, lband, sortStat };
    const viewsFloor = Math.max(numOf(vmin), numOf(vband));
    const likesFloor = Math.max(numOf(lmin), numOf(lband));
    let list = (d[cfg.list] || []).filter((c) => {
      if (q && !`${c.title}${c.id}${c.authorId || ''}`.includes(q)) return false;
      if (st && (c.publishStatus || c.status) !== st) return false;
      if (numOf(c.views) < viewsFloor) return false;
      if (numOf(c.likes) < likesFloor) return false;
      if (!workMatchesMeta(c, author, cat, tag)) return false;
      return true;
    });
    const [sortKey, sortDir] = String(sortStat).split('-');
    list.sort((a, b) => {
      let av = 0;
      let bv = 0;
      if (sortKey === 'likes') { av = numOf(a.likes); bv = numOf(b.likes); }
      else if (sortKey === 'title') { return sortDir === 'asc' ? String(a.title).localeCompare(String(b.title), 'zh') : String(b.title).localeCompare(String(a.title), 'zh'); }
      else { av = numOf(a.views); bv = numOf(b.views); }
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    const p = paginate(list);
    const originCol = cfg.hasOrigin ? '<th>地区</th>' : '';
    const durationCol = cfg.hasDuration ? '<th>时长</th>' : '';
    const colCount = 11 + (cfg.hasOrigin ? 1 : 0) + (cfg.hasDuration ? 1 : 0);
    const filterBits = [];
    if (author) filterBits.push('作者：' + esc(author));
    if (cat) filterBits.push('分类：' + esc(cat));
    if (tag) filterBits.push('标签：' + esc(tag));
    if (viewsFloor) filterBits.push(viewLabel + ' ≥ ' + viewsFloor.toLocaleString());
    if (likesFloor) filterBits.push('喜欢 ≥ ' + likesFloor.toLocaleString());
    const filterHint = filterBits.length
      ? `<div class="info-banner">${filterBits.join(' · ')} · 共 ${list.length} 部
          <button class="btn" id="clearWorkFilter" type="button" style="margin-left:8px;height:28px">清除筛选</button></div>`
      : '';
    const opt = (id, val, label) => `<option value="${val}" ${id === val ? 'selected' : ''}>${label}</option>`;
    return layout(`${filterHint}<div class="panel"><div class="panel-h"><h2>${esc(cfg.title)}</h2>
      <div class="toolbar">
        <input class="search" id="q" placeholder="搜索 ID / 名称 / 作者" value="${esc(q)}">
        <select class="select" id="st">
          <option value="">全部状态</option>
          <option value="draft" ${st==='draft'?'selected':''}>草稿</option>
          <option value="pending" ${st==='pending'?'selected':''}>待审核</option>
          <option value="published" ${st==='published'?'selected':''}>已发布</option>
          <option value="offline" ${st==='offline'?'selected':''}>已下架</option>
        </select>
        <select class="select" id="vband" title="${esc(viewLabel)}">
          ${opt(vband, '', viewLabel + '（全部）')}
          ${opt(vband, '1', '有观看')}
          ${opt(vband, '1000', '1K+')}
          ${opt(vband, '10000', '1万+')}
          ${opt(vband, '100000', '10万+')}
        </select>
        <select class="select" id="lband" title="喜欢点击量">
          ${opt(lband, '', '喜欢（全部）')}
          ${opt(lband, '1', '有点赞')}
          ${opt(lband, '1000', '1K+')}
          ${opt(lband, '10000', '1万+')}
        </select>
        <input class="search num" id="vmin" type="number" min="0" placeholder="最低观看" value="${esc(vmin)}">
        <input class="search num" id="lmin" type="number" min="0" placeholder="最低喜欢" value="${esc(lmin)}">
        <select class="select" id="sortStat">
          ${opt(sortStat, 'views-desc', '观看从高到低')}
          ${opt(sortStat, 'views-asc', '观看从低到高')}
          ${opt(sortStat, 'likes-desc', '喜欢从高到低')}
          ${opt(sortStat, 'likes-asc', '喜欢从低到高')}
          ${opt(sortStat, 'title-asc', '名称 A-Z')}
        </select>
        <button class="btn" id="filterBtn">筛选</button>
        <button class="btn btn-primary" id="addWork">${esc(cfg.add)}</button>
      </div></div>
      <div class="table-wrap"><table><thead><tr>
        <th>封面</th><th>ID</th><th>名称</th><th>作者</th>${originCol}<th>进度</th><th>VIP</th><th>运营</th><th>状态</th>${durationCol}
        <th><button type="button" class="th-sort" data-sort="views">${esc(viewLabel)}${sortMark(sortStat, 'views')}</button></th>
        <th><button type="button" class="th-sort" data-sort="likes">喜欢点击量${sortMark(sortStat, 'likes')}</button></th>
        <th>操作</th>
      </tr></thead><tbody>
      ${p.rows.map((c)=>`<tr>
        <td>${mediaImg(c.cover, 'thumb')}</td>
        <td>${esc(c.id)}</td>
        <td>${esc(c.title)}<div style="color:var(--muted);font-size:12px">${esc(c.titleEn || '')}</div></td>
        <td>${esc(c.authorId || '-')}</td>
        ${cfg.hasOrigin ? `<td>${badge(c.origin)}</td>` : ''}
        <td>${badge(c.progress)}</td>
        <td>${badge(c.vip)}</td>
        <td>${c.exclusive ? '<span class="badge badge-info">独播</span> ' : ''}${c.recommend ? '<span class="badge badge-on">推荐</span>' : ''}${(!c.exclusive && !c.recommend) ? '-' : ''}</td>
        <td>${badge(c.publishStatus || c.status)}</td>
        ${cfg.hasDuration ? `<td>${esc(c.duration || '-')}</td>` : ''}
        <td>${statCell(c.views)}</td>
        <td>${statCell(c.likes)}</td>
        <td class="row-actions">
          <button class="btn" data-edit="${esc(c.id)}">编辑</button>
          <a class="btn" href="#/${cfg.unitPage}?work=${esc(c.id)}">${esc(cfg.unitName)}</a>
          <a class="btn" href="${cfg.preview(c.id)}" target="_blank">预览</a>
          <button class="btn" data-flow="${esc(c.id)}">状态</button>
        </td>
      </tr>`).join('') || `<tr><td colspan="${colCount}" class="empty">暂无符合条件的${esc(cfg.module)}</td></tr>`}
      </tbody></table></div>${pagerHtml(p)}</div>`);
  }

  function workFields(cfg, row) {
    const fields = [
      { key: 'id', label: cfg.module + 'ID', value: row.id || '' },
      { key: 'title', label: '中文标题' },
      { key: 'titleEn', label: '英文标题' },
      { key: 'titlePt', label: '葡语标题' },
      { key: 'authorId', label: '作者', type: 'select', options: S.db().authors.filter((a) => !a.kind || a.kind === cfg.key).map((a)=>({ v: a.name, l: a.name })) },
    ];
    if (cfg.hasOrigin) {
      fields.push({ key: 'origin', label: '地区', type: 'select', options: [{v:'korean',l:'韩漫'},{v:'japanese',l:'日漫'}] });
    }
    fields.push(
      { key: 'progress', label: '进度', type: 'select', options: [{v:'updating',l:'连载中'},{v:'ended',l:'已完结'}] },
      { key: 'vip', label: 'VIP（对应前台免费/会员资格）', type: 'select', options: [{v:'free',l:'免费'},{v:'partial',l:'部分VIP'},{v:'full',l:'全VIP'}] },
      { key: 'exclusive', label: '独播（详情页 Exclusive）', type: 'select', options: [{v:'0',l:'否'},{v:'1',l:'是'}] },
      { key: 'recommend', label: '推荐加权（首页/排行置顶）', type: 'select', options: [{v:'0',l:'否'},{v:'1',l:'是'}] },
    );
    if (cfg.hasDuration) fields.push({ key: 'duration', label: '单集时长' });
    if (cfg.video) {
      fields.push(
        { key: 'trailerUrl', label: '预告 / 相关视频外链（选填）', span: 2 },
        { key: 'trailer', label: '上传预告 / 相关视频', type: 'file', span: 2, accept: VIDEO_ACCEPT,
          hint: '支持 mp4 / webm / mov，单文件建议 300MB 内。分集正片请到「剧集」上传',
          preview: videoChip({ trailerKey: row.trailerKey, trailerUrl: row.trailerUrl, trailerName: row.trailerName }, '已上传预告视频') },
      );
    }
    fields.push(
      { key: 'catText', label: '分类（对应前台热门类别，逗号分隔）', span: 2 },
      { key: 'tagText', label: '标签（详情页 / 搜索关键词，逗号分隔）', span: 2 },
      { key: 'cover', label: '封面', type: 'file', span: 2, accept: 'image/jpeg,image/png,image/webp,image/gif',
        hint: '上传封面图，保存时自动压缩并写入资源库',
        preview: row.cover ? `<div class="file-preview">${mediaImg(row.cover, 'cover-lg')}</div>` : '' },
      { key: 'blurb', label: '作品详情 / 简介', type: 'textarea', rows: 8, span: 2 },
    );
    return fields;
  }

  function bindWorks(kind) {
    const cfg = KINDS[kind];
    const applyFilter = () => { pageIndex = 1; render(); };
    const filter = document.getElementById('filterBtn');
    if (filter) filter.onclick = applyFilter;
    const clear = document.getElementById('clearWorkFilter');
    if (clear) clear.onclick = () => {
      query = { _resetWorks: true };
      pageIndex = 1;
      render();
    };
    ['st', 'vband', 'lband', 'sortStat'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.onchange = applyFilter;
    });
    ['q', 'vmin', 'lmin'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.onkeydown = (e) => { if (e.key === 'Enter') applyFilter(); };
    });
    document.querySelectorAll('[data-sort]').forEach((btn) => {
      btn.onclick = () => {
        const key = btn.dataset.sort;
        const cur = query.sortStat || 'views-desc';
        const next = cur === key + '-desc' ? key + '-asc' : key + '-desc';
        const sel = document.getElementById('sortStat');
        if (sel) sel.value = next;
        query.sortStat = next;
        applyFilter();
      };
    });
    const add = document.getElementById('addWork');
    if (add) add.onclick = () => openForm({
      title: `${cfg.add}（草稿）`,
      fields: workFields(cfg, {}),
      value: { origin: 'korean', progress: 'updating', vip: 'partial', duration: '8分钟', exclusive: '0', recommend: '0' },
      onSubmit(data) {
        const id = (data.id || ('w_' + Math.random().toString(36).slice(2, 8))).trim();
        if ((S.db()[cfg.list] || []).some((c) => c.id === id)) throw new Error('ID 已存在且不可修改');
        return Promise.all([
          data.cover instanceof Blob ? S.saveImage(data.cover, { maxW: 720, quality: 0.82 }) : Promise.resolve(''),
          (cfg.video && data.trailer instanceof Blob) ? S.saveFile(data.trailer, { kind: 'video' }) : Promise.resolve(''),
        ]).then(([cover, trailer]) => {
            S.commit((db) => {
              db[cfg.list].unshift({
                id, kind, title: data.title, titleEn: data.titleEn || data.title, titlePt: data.titlePt || data.title,
                cover: cover || '../assets/comics/thumb-1.webp',
                thumb: cover || '../assets/comics/thumb-1.webp', authorId: data.authorId,
                categories: splitKeys(data.catText), tags: splitKeys(data.tagText),
                origin: cfg.hasOrigin ? data.origin : '', progress: data.progress, vip: data.vip,
                recommend: data.recommend === '1', exclusive: data.exclusive === '1',
                duration: data.duration || '', blurb: data.blurb, blurbEn: data.titleEn, views: 0, likes: 0, chapterCount: 0,
                trailerKey: trailer || '', trailerUrl: String(data.trailerUrl || '').trim(),
                trailerName: data.trailer instanceof Blob ? data.trailer.name : '',
                publishStatus: 'draft', createdAt: S.now(), updatedAt: S.now(),
              });
              db.reviews.unshift({ id: S.uid('rv'), kind, targetType: kind, targetId: id, title: data.title, status: 'pending', reason: '', reviewer: '', createdAt: S.now() });
            }, { actor: actor().name, role: actor().role, module: cfg.module, action: '创建草稿', detail: id });
            toast('已创建草稿，进入审核流');
            render();
          });
      },
    });
    document.querySelectorAll('[data-edit]').forEach((btn) => {
      btn.onclick = () => {
        const row = S.db()[cfg.list].find((c) => c.id === btn.dataset.edit);
        openForm({
          title: '编辑' + cfg.module,
          fields: workFields(cfg, row).map((f) => f.key === 'id' ? Object.assign({}, f, { readonly: true }) : f),
          value: Object.assign({}, row, {
            catText: (row.categories || []).join(','),
            tagText: (row.tags || []).join(','),
            exclusive: row.exclusive ? '1' : '0',
            recommend: row.recommend ? '1' : '0',
          }),
          onSubmit(data) {
            return Promise.all([
              data.cover instanceof Blob ? S.saveImage(data.cover, { maxW: 720, quality: 0.82 }) : Promise.resolve(''),
              (cfg.video && data.trailer instanceof Blob) ? S.saveFile(data.trailer, { kind: 'video' }) : Promise.resolve(''),
            ]).then(([cover, trailer]) => {
              S.commit((db) => {
                const item = db[cfg.list].find((c) => c.id === row.id);
                if (!item) return;
                item.title = data.title; item.titleEn = data.titleEn; item.titlePt = data.titlePt;
                item.authorId = data.authorId; item.progress = data.progress; item.vip = data.vip;
                item.exclusive = data.exclusive === '1'; item.recommend = data.recommend === '1';
                item.categories = splitKeys(data.catText); item.tags = splitKeys(data.tagText);
                if (cfg.hasOrigin) item.origin = data.origin;
                if (cfg.hasDuration) item.duration = data.duration;
                item.blurb = data.blurb; item.updatedAt = S.now();
                if (cover) { item.cover = cover; item.thumb = cover; }
                if (cfg.video) {
                  if (data.trailerUrl !== undefined) item.trailerUrl = String(data.trailerUrl || '').trim();
                  if (trailer) {
                    item.trailerKey = trailer;
                    item.trailerName = data.trailer instanceof Blob ? data.trailer.name : (item.trailerName || '预告视频');
                  }
                }
              }, { actor: actor().name, role: actor().role, module: cfg.module, action: '编辑', detail: row.id });
              toast('已保存');
              render();
            });
          },
        });
      };
    });
    document.querySelectorAll('[data-flow]').forEach((btn) => {
      btn.onclick = () => {
        const row = S.db()[cfg.list].find((c) => c.id === btn.dataset.flow);
        openForm({
          title: '状态流转',
          fields: [{ key: 'publishStatus', label: '状态', type: 'select', options: [
            { v: 'draft', l: '草稿' }, { v: 'pending', l: '待审核' }, { v: 'published', l: '已发布' }, { v: 'offline', l: '已下架' },
          ]}],
          value: { publishStatus: row.publishStatus || row.status },
          onSubmit(data) {
            S.commit((db) => {
              const item = db[cfg.list].find((c) => c.id === row.id);
              item.publishStatus = data.publishStatus;
              item.updatedAt = S.now();
            }, { actor: actor().name, role: actor().role, module: cfg.module, action: '状态变更', detail: `${row.id} → ${data.publishStatus}` });
            toast('状态已更新');
            render();
          },
        });
      };
    });
  }

  function renderUnits(kind) {
    const cfg = KINDS[kind];
    const workId = hashQuery().get('work') || hashQuery().get('comic') || '';
    const d = S.db();
    const works = d[cfg.list] || [];
    let list = (d[cfg.units] || []).slice();
    if (workId) list = list.filter((c) => c.comicId === workId);
    list.sort((a, b) => a.comicId.localeCompare(b.comicId) || a.no - b.no);
    const p = paginate(list);
    const extraHead = cfg.body
      ? '<th>正文</th>'
      : (cfg.video ? '<th>时长</th><th>视频</th>' : (cfg.hasDuration ? '<th>时长</th>' : '<th>图片</th>'));
    const extraCell = (c) => {
      if (cfg.body) return `<td>${c.body ? '已录入' : '空'}</td>`;
      if (cfg.video) {
        return `<td>${esc(c.duration || '-')}</td><td>${hasVideoFile(c) ? '<span class="badge badge-on">已上传</span>' : '<span class="badge badge-warn">未上传</span>'}</td>`;
      }
      if (cfg.hasDuration) return `<td>${esc(c.duration || '-')}</td>`;
      return `<td>${(c.assets || []).length} 张</td>`;
    };
    const colCount = cfg.video ? 9 : 8;
    return layout(`<div class="panel"><div class="panel-h"><h2>${esc(cfg.unitTitle)}</h2>
      <div class="toolbar">
        <select class="select" id="comicSel"><option value="">全部作品</option>${works.map((c)=>`<option value="${esc(c.id)}" ${workId===c.id?'selected':''}>${esc(c.title)}</option>`).join('')}</select>
        <button class="btn btn-primary" id="addCh">${esc(cfg.unitAdd)}</button>
      </div></div>
      <div class="table-wrap"><table><thead><tr><th>作品</th><th>序号</th><th>标题</th><th>免费/VIP</th><th>状态</th>${extraHead}<th>发布时间</th><th>操作</th></tr></thead><tbody>
      ${p.rows.map((c)=>`<tr>
        <td>${esc(comicName(c.comicId))}</td><td>${c.no}</td><td>${esc(c.title)}</td>
        <td>${c.free ? badge('free') : badge('full')}</td><td>${badge(c.status)}</td>
        ${extraCell(c)}
        <td>${esc(c.publishAt)}</td>
        <td class="row-actions"><button class="btn" data-editch="${esc(c.id)}">编辑</button><button class="btn" data-sort="${esc(c.id)}">调序</button></td>
      </tr>`).join('') || `<tr><td colspan="${colCount}" class="empty">暂无${esc(cfg.unitName)}</td></tr>`}
      </tbody></table></div>${pagerHtml(p)}</div>`);
  }

  function bindUnits(kind) {
    const cfg = KINDS[kind];
    const sel = document.getElementById('comicSel');
    if (sel) sel.onchange = () => {
      location.hash = sel.value ? `#/${cfg.unitPage}?work=${sel.value}` : `#/${cfg.unitPage}`;
      pageIndex = 1;
      render();
    };
    const add = document.getElementById('addCh');
    if (add) add.onclick = () => {
      const works = S.db()[cfg.list] || [];
      const fields = [
        { key: 'comicId', label: '作品', type: 'select', options: works.map((c)=>({ v: c.id, l: c.title })) },
        { key: 'no', label: '序号', type: 'number' },
        { key: 'title', label: '标题' },
        { key: 'free', label: '资费', type: 'select', options: [{v:'1',l:'免费'},{v:'0',l:'VIP'}] },
        { key: 'status', label: '发布', type: 'select', options: [{v:'published',l:'立即发布'},{v:'draft',l:'定时/草稿'}] },
        { key: 'publishAt', label: '发布时间' },
      ];
      if (cfg.hasDuration) fields.push({ key: 'duration', label: '时长' });
      if (cfg.body) fields.push({ key: 'body', label: '章节正文（作品详情内容）', type: 'textarea', rows: 12, span: 2 });
      if (cfg.files) fields.push({
        key: 'files', label: '章节图片（作品详情内容）', type: 'file', multiple: true, span: 2,
        accept: 'image/jpeg,image/png,image/webp,image/gif',
        hint: '可多选，按文件名排序。图片写入独立资源库，避免本地存储溢出',
      });
      if (cfg.video) {
        fields.push({ key: 'videoUrl', label: '视频外链（选填，https）', span: 2 });
        fields.push({
          key: 'video', label: '上传剧集视频', type: 'file', span: 2, accept: VIDEO_ACCEPT,
          hint: '支持 mp4 / webm / mov，单集建议 300MB 内。保存后播放页可直接播放',
        });
      }
      openForm({
        title: cfg.unitAdd,
        fields,
        value: { no: 1, free: '1', status: 'published', publishAt: S.now(), duration: '8分钟' },
        onSubmit(data) {
          const picked = fileListOf(data.files);
          const videoFile = fileListOf(data.video)[0];
          const loadAssets = cfg.files
            ? (picked.length ? saveImages(picked, { maxW: 1400, quality: 0.8 }) : Promise.resolve([{ key: '../assets/comics/thumb-1.webp', sort: 1 }]))
            : Promise.resolve([]);
          const loadVideo = (cfg.video && videoFile) ? S.saveFile(videoFile, { kind: 'video' }) : Promise.resolve('');
          return Promise.all([loadAssets, loadVideo]).then(([assets, videoKey]) => {
            S.commit((db) => {
              db[cfg.units].push({
                id: S.uid(cfg.unit === '集' ? 'ep' : 'ch'), comicId: data.comicId, no: Number(data.no) || 1,
                title: data.title || `第${data.no}${cfg.unit}`,
                cover: assets[0] && assets[0].key || '', free: data.free === '1', status: data.status,
                publishAt: data.publishAt, body: data.body || '', duration: data.duration || '', assets,
                videoKey: videoKey || '', videoUrl: String(data.videoUrl || '').trim(),
                videoName: videoFile ? videoFile.name : '',
              });
            }, { actor: actor().name, role: actor().role, module: cfg.unitName, action: '上传', detail: `${data.comicId} #${data.no}` });
            toast(cfg.video && (videoKey || data.videoUrl) ? '剧集视频已接入' : (cfg.files ? '章节内容已上传' : `${cfg.unitName}已保存`));
            render();
          });
        },
      });
    };
    document.querySelectorAll('[data-editch]').forEach((btn) => {
      btn.onclick = () => {
        const row = S.db()[cfg.units].find((c) => c.id === btn.dataset.editch);
        const fields = [
          { key: 'title', label: '标题' },
          { key: 'no', label: '序号', type: 'number' },
          { key: 'free', label: '资费', type: 'select', options: [{v:'1',l:'免费'},{v:'0',l:'VIP'}] },
          { key: 'status', label: '状态', type: 'select', options: [{v:'draft',l:'草稿'},{v:'published',l:'已发布'}] },
        ];
        if (cfg.hasDuration) fields.push({ key: 'duration', label: '时长' });
        if (cfg.body) fields.push({ key: 'body', label: '章节正文（作品详情内容）', type: 'textarea', rows: 12, span: 2 });
        if (cfg.files) {
          const preview = (row.assets || []).map((a) => mediaImg(a.key, 'thumb')).join('');
          fields.push({
            key: 'files', label: '章节图片（作品详情内容）', type: 'file', multiple: true, span: 2,
            accept: 'image/jpeg,image/png,image/webp,image/gif',
            hint: preview ? '再选文件将替换当前图片；不选则保留原图' : '可多选上传章节内容图',
            preview: preview ? `<div class="file-preview">${preview}</div>` : '',
          });
        }
        if (cfg.video) {
          fields.push({ key: 'videoUrl', label: '视频外链（选填，https）', span: 2 });
          fields.push({
            key: 'video', label: '上传剧集视频', type: 'file', span: 2, accept: VIDEO_ACCEPT,
            hint: hasVideoFile(row) ? '再选文件将替换当前视频；不选则保留原片' : '支持 mp4 / webm / mov',
            preview: videoChip(row, '已上传剧集视频'),
          });
        }
        openForm({
          title: '编辑' + cfg.unitName,
          fields,
          value: { title: row.title, no: row.no, free: row.free ? '1' : '0', status: row.status, duration: row.duration, body: row.body, videoUrl: row.videoUrl || '' },
          onSubmit(data) {
            const picked = fileListOf(data.files);
            const videoFile = fileListOf(data.video)[0];
            const loadAssets = (cfg.files && picked.length)
              ? saveImages(picked, { maxW: 1400, quality: 0.8 })
              : Promise.resolve(null);
            const loadVideo = (cfg.video && videoFile) ? S.saveFile(videoFile, { kind: 'video' }) : Promise.resolve('');
            return Promise.all([loadAssets, loadVideo]).then(([assets, videoKey]) => {
              S.commit((db) => {
                const item = db[cfg.units].find((c) => c.id === row.id);
                item.title = data.title; item.no = Number(data.no); item.free = data.free === '1'; item.status = data.status;
                if (cfg.hasDuration) item.duration = data.duration;
                if (cfg.body) item.body = data.body;
                if (assets) {
                  item.assets = assets;
                  item.cover = assets[0] && assets[0].key || item.cover;
                }
                if (cfg.video) {
                  if (data.videoUrl !== undefined) item.videoUrl = String(data.videoUrl || '').trim();
                  if (videoKey) {
                    item.videoKey = videoKey;
                    item.videoName = videoFile ? videoFile.name : (item.videoName || '剧集视频');
                  }
                }
              }, { actor: actor().name, role: actor().role, module: cfg.unitName, action: '编辑/调序', detail: `${row.id} no=${data.no}` });
              toast(cfg.video && (videoKey || data.videoUrl) ? '剧集视频已保存' : '已保存');
              render();
            });
          },
        });
      };
    });
    document.querySelectorAll('[data-sort]').forEach((btn) => {
      btn.onclick = () => {
        const row = S.db()[cfg.units].find((c) => c.id === btn.dataset.sort);
        openForm({
          title: '调整序号',
          fields: [{ key: 'no', label: '新序号', type: 'number' }],
          value: row,
          onSubmit(data) {
            S.commit((db) => {
              const item = db[cfg.units].find((c) => c.id === row.id);
              item.no = Number(data.no);
            }, { actor: actor().name, role: actor().role, module: cfg.unitName, action: '调序', detail: `${row.id} → ${data.no}` });
            toast('序号已调整');
            render();
          },
        });
      };
    });
  }

  function simpleTable(title, addLabel, columns, rows, onAdd, onEdit, onExtra) {
    const p = paginate(rows);
    const head = columns.map((c) => `<th>${esc(c.label)}</th>`).join('') + '<th>操作</th>';
    const body = p.rows.map((row) => `<tr>${columns.map((c) => `<td>${c.render ? c.render(row) : esc(row[c.key])}</td>`).join('')}
      <td class="row-actions">${onEdit ? `<button class="btn" data-id="${esc(row.id)}">编辑</button>` : ''}${onExtra ? onExtra(row) : ''}</td></tr>`).join('')
      || `<tr><td class="empty" colspan="${columns.length + 1}">暂无数据</td></tr>`;
    return `<div class="panel"><div class="panel-h"><h2>${esc(title)}</h2>
      <div class="toolbar">${addLabel ? `<button class="btn btn-primary" id="addBtn">${esc(addLabel)}</button>` : ''}</div></div>
      <div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>${pagerHtml(p)}</div>`;
  }

  function bindSimple(onAdd, onEdit) {
    const add = document.getElementById('addBtn');
    if (add && onAdd) add.onclick = onAdd;
    document.querySelectorAll('[data-id]').forEach((btn) => {
      if (onEdit) btn.onclick = () => onEdit(btn.dataset.id);
    });
  }

  function byKind(list, kind) {
    return (list || []).filter((x) => !x.kind || x.kind === kind);
  }

  function reviewKindOf(r) {
    if (r.kind) return r.kind;
    if (r.targetType === 'novel' || r.targetType === 'novel-chapter') return 'novel';
    if (r.targetType === 'anime' || r.targetType === 'episode') return 'anime';
    return 'comic';
  }

  function worksOfAuthor(kind, author) {
    return (S.db()[KINDS[kind].list] || []).filter((w) => w.authorId === author.name || w.authorId === author.id);
  }

  function worksOfCategory(kind, cat) {
    const key = cat.key || cat.id;
    return (S.db()[KINDS[kind].list] || []).filter((w) => {
      if (key === 'korean' || key === 'japanese') return (w.origin || 'korean') === key;
      return (w.categories || []).includes(key);
    });
  }

  function worksOfTag(kind, tag) {
    const name = tag.name;
    const key = tag.key || '';
    const rev = Object.keys(S.CAT_MAP || {}).find((k) => S.CAT_MAP[k] === name) || '';
    const extraCats = extraCatsOfTag(name);
    return (S.db()[KINDS[kind].list] || []).filter((w) => {
      const tags = w.tags || [];
      const cats = w.categories || [];
      return tags.includes(name) || (key && (tags.includes(key) || cats.includes(key)))
        || (rev && cats.includes(rev)) || cats.includes(name)
        || extraCats.some((k) => cats.includes(k));
    });
  }

  function isOriginCat(cat) {
    return cat.key === 'korean' || cat.key === 'japanese';
  }

  function renderKindAuthors(kind) {
    const cfg = KINDS[kind];
    const rows = byKind(S.db().authors, kind).map((a) => Object.assign({}, a, { works: worksOfAuthor(kind, a).length }));
    return layout(simpleTable(`${cfg.module}作者`, '新增作者', [
      { key: 'name', label: '名称' },
      { label: '简介', render: (r) => `<span style="color:var(--muted)">${esc((r.bio || '').slice(0, 24))}${(r.bio || '').length > 24 ? '…' : ''}</span>` },
      { key: 'works', label: '作品数' },
      { label: '状态', render: (r) => badge(r.status) },
    ], rows, null, true, (row) => `
      <button class="btn" data-works="${esc(row.id)}">作品</button>
      <button class="btn" data-bind="${esc(row.id)}">绑定</button>
      <button class="btn" data-toggle="${esc(row.id)}">${row.status === 'off' ? '启用' : '停用'}</button>
      <button class="btn btn-danger" data-del="${esc(row.id)}">删除</button>`));
  }

  function renderKindCategories(kind) {
    const cfg = KINDS[kind];
    const rows = byKind(S.db().categories, kind).slice().sort((a, b) => (a.sort || 0) - (b.sort || 0))
      .map((c) => Object.assign({}, c, { works: worksOfCategory(kind, c).length }));
    return layout(simpleTable(`${cfg.module}分类`, '新增分类', [
      { key: 'key', label: '标识' },
      { key: 'name', label: '名称' },
      { key: 'sort', label: '排序' },
      { key: 'works', label: '作品数' },
      { label: '前台', render: (r) => isOriginCat(r) ? '地区筛选' : '热门类别' },
      { label: '状态', render: (r) => badge(r.status) },
    ], rows, null, true, (row) => `
      <button class="btn" data-up="${esc(row.id)}">上移</button>
      <button class="btn" data-down="${esc(row.id)}">下移</button>
      <button class="btn" data-works="${esc(row.id)}">作品</button>
      <button class="btn" data-bind="${esc(row.id)}">绑定</button>
      <button class="btn" data-toggle="${esc(row.id)}">${row.status === 'off' ? '启用' : '停用'}</button>
      <a class="btn" href="${cfg.catalog}" target="_blank">预览</a>
      ${isOriginCat(row) ? '' : `<button class="btn btn-danger" data-del="${esc(row.id)}">删除</button>`}`));
  }

  function renderKindTags(kind) {
    const cfg = KINDS[kind];
    const rows = byKind(S.db().tags, kind).map((t) => Object.assign({}, t, { works: worksOfTag(kind, t).length }));
    return layout(simpleTable(`${cfg.module}标签`, '新增标签', [
      { key: 'name', label: '名称' },
      { key: 'works', label: '作品数' },
      { label: '用途', render: () => kind === 'anime' ? '详情 / 搜索' : '关键词 / 搜索' },
      { label: '状态', render: (r) => badge(r.status) },
    ], rows, null, true, (row) => `
      <button class="btn" data-works="${esc(row.id)}">作品</button>
      <button class="btn" data-bind="${esc(row.id)}">绑定</button>
      <button class="btn" data-toggle="${esc(row.id)}">${row.status === 'off' ? '启用' : '停用'}</button>
      <button class="btn btn-danger" data-del="${esc(row.id)}">删除</button>`));
  }

  function bindKindMeta(kind, type) {
    const cfg = KINDS[kind];
    const titles = { authors: '作者', categories: '分类', tags: '标签' };
    const listKey = type;
    const fieldsOf = (row) => {
      if (type === 'authors') {
        return [
          { key: 'name', label: '名称' },
          { key: 'bio', label: '简介', type: 'textarea', span: 2 },
          { key: 'status', label: '状态', type: 'select', options: [{ v: 'on', l: '启用' }, { v: 'off', l: '停用' }, { v: 'active', l: '正常' }] },
        ];
      }
      if (type === 'categories') {
        const locked = !!(row && isOriginCat(row));
        return [
          { key: 'key', label: locked ? '标识（韩漫/日漫对应前台地区筛选，不可改）' : '标识（前台 data-category）', readonly: locked },
          { key: 'name', label: '显示名称' },
          { key: 'sort', label: '排序（热门类别顺序）', type: 'number' },
          { key: 'status', label: '状态', type: 'select', options: [{ v: 'on', l: '启用' }, { v: 'off', l: '停用' }] },
        ];
      }
      return [
        { key: 'name', label: '名称' },
        { key: 'status', label: '状态', type: 'select', options: [{ v: 'on', l: '启用' }, { v: 'off', l: '停用' }] },
      ];
    };
    bindSimple(() => openForm({
      title: '新增' + titles[type],
      fields: fieldsOf({}),
      value: { status: 'on', sort: 99 },
      onSubmit(data) {
        S.commit((db) => {
          const row = Object.assign({ id: S.uid(type.slice(0, 3)), kind, status: 'on', createdAt: S.now(), works: 0 }, data);
          if (type === 'categories') row.key = (data.key || data.name || row.id).trim();
          db[listKey].unshift(row);
        }, { actor: actor().name, role: actor().role, module: cfg.module + titles[type], action: '新增', detail: data.name || data.key || '' });
        toast('已新增');
        render();
      },
    }), (id) => {
      const row = S.db()[listKey].find((x) => x.id === id);
      const oldName = row.name;
      const oldKey = row.key;
      openForm({
        title: '编辑' + titles[type],
        fields: fieldsOf(row),
        value: row,
        onSubmit(data) {
          if (type === 'categories' && isOriginCat(row) && data.key && data.key !== row.key) {
            toast('韩漫 / 日漫标识对应前台地区筛选，不可修改');
            return;
          }
          S.commit((db) => {
            const item = db[listKey].find((x) => x.id === id);
            Object.assign(item, data, { kind });
            const works = db[cfg.list] || [];
            if (type === 'authors' && data.name && data.name !== oldName) {
              works.forEach((w) => {
                if (w.authorId === oldName || w.authorId === row.id) w.authorId = data.name;
              });
            }
            if (type === 'categories' && data.key && data.key !== oldKey && !isOriginCat(row)) {
              works.forEach((w) => {
                w.categories = (w.categories || []).map((k) => (k === oldKey ? data.key : k));
              });
            }
            if (type === 'tags' && data.name && data.name !== oldName) {
              works.forEach((w) => {
                w.tags = (w.tags || []).map((k) => (k === oldName ? data.name : k));
              });
            }
          }, { actor: actor().name, role: actor().role, module: cfg.module + titles[type], action: '编辑', detail: id });
          toast('已保存，已同步到关联作品');
          render();
        },
      });
    });

    const workOptions = (S.db()[cfg.list] || []).map((w) => ({ v: w.id, l: w.title }));

    document.querySelectorAll('[data-works]').forEach((btn) => {
      btn.onclick = () => {
        const row = S.db()[listKey].find((x) => x.id === btn.dataset.works);
        const q = type === 'authors' ? `author=${encodeURIComponent(row.name)}`
          : type === 'categories' ? `cat=${encodeURIComponent(row.key || row.id)}`
            : `tag=${encodeURIComponent(row.name)}`;
        pageIndex = 1;
        location.hash = `#/${cfg.page}?${q}`;
      };
    });

    document.querySelectorAll('[data-bind]').forEach((btn) => {
      btn.onclick = () => {
        const row = S.db()[listKey].find((x) => x.id === btn.dataset.bind);
        if (!workOptions.length) { toast('暂无作品可绑定'); return; }
        openForm({
          title: type === 'authors' ? '将作品改挂到该作者' : type === 'categories' ? '把作品加入此分类' : '给作品打上此标签',
          fields: [{ key: 'workId', label: '作品', type: 'select', options: workOptions }],
          onSubmit(data) {
            S.commit((db) => {
              const work = (db[cfg.list] || []).find((w) => w.id === data.workId);
              if (!work) return;
              if (type === 'authors') work.authorId = row.name;
              if (type === 'categories') {
                if (isOriginCat(row)) work.origin = row.key;
                else {
                  work.categories = work.categories || [];
                  if (!work.categories.includes(row.key)) work.categories.push(row.key);
                }
              }
              if (type === 'tags') {
                work.tags = work.tags || [];
                if (!work.tags.includes(row.name)) work.tags.push(row.name);
              }
              work.updatedAt = S.now();
            }, { actor: actor().name, role: actor().role, module: cfg.module + titles[type], action: '绑定作品', detail: `${row.name || row.key} → ${data.workId}` });
            toast('已绑定到作品');
            render();
          },
        });
      };
    });

    document.querySelectorAll('[data-toggle]').forEach((btn) => {
      btn.onclick = () => {
        S.commit((db) => {
          const item = db[listKey].find((x) => x.id === btn.dataset.toggle);
          const cur = item.status === 'off' ? 'off' : 'on';
          item.status = cur === 'off' ? 'on' : 'off';
        }, { actor: actor().name, role: actor().role, module: cfg.module + titles[type], action: '启停', detail: btn.dataset.toggle });
        toast('状态已更新');
        render();
      };
    });

    document.querySelectorAll('[data-up], [data-down]').forEach((btn) => {
      btn.onclick = () => {
        const down = btn.hasAttribute('data-down');
        const id = btn.dataset.up || btn.dataset.down;
        S.commit((db) => {
          const rows = (db.categories || []).filter((x) => !x.kind || x.kind === kind)
            .sort((a, b) => (a.sort || 0) - (b.sort || 0));
          const i = rows.findIndex((x) => x.id === id);
          const j = down ? i + 1 : i - 1;
          if (i < 0 || j < 0 || j >= rows.length) return;
          const a = db.categories.find((x) => x.id === rows[i].id);
          const b = db.categories.find((x) => x.id === rows[j].id);
          const tmp = a.sort;
          a.sort = b.sort;
          b.sort = tmp;
        }, { actor: actor().name, role: actor().role, module: cfg.module + '分类', action: '调序', detail: id });
        render();
      };
    });

    document.querySelectorAll('[data-del]').forEach((btn) => {
      btn.onclick = async () => {
        const row = S.db()[listKey].find((x) => x.id === btn.dataset.del);
        if (type === 'categories' && isOriginCat(row)) {
          toast('韩漫 / 日漫是前台地区筛选，不能删除，可停用');
          return;
        }
        const related = type === 'authors' ? worksOfAuthor(kind, row)
          : type === 'categories' ? worksOfCategory(kind, row)
            : worksOfTag(kind, row);
        if (type === 'authors' && related.length) {
          toast(`还有 ${related.length} 部作品挂在该作者下，请先改挂或删除作品`);
          return;
        }
        const hint = related.length
          ? `将从 ${related.length} 部作品中移除该${titles[type]}，并删除条目。是否继续？`
          : `确认删除该${titles[type]}？`;
        if (!(await confirmBox(hint))) return;
        S.commit((db) => {
          if (type === 'categories') {
            (db[cfg.list] || []).forEach((w) => {
              w.categories = (w.categories || []).filter((k) => k !== row.key);
            });
          }
          if (type === 'tags') {
            (db[cfg.list] || []).forEach((w) => {
              w.tags = (w.tags || []).filter((k) => k !== row.name && k !== row.key);
            });
          }
          db[listKey] = db[listKey].filter((x) => x.id !== row.id);
        }, { actor: actor().name, role: actor().role, module: cfg.module + titles[type], action: '删除', detail: row.name || row.key || row.id });
        toast('已删除');
        render();
      };
    });
  }

  function renderReview(kind) {
    const cfg = KINDS[kind];
    const list = byKind(S.db().reviews, kind).filter((r) => reviewKindOf(r) === kind);
    const p = paginate(list);
    return layout(`<div class="panel"><div class="panel-h"><h2>${esc(cfg.module)}审核</h2></div>
      <p style="color:var(--muted);font-size:13px;margin-bottom:12px">流转：草稿 → 待审核 → 审核中 → 通过/驳回 → 发布。驳回必须填写原因。</p>
      <div class="table-wrap"><table><thead><tr><th>对象</th><th>标题</th><th>状态</th><th>原因</th><th>审核人</th><th>时间</th><th>操作</th></tr></thead><tbody>
      ${p.rows.map((r)=>`<tr>
        <td>${esc({ comic: '漫画', novel: '小说', anime: '动画', chapter: '章节', 'novel-chapter': '章节', episode: '剧集' }[r.targetType] || r.targetType)}</td><td>${esc(r.title)}</td><td>${badge(r.status === 'pending' ? 'pending' : r.status)}</td>
        <td>${esc(r.reason)}</td><td>${esc(r.reviewer || '-')}</td><td>${esc(r.createdAt)}</td>
        <td class="row-actions">${r.status==='pending' ? `<button class="btn btn-primary" data-pass="${esc(r.id)}">通过</button><button class="btn btn-danger" data-rej="${esc(r.id)}">驳回</button>` : ''}<button class="btn" data-off="${esc(r.id)}">下架</button></td>
      </tr>`).join('') || `<tr><td colspan="7" class="empty">暂无审核工单</td></tr>`}
      </tbody></table></div>${pagerHtml(p)}</div>`);
  }

  function bindReview() {
    document.querySelectorAll('[data-pass]').forEach((btn) => {
      btn.onclick = () => {
        S.commit((db) => {
          const r = db.reviews.find((x) => x.id === btn.dataset.pass);
          r.status = 'approved'; r.reviewer = actor().name;
          const comic = db.comics.find((c) => c.id === r.targetId)
            || (db.novels || []).find((c) => c.id === r.targetId)
            || (db.anime || []).find((c) => c.id === r.targetId);
          if (comic) comic.publishStatus = 'published';
        }, { actor: actor().name, role: actor().role, module: '审核', action: '通过', detail: btn.dataset.pass });
        toast('已通过并发布');
        render();
      };
    });
    document.querySelectorAll('[data-rej]').forEach((btn) => {
      btn.onclick = () => openForm({
        title: '驳回原因（必填）',
        fields: [
          { key: 'reason', label: '标准原因', type: 'select', options: [{v:'封面不合规',l:'封面不合规'},{v:'标题问题',l:'标题问题'},{v:'简介问题',l:'简介问题'},{v:'章节图片问题',l:'章节图片问题'},{v:'自定义',l:'自定义'}] },
          { key: 'custom', label: '自定义说明', type: 'textarea', span: 2 },
        ],
        onSubmit(data) {
          const reason = data.reason === '自定义' ? data.custom : data.reason;
          if (!reason) { toast('驳回原因必填'); return; }
          S.commit((db) => {
            const r = db.reviews.find((x) => x.id === btn.dataset.rej);
            r.status = 'rejected'; r.reason = reason; r.reviewer = actor().name;
          }, { actor: actor().name, role: actor().role, module: '审核', action: '驳回', detail: reason });
          toast('已驳回');
          render();
        },
      });
    });
    document.querySelectorAll('[data-off]').forEach((btn) => {
      btn.onclick = async () => {
        if (!(await confirmBox('下架后前台将不再展示新的阅读入口，历史订单保留。确认下架？'))) return;
        S.commit((db) => {
          const r = db.reviews.find((x) => x.id === btn.dataset.off);
          const comic = db.comics.find((c) => c.id === (r && r.targetId))
            || (db.novels || []).find((c) => c.id === (r && r.targetId))
            || (db.anime || []).find((c) => c.id === (r && r.targetId));
          if (comic) comic.publishStatus = 'offline';
        }, { actor: actor().name, role: actor().role, module: '审核', action: '下架', detail: btn.dataset.off });
        toast('已下架');
        render();
      };
    });
  }

  function renderUsers(onlyVip) {
    let list = S.db().users.slice();
    if (onlyVip) list = list.filter((u) => u.vip);
    const p = paginate(list);
    return layout(`<div class="panel"><div class="panel-h"><h2>${onlyVip ? 'VIP 用户' : '用户列表'}</h2></div>
      <div class="table-wrap"><table><thead><tr><th>ID</th><th>昵称</th><th>邮箱</th><th>渠道</th><th>VIP</th><th>充值</th><th>最后登录</th><th>状态</th><th>操作</th></tr></thead><tbody>
      ${p.rows.map((u)=>`<tr>
        <td>${esc(u.id)}</td><td>${esc(u.nickname)}</td><td>${esc(u.email)}</td><td>${esc(u.channel)}</td>
        <td>${u.vip ? badge('vip') : '-'}</td><td>¥${u.recharge}</td><td>${esc(u.lastLogin)}</td><td>${badge(u.status)}</td>
        <td class="row-actions">
          <button class="btn" data-user="${esc(u.id)}">详情</button>
          <button class="btn" data-ban="${esc(u.id)}">${u.status==='banned'?'解封':'封禁'}</button>
          <button class="btn" data-gift="${esc(u.id)}">VIP调整</button>
        </td>
      </tr>`).join('')}
      </tbody></table></div>${pagerHtml(p)}</div>`);
  }

  function bindUsers() {
    document.querySelectorAll('[data-user]').forEach((btn) => {
      btn.onclick = () => {
        const u = S.db().users.find((x) => x.id === btn.dataset.user);
        const orders = S.db().orders.filter((o) => o.userId === u.id);
        const mask = document.createElement('div');
        mask.className = 'modal-mask';
        mask.innerHTML = `<div class="modal"><h3>用户详情 ${esc(u.nickname)}</h3>
          <p style="color:var(--muted);line-height:1.8">邮箱 ${esc(u.email)} · 注册 ${esc(u.registeredAt)} · 设备 ${esc(u.device)} · 地区 ${esc(u.country)}<br>
          VIP ${u.vip ? u.vipUntil : '否'} · 订单 ${orders.length} 笔</p>
          <div class="table-wrap"><table><thead><tr><th>订单</th><th>金额</th><th>状态</th></tr></thead><tbody>
          ${orders.map((o)=>`<tr><td>${esc(o.id)}</td><td>¥${o.amount}</td><td>${badge(o.status)}</td></tr>`).join('') || '<tr><td colspan="3">无订单</td></tr>'}
          </tbody></table></div>
          <div class="modal-actions"><button class="btn" data-no>关闭</button></div></div>`;
        document.body.appendChild(mask);
        mask.onclick = (e) => { if (e.target.closest('[data-no]') || e.target === mask) mask.remove(); };
      };
    });
    document.querySelectorAll('[data-ban]').forEach((btn) => {
      btn.onclick = async () => {
        const u = S.db().users.find((x) => x.id === btn.dataset.ban);
        const next = u.status === 'banned' ? 'active' : 'banned';
        if (!(await confirmBox(`${next === 'banned' ? '封禁' : '解封'}账号 ${u.nickname}？将记录操作者与原因。`))) return;
        openForm({
          title: '操作原因',
          fields: [{ key: 'reason', label: '原因', type: 'textarea', span: 2 }],
          onSubmit(data) {
            S.commit((db) => {
              db.users.find((x) => x.id === u.id).status = next;
            }, { actor: actor().name, role: actor().role, module: '用户', action: next === 'banned' ? '封禁' : '解封', detail: `${u.id} ${data.reason}` });
            toast('已记录');
            render();
          },
        });
      };
    });
    document.querySelectorAll('[data-gift]').forEach((btn) => {
      btn.onclick = async () => {
        if (!(await confirmBox('VIP 赠送/调整涉及权益，需二次确认。继续？'))) return;
        openForm({
          title: 'VIP 调整',
          fields: [
            { key: 'op', label: '操作', type: 'select', options: [{v:'gift',l:'赠送月卡'},{v:'revoke',l:'撤销VIP'}] },
          ],
          onSubmit(data) {
            S.commit((db) => {
              const u = db.users.find((x) => x.id === btn.dataset.gift);
              if (data.op === 'gift') { u.vip = true; u.vipUntil = '2026-12-31'; }
              else { u.vip = false; u.vipUntil = ''; }
            }, { actor: actor().name, role: actor().role, module: '用户', action: 'VIP调整', detail: `${btn.dataset.gift} ${data.op}` });
            toast('VIP 已更新');
            render();
          },
        });
      };
    });
  }

  function renderOrders() {
    const p = paginate(S.db().orders);
    return layout(`<div class="panel"><div class="panel-h"><h2>订单</h2></div>
      <div class="table-wrap"><table><thead><tr><th>订单号</th><th>用户</th><th>商品</th><th>金额</th><th>渠道</th><th>渠道单号</th><th>状态</th><th>时间</th><th>代理</th></tr></thead><tbody>
      ${p.rows.map((o)=>`<tr>
        <td>${esc(o.id)}</td><td>${esc(userName(o.userId))}</td><td>${esc(o.planId)}</td><td>¥${o.amount}</td>
        <td>${esc(o.channel)}</td><td>${esc(o.channelNo)}</td><td>${badge(o.status)}</td><td>${esc(o.createdAt)}</td><td>${esc(o.agentId || '-')}</td>
      </tr>`).join('')}
      </tbody></table></div>${pagerHtml(p)}</div>`);
  }

  function renderRefunds() {
    const p = paginate(S.db().refunds);
    return layout(`<div class="panel"><div class="panel-h"><h2>退款审核</h2></div>
      <div class="table-wrap"><table><thead><tr><th>退款单</th><th>原订单</th><th>用户</th><th>金额</th><th>原因</th><th>状态</th><th>操作</th></tr></thead><tbody>
      ${p.rows.map((r)=>`<tr>
        <td>${esc(r.id)}</td><td>${esc(r.orderId)}</td><td>${esc(userName(r.userId))}</td><td>¥${r.amount}</td>
        <td>${esc(r.reason)}</td><td>${badge(r.status)}</td>
        <td>${r.status==='pending' ? `<button class="btn btn-primary" data-ok="${esc(r.id)}">通过</button><button class="btn" data-no="${esc(r.id)}">驳回</button>` : '-'}</td>
      </tr>`).join('')}
      </tbody></table></div>${pagerHtml(p)}</div>`);
  }

  function bindRefunds() {
    document.querySelectorAll('[data-ok]').forEach((btn) => {
      btn.onclick = async () => {
        if (!(await confirmBox('退款通过后不会删除原订单，仅更新状态并按规则回收 VIP。确认？'))) return;
        S.commit((db) => {
          const r = db.refunds.find((x) => x.id === btn.dataset.ok);
          r.status = 'success';
          const o = db.orders.find((x) => x.id === r.orderId);
          if (o) o.status = 'closed';
        }, { actor: actor().name, role: actor().role, module: '退款', action: '通过', detail: btn.dataset.ok });
        toast('退款已执行（幂等：重复点击不会重复建单）');
        render();
      };
    });
    document.querySelectorAll('[data-no]').forEach((btn) => {
      btn.onclick = () => {
        S.commit((db) => { db.refunds.find((x) => x.id === btn.dataset.no).status = 'rejected'; },
          { actor: actor().name, role: actor().role, module: '退款', action: '驳回', detail: btn.dataset.no });
        toast('已驳回');
        render();
      };
    });
  }

  function renderAgents() {
    const p = paginate(S.db().agents);
    return layout(`<div class="panel"><div class="panel-h"><h2>代理管理</h2><button class="btn btn-primary" id="addBtn">创建代理</button></div>
      <div class="table-wrap"><table><thead><tr><th>ID</th><th>名称</th><th>层级</th><th>上级</th><th>状态</th><th>业绩</th><th>佣金</th><th>操作</th></tr></thead><tbody>
      ${p.rows.map((a)=>`<tr>
        <td>${esc(a.id)}</td><td>${esc(a.name)}</td><td>${a.level}级</td><td>${esc(a.parentId || '-')}</td>
        <td>${badge(a.status === 'on' ? 'on' : a.status)}</td><td>¥${a.sales}</td><td>¥${a.commission}</td>
        <td class="row-actions"><button class="btn" data-id="${esc(a.id)}">审核/启停</button></td>
      </tr>`).join('')}
      </tbody></table></div>${pagerHtml(p)}</div>`);
  }

  function bindAgents() {
    const add = document.getElementById('addBtn');
    if (add) add.onclick = () => openForm({
      title: '创建代理',
      fields: [
        { key: 'name', label: '名称' },
        { key: 'level', label: '层级', type: 'select', options: [{v:'1',l:'一级'},{v:'2',l:'二级'},{v:'3',l:'三级'}] },
        { key: 'parentId', label: '上级ID' },
      ],
      onSubmit(data) {
        if (data.parentId && data.parentId === data.name) { toast('禁止循环绑定'); return; }
        S.commit((db) => {
          db.agents.push({ id: S.uid('ag'), name: data.name, level: Number(data.level), parentId: data.parentId, status: 'pending', createdAt: S.now(), sales: 0, commission: 0 });
        }, { actor: actor().name, role: actor().role, module: '代理', action: '创建', detail: data.name });
        toast('已创建，待审核');
        render();
      },
    });
    document.querySelectorAll('[data-id]').forEach((btn) => {
      btn.onclick = () => {
        const row = S.db().agents.find((a) => a.id === btn.dataset.id);
        openForm({
          title: '代理状态',
          fields: [{ key: 'status', label: '状态', type: 'select', options: [{v:'on',l:'启用'},{v:'off',l:'停用'},{v:'pending',l:'待审核'}] }],
          value: row,
          onSubmit(data) {
            S.commit((db) => { db.agents.find((a) => a.id === row.id).status = data.status; },
              { actor: actor().name, role: actor().role, module: '代理', action: '启停', detail: `${row.id} ${data.status}` });
            toast('已更新');
            render();
          },
        });
      };
    });
  }

  function renderWithdrawals() {
    const p = paginate(S.db().withdrawals);
    return layout(`<div class="panel"><div class="panel-h"><h2>提现结算</h2></div>
      <div class="table-wrap"><table><thead><tr><th>单号</th><th>代理</th><th>金额</th><th>状态</th><th>时间</th><th>操作</th></tr></thead><tbody>
      ${p.rows.map((w)=>`<tr>
        <td>${esc(w.id)}</td><td>${esc(w.agentId)}</td><td>¥${w.amount}</td><td>${badge(w.status === 'paid' ? 'paid' : w.status)}</td>
        <td>${esc(w.createdAt)}</td>
        <td>${w.status==='pending' ? `<button class="btn btn-primary" data-pay="${esc(w.id)}">打款</button><button class="btn" data-rej="${esc(w.id)}">驳回</button>` : '-'}</td>
      </tr>`).join('')}
      </tbody></table></div>${pagerHtml(p)}</div>`);
  }

  function bindWithdrawals() {
    document.querySelectorAll('[data-pay]').forEach((btn) => {
      btn.onclick = async () => {
        if (!(await confirmBox('确认打款？该操作写入结算记录且不可重复入账。'))) return;
        S.commit((db) => {
          const w = db.withdrawals.find((x) => x.id === btn.dataset.pay);
          if (w.status === 'paid') return;
          w.status = 'paid';
        }, { actor: actor().name, role: actor().role, module: '提现', action: '打款', detail: btn.dataset.pay });
        toast('已打款');
        render();
      };
    });
    document.querySelectorAll('[data-rej]').forEach((btn) => {
      btn.onclick = () => {
        S.commit((db) => { db.withdrawals.find((x) => x.id === btn.dataset.rej).status = 'rejected'; },
          { actor: actor().name, role: actor().role, module: '提现', action: '驳回', detail: btn.dataset.rej });
        toast('已驳回');
        render();
      };
    });
  }

  function metricPage(title, rows) {
    return layout(`<div class="panel"><div class="panel-h"><h2>${esc(title)}</h2></div>
      <div class="kpis">${rows.map((r)=>`<div class="kpi"><div class="label">${esc(r.l)}</div><div class="value">${esc(r.v)}</div><div class="sub">${esc(r.s || '')}</div></div>`).join('')}</div>
      <div class="chart-line"><i style="width:${rows[0] && rows[0].w || 64}%"></i></div>
    </div>`);
  }

  function renderLogs() {
    const p = paginate(S.db().logs);
    return layout(`<div class="panel"><div class="panel-h"><h2>操作日志</h2></div>
      <div class="table-wrap"><table><thead><tr><th>时间</th><th>操作者</th><th>角色</th><th>模块</th><th>动作</th><th>详情</th></tr></thead><tbody>
      ${p.rows.map((l)=>`<tr><td>${esc(l.createdAt)}</td><td>${esc(l.actor)}</td><td>${esc(l.role)}</td><td>${esc(l.module)}</td><td>${esc(l.action)}</td><td>${esc(l.detail)}</td></tr>`).join('')}
      </tbody></table></div>${pagerHtml(p)}</div>`);
  }

  function bannerFields(row) {
    return [
      { key: 'title', label: '标题' },
      { key: 'slot', label: '位置', type: 'select', options: BANNER_SLOTS },
      { key: 'jumpType', label: '跳转类型', type: 'select', options: JUMP_TYPES },
      { key: 'jumpId', label: '跳转目标（作品ID或站内路径）' },
      { key: 'sort', label: '排序', type: 'number' },
      { key: 'start', label: '开始日期' },
      { key: 'end', label: '结束日期' },
      { key: 'imageFile', label: 'Banner 图', type: 'file', span: 2, accept: 'image/jpeg,image/png,image/webp,image/gif',
        hint: '对应首页轮播或侧栏充值广告图',
        preview: row.image ? `<div class="file-preview">${mediaImg(row.image, 'cover-lg')}</div>` : '' },
    ];
  }

  function saveBanner(row, data) {
    const upload = data.imageFile instanceof Blob ? S.saveImage(data.imageFile, { maxW: 1600, quality: 0.86 }) : Promise.resolve('');
    return upload.then((image) => {
      const payload = {
        title: data.title,
        slot: data.slot || 'home',
        jumpType: data.jumpType || 'url',
        jumpId: String(data.jumpId || '').trim(),
        sort: Number(data.sort || 0),
        start: data.start || '',
        end: data.end || '',
        status: row.status || 'on',
      };
      if (image) payload.image = image;
      else if (row.image) payload.image = row.image;
      else payload.image = '../assets/1.webp';
      return payload;
    });
  }

  function renderBanners() {
    const rows = (S.db().banners || []).slice().sort((a, b) => (a.sort || 0) - (b.sort || 0));
    return layout(opsHint('对应前台首页轮播（6 张一组）与侧栏充值广告。', '../index.html') +
      simpleTable('首页 / 侧栏 Banner', '新增 Banner', [
        { label: '图', render: (r) => mediaImg(r.image, 'thumb') },
        { key: 'title', label: '标题' },
        { label: '位置', render: (r) => esc((BANNER_SLOTS.find((s) => s.v === r.slot) || { l: r.slot || '首页' }).l) },
        { label: '跳转', render: (r) => esc((JUMP_TYPES.find((s) => s.v === r.jumpType) || { l: r.jumpType }).l) },
        { key: 'jumpId', label: '目标' },
        { key: 'sort', label: '排序' },
        { label: '状态', render: (r) => badge(r.status) },
      ], rows, true, true, (r) => `<a class="btn" href="${esc(jumpHref(r.jumpType, r.jumpId))}" target="_blank">预览</a>`));
  }

  function bindBanners() {
    bindSimple(() => openForm({
      title: '新增 Banner',
      fields: bannerFields({}),
      value: { slot: 'home', jumpType: 'url', sort: (S.db().banners || []).length + 1, start: S.now().slice(0, 10), end: '2026-12-31' },
      onSubmit(data) {
        return saveBanner({}, data).then((payload) => {
          S.commit((db) => { db.banners.unshift(Object.assign({ id: S.uid('bn') }, payload, { createdAt: S.now() })); },
            { actor: actor().name, role: actor().role, module: 'Banner', action: '新增', detail: payload.title });
          toast('已新增');
          render();
        });
      },
    }), (id) => {
      const row = S.db().banners.find((x) => x.id === id);
      openForm({
        title: '编辑 Banner',
        fields: bannerFields(row || {}),
        value: row,
        onSubmit(data) {
          return saveBanner(row, data).then((payload) => {
            S.commit((db) => Object.assign(db.banners.find((x) => x.id === id), payload),
              { actor: actor().name, role: actor().role, module: 'Banner', action: '编辑', detail: id });
            toast('已保存');
            render();
          });
        },
      });
    });
  }

  function recSlotOpts() {
    return Object.keys(SLOT_LABELS).map((v) => ({ v, l: SLOT_LABELS[v] }));
  }

  function renderRecommends() {
    const rows = (S.db().recommends || []).slice().sort((a, b) => String(a.slot).localeCompare(String(b.slot)) || (a.sort || 0) - (b.sort || 0));
    return layout(opsHint('对应首页「漫画排行 / 小说排行 / 动画排行 / 其他推荐」卡片位。', '../index.html') +
      simpleTable('首页推荐位', '新增推荐', [
        { label: '作品', render: (r) => esc(comicName(r.workId || r.comicId)) },
        { label: '频道', render: (r) => esc((KINDS[r.kind] || KINDS.comic).module) },
        { label: '位置', render: (r) => esc(SLOT_LABELS[r.slot] || r.slot) },
        { key: 'reason', label: '运营语' },
        { key: 'sort', label: '排序' },
        { label: '状态', render: (r) => badge(r.status) },
      ], rows, true, true));
  }

  function bindRecommends() {
    const fields = [
      { key: 'workKey', label: '作品', type: 'select', options: workOpts() },
      { key: 'slot', label: '首页位置', type: 'select', options: recSlotOpts() },
      { key: 'reason', label: '运营语' },
      { key: 'sort', label: '排序', type: 'number' },
    ];
    bindSimple(() => openForm({
      title: '新增推荐',
      fields,
      value: { slot: 'rank-manga', sort: 1 },
      onSubmit(data) {
        const w = parseWorkKey(data.workKey);
        S.commit((db) => {
          db.recommends.unshift({
            id: S.uid('rc'), kind: w.kind, workId: w.id, comicId: w.id,
            slot: data.slot, reason: data.reason, sort: Number(data.sort || 0),
            status: 'on', start: S.now().slice(0, 10), end: '2026-12-31',
          });
        }, { actor: actor().name, role: actor().role, module: '推荐位', action: '新增', detail: w.id });
        toast('已新增');
        render();
      },
    }), (id) => {
      const row = S.db().recommends.find((x) => x.id === id);
      openForm({
        title: '编辑推荐',
        fields,
        value: Object.assign({}, row, { workKey: (row.kind || 'comic') + ':' + (row.workId || row.comicId) }),
        onSubmit(data) {
          const w = parseWorkKey(data.workKey);
          S.commit((db) => {
            const item = db.recommends.find((x) => x.id === id);
            item.kind = w.kind; item.workId = w.id; item.comicId = w.id;
            item.slot = data.slot; item.reason = data.reason; item.sort = Number(data.sort || 0);
          }, { actor: actor().name, role: actor().role, module: '推荐位', action: '编辑', detail: id });
          toast('已保存');
          render();
        },
      });
    });
  }

  function renderRanking() {
    const kind = hashQuery().get('kind') || 'comic';
    const tab = RANK_TABS.find((t) => t.id === kind) || RANK_TABS[0];
    const cfg = KINDS[tab.id];
    const rows = (S.db()[cfg.list] || []).slice().sort((a, b) => {
      if (!!b.recommend !== !!a.recommend) return b.recommend ? 1 : -1;
      return (b.views || 0) - (a.views || 0);
    });
    const tabs = `<div class="channel-tabs">${RANK_TABS.map((t) =>
      `<a class="btn ${t.id === tab.id ? 'btn-primary' : ''}" href="#/ranking?kind=${t.id}">${esc(t.name)}</a>`
    ).join('')}<a class="btn" href="${esc(tab.preview)}" target="_blank">预览排行页</a></div>`;
    return layout(opsHint(`对应前台 ${tab.name} 排行（周/月/季/年）。阅读量来自作品数据，推荐加权会置顶。`, tab.preview) + tabs +
      simpleTable(tab.name + '排行', '', [
        { label: '封面', render: (r) => mediaImg(r.cover || r.thumb, 'thumb') },
        { key: 'title', label: '作品' },
        { key: 'views', label: '阅读/播放' },
        { key: 'likes', label: '点赞' },
        { label: 'VIP', render: (r) => badge(r.vip) },
        { label: '置顶', render: (r) => r.recommend ? badge('on') : '-' },
      ], rows, false, false, (r) =>
        `<button class="btn" data-pin="${esc(r.id)}" data-kind="${esc(tab.id)}">${r.recommend ? '取消置顶' : '置顶推荐'}</button>
         <a class="btn" href="${esc(cfg.preview(r.id))}" target="_blank">作品</a>`));
  }

  function bindRanking() {
    document.querySelectorAll('[data-pin]').forEach((btn) => {
      btn.onclick = () => {
        const kind = btn.dataset.kind;
        const id = btn.dataset.pin;
        const cfg = KINDS[kind];
        S.commit((db) => {
          const item = db[cfg.list].find((x) => x.id === id);
          if (item) item.recommend = !item.recommend;
        }, { actor: actor().name, role: actor().role, module: '排行榜', action: '置顶', detail: id });
        toast('已更新置顶');
        render();
      };
    });
  }

  function renderExclusive() {
    const rows = allWorks().filter((w) => w.exclusive);
    return layout(opsHint('对应作品详情 Exclusive / 独播角标。可在作品编辑里开关，也可在此按频道筛选。', '../manga.html') +
      simpleTable('独播作品', '', [
        { label: '频道', render: (r) => esc(r.kindLabel) },
        { label: '封面', render: (r) => mediaImg(r.cover || r.thumb, 'thumb') },
        { key: 'title', label: '作品' },
        { key: 'views', label: '热度' },
        { label: '状态', render: (r) => badge(r.publishStatus) },
      ], rows, false, false, (r) =>
        `<button class="btn" data-off-ex="${esc(r.id)}" data-kind="${esc(r.kind)}">取消独播</button>
         <a class="btn" href="${esc(r.preview)}" target="_blank">预览</a>`));
  }

  function bindExclusive() {
    document.querySelectorAll('[data-off-ex]').forEach((btn) => {
      btn.onclick = () => {
        const cfg = KINDS[btn.dataset.kind];
        S.commit((db) => {
          const item = db[cfg.list].find((x) => x.id === btn.dataset.offEx);
          if (item) item.exclusive = false;
        }, { actor: actor().name, role: actor().role, module: '独播', action: '取消', detail: btn.dataset.offEx });
        toast('已取消独播');
        render();
      };
    });
  }

  function renderFreezone() {
    const rows = allWorks().filter((w) => w.vip === 'free');
    return layout(opsHint('对应漫画 / 小说 / 动画频道的「免费」筛选与卡片资费角标。', '../manga.html') +
      simpleTable('免费专区（三频道）', '', [
        { label: '频道', render: (r) => esc(r.kindLabel) },
        { label: '封面', render: (r) => mediaImg(r.cover || r.thumb, 'thumb') },
        { key: 'title', label: '作品' },
        { label: '资费', render: (r) => badge(r.vip) },
        { label: '状态', render: (r) => badge(r.publishStatus) },
      ], rows, false, false, (r) =>
        `<button class="btn" data-vip="${esc(r.id)}" data-kind="${esc(r.kind)}">改为部分VIP</button>
         <a class="btn" href="${esc(r.preview)}" target="_blank">预览</a>`));
  }

  function bindFreezone() {
    document.querySelectorAll('[data-vip]').forEach((btn) => {
      btn.onclick = () => {
        const cfg = KINDS[btn.dataset.kind];
        S.commit((db) => {
          const item = db[cfg.list].find((x) => x.id === btn.dataset.vip);
          if (item) item.vip = 'partial';
        }, { actor: actor().name, role: actor().role, module: '免费专区', action: '改资费', detail: btn.dataset.vip });
        toast('已改为部分 VIP');
        render();
      };
    });
  }

  function renderSearchOps() {
    const hots = (S.db().searchHots || []).slice().sort((a, b) => (a.sort || 0) - (b.sort || 0));
    const kws = (S.db().searchKeywords || []).slice().sort((a, b) => (a.sort || 0) - (b.sort || 0));
    const hotTable = `<div class="panel"><div class="panel-h"><h2>搜索热搜</h2>
      <div class="toolbar"><button class="btn btn-primary" id="addHot">新增热搜</button></div></div>
      <div class="table-wrap"><table><thead><tr><th>#</th><th>关键词</th><th>状态</th><th>操作</th></tr></thead><tbody>
      ${hots.map((r) => `<tr><td>${esc(r.sort)}</td><td>${esc(r.name)}</td><td>${badge(r.status)}</td>
        <td class="row-actions"><button class="btn" data-edit-hot="${esc(r.id)}">编辑</button></td></tr>`).join('')
        || '<tr><td class="empty" colspan="4">暂无数据</td></tr>'}
      </tbody></table></div></div>`;
    const kwTable = `<div class="panel"><div class="panel-h"><h2>热门关键词标签</h2>
      <div class="toolbar"><button class="btn btn-primary" id="addKw">新增标签</button></div></div>
      <div class="table-wrap"><table><thead><tr><th>#</th><th>标签</th><th>跳转</th><th>状态</th><th>操作</th></tr></thead><tbody>
      ${kws.map((r) => `<tr><td>${esc(r.sort)}</td><td>#${esc(r.name)}</td><td>${esc(r.href || '#')}</td><td>${badge(r.status)}</td>
        <td class="row-actions"><button class="btn" data-edit-kw="${esc(r.id)}">编辑</button></td></tr>`).join('')
        || '<tr><td class="empty" colspan="5">暂无数据</td></tr>'}
      </tbody></table></div></div>`;
    return layout(opsHint('对应页头搜索面板：热搜排行 1–10 与 #热门关键词。', '../index.html') + hotTable + kwTable);
  }

  function bindSearchOps() {
    const hotFields = [
      { key: 'name', label: '关键词' },
      { key: 'sort', label: '排序', type: 'number' },
      { key: 'status', label: '状态', type: 'select', options: [{ v: 'on', l: '启用' }, { v: 'off', l: '停用' }] },
    ];
    const kwFields = hotFields.concat([{ key: 'href', label: '跳转（如 anime.html / manga.html）' }]);
    const addHot = document.getElementById('addHot');
    if (addHot) addHot.onclick = () => openForm({
      title: '新增热搜',
      fields: hotFields,
      value: { sort: (S.db().searchHots || []).length + 1, status: 'on' },
      onSubmit(data) {
        S.commit((db) => { db.searchHots.unshift(Object.assign({ id: S.uid('sh') }, data, { sort: Number(data.sort || 0) })); },
          { actor: actor().name, role: actor().role, module: '搜索热词', action: '新增热搜', detail: data.name });
        toast('已新增');
        render();
      },
    });
    const addKw = document.getElementById('addKw');
    if (addKw) addKw.onclick = () => openForm({
      title: '新增关键词',
      fields: kwFields,
      value: { sort: (S.db().searchKeywords || []).length + 1, status: 'on', href: 'manga.html' },
      onSubmit(data) {
        S.commit((db) => { db.searchKeywords.unshift(Object.assign({ id: S.uid('sk') }, data, { sort: Number(data.sort || 0) })); },
          { actor: actor().name, role: actor().role, module: '搜索热词', action: '新增标签', detail: data.name });
        toast('已新增');
        render();
      },
    });
    document.querySelectorAll('[data-edit-hot]').forEach((btn) => {
      btn.onclick = () => {
        const row = S.db().searchHots.find((x) => x.id === btn.dataset.editHot);
        openForm({
          title: '编辑热搜',
          fields: hotFields,
          value: row,
          onSubmit(data) {
            S.commit((db) => Object.assign(db.searchHots.find((x) => x.id === row.id), data, { sort: Number(data.sort || 0) }),
              { actor: actor().name, role: actor().role, module: '搜索热词', action: '编辑热搜', detail: row.id });
            toast('已保存');
            render();
          },
        });
      };
    });
    document.querySelectorAll('[data-edit-kw]').forEach((btn) => {
      btn.onclick = () => {
        const row = S.db().searchKeywords.find((x) => x.id === btn.dataset.editKw);
        openForm({
          title: '编辑关键词',
          fields: kwFields,
          value: row,
          onSubmit(data) {
            S.commit((db) => Object.assign(db.searchKeywords.find((x) => x.id === row.id), data, { sort: Number(data.sort || 0) }),
              { actor: actor().name, role: actor().role, module: '搜索热词', action: '编辑标签', detail: row.id });
            toast('已保存');
            render();
          },
        });
      };
    });
  }

  function renderNews() {
    const rows = (S.db().news || []).slice();
    return layout(opsHint('对应前台「最新消息」列表与详情。', '../news.html') +
      simpleTable('最新消息', '发布消息', [
        { key: 'date', label: '日期' },
        { key: 'tag', label: '标签' },
        { key: 'title', label: '标题' },
        { label: '状态', render: (r) => badge(r.status) },
      ], rows, true, true, (r) => `<a class="btn" href="../news.html#${esc(r.id)}" target="_blank">预览</a>`));
  }

  function bindNews() {
    const fields = [
      { key: 'date', label: '展示日期（如 2026.10.20）' },
      { key: 'tag', label: '标签' },
      { key: 'tagType', label: '标签类型', type: 'select', options: [{ v: 'event', l: '活动' }, { v: 'update', l: '更新' }, { v: 'notice', l: '公告' }] },
      { key: 'status', label: '状态', type: 'select', options: [{ v: 'on', l: '发布' }, { v: 'off', l: '下线' }] },
      { key: 'title', label: '中文标题', span: 2 },
      { key: 'titleEn', label: '英文标题', span: 2 },
      { key: 'titlePt', label: '葡语标题', span: 2 },
      { key: 'body', label: '正文', type: 'textarea', rows: 8, span: 2 },
    ];
    bindSimple(() => openForm({
      title: '发布消息',
      fields,
      value: { date: S.now().slice(0, 10).replace(/-/g, '.'), tag: '公告', tagType: 'notice', status: 'on' },
      onSubmit(data) {
        S.commit((db) => { db.news.unshift(Object.assign({ id: S.uid('news') }, data, { createdAt: S.now() })); },
          { actor: actor().name, role: actor().role, module: '最新消息', action: '发布', detail: data.title });
        toast('已发布');
        render();
      },
    }), (id) => {
      const row = S.db().news.find((x) => x.id === id);
      openForm({
        title: '编辑消息',
        fields,
        value: row,
        onSubmit(data) {
          S.commit((db) => Object.assign(db.news.find((x) => x.id === id), data),
            { actor: actor().name, role: actor().role, module: '最新消息', action: '编辑', detail: id });
          toast('已保存');
          render();
        },
      });
    });
  }

  function renderFaq() {
    const rows = (S.db().faq || []).slice().sort((a, b) => (a.sort || 0) - (b.sort || 0));
    return layout(opsHint('对应前台 FAQ 页。', '../faq.html') +
      simpleTable('常见问题', '新增问题', [
        { key: 'sort', label: '序号' },
        { key: 'tag', label: '分类' },
        { key: 'title', label: '问题' },
        { label: '状态', render: (r) => badge(r.status) },
      ], rows, true, true));
  }

  function bindFaq() {
    const fields = [
      { key: 'sort', label: '序号', type: 'number' },
      { key: 'tag', label: '分类' },
      { key: 'status', label: '状态', type: 'select', options: [{ v: 'on', l: '发布' }, { v: 'off', l: '下线' }] },
      { key: 'title', label: '问题', span: 2 },
      { key: 'body', label: '解答', type: 'textarea', rows: 6, span: 2 },
    ];
    bindSimple(() => openForm({
      title: '新增问题',
      fields,
      value: { sort: (S.db().faq || []).length + 1, tag: 'VIP', status: 'on' },
      onSubmit(data) {
        S.commit((db) => { db.faq.unshift(Object.assign({ id: S.uid('faq') }, data, { sort: Number(data.sort || 0) })); },
          { actor: actor().name, role: actor().role, module: 'FAQ', action: '新增', detail: data.title });
        toast('已新增');
        render();
      },
    }), (id) => {
      const row = S.db().faq.find((x) => x.id === id);
      openForm({
        title: '编辑问题',
        fields,
        value: row,
        onSubmit(data) {
          S.commit((db) => Object.assign(db.faq.find((x) => x.id === id), data, { sort: Number(data.sort || 0) }),
            { actor: actor().name, role: actor().role, module: 'FAQ', action: '编辑', detail: id });
          toast('已保存');
          render();
        },
      });
    });
  }

  function render() {
    closeModal();
    const page = hashPage();
    if (page === 'login' || !S.session()) { renderLogin(); return; }
    const perm = pagePerm(page);
    if (!S.can(perm) && page !== 'dashboard') { root.innerHTML = deny(); bindChrome(); return; }

    const d = S.db();
    const pages = {
      dashboard: renderDashboard,
      comics: () => renderWorks('comic'),
      chapters: () => renderUnits('comic'),
      novels: () => renderWorks('novel'),
      'novel-chapters': () => renderUnits('novel'),
      anime: () => renderWorks('anime'),
      episodes: () => renderUnits('anime'),
      'comic-authors': () => renderKindAuthors('comic'),
      'comic-categories': () => renderKindCategories('comic'),
      'comic-tags': () => renderKindTags('comic'),
      'comic-review': () => renderReview('comic'),
      'novel-authors': () => renderKindAuthors('novel'),
      'novel-categories': () => renderKindCategories('novel'),
      'novel-tags': () => renderKindTags('novel'),
      'novel-review': () => renderReview('novel'),
      'anime-authors': () => renderKindAuthors('anime'),
      'anime-categories': () => renderKindCategories('anime'),
      'anime-tags': () => renderKindTags('anime'),
      'anime-review': () => renderReview('anime'),
      users: () => renderUsers(false),
      'vip-users': () => renderUsers(true),
      orders: renderOrders,
      refunds: renderRefunds,
      agents: renderAgents,
      withdrawals: renderWithdrawals,
      logs: renderLogs,
      banners: renderBanners,
      recommends: renderRecommends,
      ranking: renderRanking,
      exclusive: renderExclusive,
      freezone: renderFreezone,
      'search-ops': renderSearchOps,
      campaigns: () => layout(simpleTable('活动专区 / 营销活动', '新增活动', [
        { key: 'name', label: '名称' }, { key: 'type', label: '类型' }, { key: 'rule', label: '规则' }, { key: 'budget', label: '预算' }, { key: 'used', label: '已用' }, { label: '状态', render: (r) => badge(r.status) },
      ], d.campaigns)),
      campaigns2: () => layout(simpleTable('活动专区 / 营销活动', '新增活动', [
        { key: 'name', label: '名称' }, { key: 'type', label: '类型' }, { key: 'rule', label: '规则' }, { key: 'budget', label: '预算' }, { key: 'used', label: '已用' }, { label: '状态', render: (r) => badge(r.status) },
      ], d.campaigns)),
      behavior: () => layout(simpleTable('用户行为', '', [
        { label: '用户', render: (r) => esc(userName(r.userId) || r.userId) }, { key: 'comicId', label: '作品' }, { key: 'content', label: '行为' }, { key: 'createdAt', label: '时间' },
      ], d.comments.map((c) => Object.assign({}, c, { content: '评论/阅读' })))),
      logins: () => layout(simpleTable('登录记录', '', [
        { key: 'username', label: '账号' }, { key: 'ip', label: 'IP' }, { key: 'result', label: '结果' }, { key: 'createdAt', label: '时间' },
      ], d.loginLogs.concat(S.db().users.map((u) => ({ id: u.id, username: u.email, ip: 'dynamic', result: '成功', createdAt: u.lastLogin }))))),
      blacklist: () => layout(simpleTable('黑名单', '新增标记', [
        { key: 'type', label: '类型' }, { key: 'value', label: '对象' }, { key: 'reason', label: '原因' }, { key: 'createdAt', label: '时间' },
      ], d.blacklist)),
      feedback: () => layout(simpleTable('反馈', '', [
        { label: '用户', render: (r) => esc(userName(r.userId)) }, { key: 'type', label: '类型' }, { key: 'content', label: '内容' }, { label: '状态', render: (r) => badge(r.status) },
      ], d.feedback)),
      plans: () => layout(simpleTable('VIP 套餐', '新增套餐', [
        { key: 'name', label: '名称' }, { key: 'price', label: '售价' }, { key: 'origin', label: '原价' }, { key: 'days', label: '天数' }, { label: '权益', render: (r) => esc((r.perks||[]).join(' / ')) }, { label: '状态', render: (r) => badge(r.status) },
      ], d.plans)),
      products: () => layout(simpleTable('商品', '新增商品', [
        { key: 'name', label: '名称' }, { key: 'type', label: '类型' }, { key: 'price', label: '价格' }, { label: '状态', render: (r) => badge(r.status) },
      ], d.products)),
      perks: () => layout(simpleTable('权益配置', '', [
        { key: 'name', label: '套餐' }, { label: '权益', render: (r) => esc((r.perks||[]).join('、')) },
      ], d.plans)),
      coupons: () => layout(simpleTable('优惠券', '新增优惠券', [
        { key: 'name', label: '名称' }, { key: 'type', label: '类型' }, { key: 'value', label: '面值' }, { key: 'min', label: '门槛' }, { key: 'stock', label: '发行量' }, { key: 'used', label: '已用' }, { label: '状态', render: (r) => badge(r.status) },
      ], d.coupons)),
      payments: () => layout(simpleTable('支付流水', '', [
        { key: 'id', label: '订单号' }, { key: 'channel', label: '渠道' }, { key: 'channelNo', label: '渠道单号' }, { key: 'amount', label: '金额' }, { label: '状态', render: (r) => badge(r.status) }, { key: 'paidAt', label: '回调时间' },
      ], d.orders)),
      finance: () => metricPage('财务报表', [
        { l: 'GMV', v: '¥' + d.orders.reduce((s, o) => s + o.amount, 0), s: '含待支付' },
        { l: '已支付', v: '¥' + d.orders.filter((o) => o.status === 'success').reduce((s, o) => s + o.amount, 0), s: 'ARPU 计算中' },
        { l: '退款中', v: d.refunds.length, s: '不删除原单' },
        { l: '渠道数', v: new Set(d.orders.map((o) => o.channel)).size, s: 'stripe / paypal / pix' },
      ]),
      comments: () => layout(simpleTable('评论审核', '', [
        { label: '用户', render: (r) => esc(userName(r.userId)) }, { label: '作品', render: (r) => esc(comicName(r.comicId)) }, { key: 'content', label: '内容' }, { label: '状态', render: (r) => badge(r.status) },
      ], d.comments, null, true)),
      reports: () => layout(simpleTable('举报', '', [
        { key: 'type', label: '类型' }, { key: 'target', label: '对象' }, { key: 'evidence', label: '证据' }, { label: '状态', render: (r) => badge(r.status) },
      ], d.reports)),
      words: () => layout(simpleTable('敏感词', '新增词', [
        { key: 'word', label: '词' }, { key: 'action', label: '动作' }, { label: '状态', render: (r) => badge(r.status) },
      ], d.words)),
      channels: () => layout(simpleTable('渠道', '', [
        { key: 'name', label: '渠道' }, { key: 'clicks', label: '点击' }, { key: 'regs', label: '注册' }, { key: 'pays', label: '付费' }, { key: 'revenue', label: '收入' }, { label: '状态', render: (r) => badge(r.status) },
      ], d.channels)),
      commission: () => layout(simpleTable('佣金规则（版本化）', '新增规则', [
        { key: 'level', label: '层级' }, { key: 'ratio', label: '比例%' }, { key: 'product', label: '商品' }, { key: 'version', label: '版本' }, { key: 'start', label: '生效' }, { label: '状态', render: (r) => badge(r.status) },
      ], d.rules)),
      'stats-users': () => metricPage('用户数据', [
        { l: '注册', v: d.users.length, s: '今日 +86' }, { l: 'DAU / MAU', v: '12.4K / 48K', s: '留存 D1 32%' }, { l: '付费转化', v: '4.8%', s: 'VIP ' + d.users.filter((u)=>u.vip).length }, { l: '来源 TOP', v: 'Google', s: '代理其次' },
      ]),
      'stats-content': () => metricPage('内容数据', [
        { l: '阅读/播放', v: (d.comics.reduce((s,c)=>s+c.views,0) + (d.novels||[]).reduce((s,c)=>s+c.views,0) + (d.anime||[]).reduce((s,c)=>s+(c.views||0),0)).toLocaleString(), s: `漫画 ${d.comics.length} · 小说 ${(d.novels||[]).length} · 动画 ${(d.anime||[]).length}` }, { l: '收藏/点赞', v: d.comics.reduce((s,c)=>s+c.likes,0).toLocaleString() }, { l: '评论', v: d.comments.length }, { l: '在架作品', v: d.comics.filter((c)=>c.publishStatus==='published').length + (d.novels||[]).filter((c)=>c.publishStatus==='published').length + (d.anime||[]).filter((c)=>c.publishStatus==='published').length },
      ]),
      'stats-revenue': () => metricPage('收入数据', [
        { l: 'GMV', v: '¥' + d.orders.reduce((s,o)=>s+o.amount,0) }, { l: '付费人数', v: new Set(d.orders.filter((o)=>o.status==='success').map((o)=>o.userId)).size }, { l: 'ARPPU', v: '¥96' }, { l: '退款', v: d.refunds.length },
      ]),
      'stats-vip': () => metricPage('VIP 数据', [
        { l: '新增 VIP', v: d.users.filter((u)=>u.vip).length, s: '续费 2' }, { l: '即将到期', v: '3' }, { l: '流失', v: '1' }, { l: '年卡占比', v: '28%' },
      ]),
      'stats-channel': () => metricPage('渠道数据', [
        { l: '点击', v: d.channels.reduce((s,c)=>s+c.clicks,0).toLocaleString() }, { l: '注册', v: d.channels.reduce((s,c)=>s+c.regs,0) }, { l: '收入', v: '¥' + d.channels.reduce((s,c)=>s+c.revenue,0) }, { l: '佣金', v: '¥' + d.agents.reduce((s,a)=>s+a.commission,0) },
      ]),
      notices: () => layout(opsHint('对应首页公告滚动条。标题会展示在站点顶部。', '../index.html') + simpleTable('首页公告条', '发布公告', [
        { key: 'title', label: '公告文案' }, { key: 'link', label: '跳转' }, { label: '状态', render: (r) => badge(r.status) }, { key: 'createdAt', label: '时间' },
      ], d.notices)),
      news: renderNews,
      faq: renderFaq,
      messages: () => layout(simpleTable('站内信', '发送', [
        { label: '用户', render: (r) => esc(userName(r.userId)) }, { key: 'title', label: '标题' }, { key: 'body', label: '内容' }, { key: 'status', label: '状态' },
      ], d.messages)),
      templates: () => layout(simpleTable('消息模板', '', [
        { key: 'name', label: '名称' }, { key: 'channel', label: '渠道' }, { key: 'body', label: '模板' },
      ], d.templates)),
      admins: () => layout(simpleTable('管理员', '', [
        { key: 'username', label: '账号' }, { key: 'name', label: '姓名' }, { label: '角色', render: (r) => esc(S.ROLES[r.role].name) }, { label: '状态', render: (r) => badge(r.status) },
      ], d.admins)),
      roles: () => layout(simpleTable('角色权限', '', [
        { key: 'id', label: '角色' }, { label: '名称', render: (r) => esc(r.name) }, { label: '权限', render: (r) => esc(r.perms.join('、')) },
      ], Object.keys(S.ROLES).map((id) => ({ id, name: S.ROLES[id].name, perms: S.ROLES[id].perms })))),
      settings: () => layout(`<div class="panel"><h2>系统参数 / 多语言</h2>
        <div class="form-grid" style="margin-top:14px">
          <div class="field"><label>站点名</label><input value="${esc(d.settings.siteName)}"></div>
          <div class="field"><label>默认语言</label><input value="${esc(d.settings.langDefault)}"></div>
          <div class="field"><label>内容语言</label><input value="${esc(d.settings.langs)}"></div>
          <div class="field"><label>上传上限 MB</label><input value="${esc(d.settings.fileMaxMb)}"></div>
          <div class="field"><label>视频上限 MB</label><input value="${esc(d.settings.videoMaxMb || 300)}"></div>
          <div class="field span-2"><label>CDN / 对象存储</label><input value="${esc(d.settings.cdn)}"></div>
        </div>
        <div class="modal-actions"><button class="btn btn-primary" id="saveSet">保存参数</button></div></div>`),
      monitor: () => layout(`<div class="kpis">
        <div class="kpi"><div class="label">API</div><div class="value">正常</div><div class="sub">延迟 42ms</div></div>
        <div class="kpi"><div class="label">支付回调</div><div class="value">1 告警</div><div class="sub down">PIX 失败率</div></div>
        <div class="kpi"><div class="label">对象存储</div><div class="value">正常</div><div class="sub">仅存 object_key</div></div>
        <div class="kpi"><div class="label">登录限流</div><div class="value">开启</div><div class="sub">5 次 / 30s</div></div>
      </div><div class="panel"><h3>异常</h3><ul class="feed">${d.alerts.map((a)=>`<li><span>${esc(a.level)} · ${esc(a.source)} · ${esc(a.message)}</span><span class="t">${esc(a.createdAt)}</span></li>`).join('')}</ul></div>`),
    };

    const view = pages[page] || renderDashboard;
    root.innerHTML = view();
    bindChrome();
    if (page === 'comics') bindWorks('comic');
    if (page === 'chapters') bindUnits('comic');
    if (page === 'novels') bindWorks('novel');
    if (page === 'novel-chapters') bindUnits('novel');
    if (page === 'anime') bindWorks('anime');
    if (page === 'episodes') bindUnits('anime');
    const metaPage = String(page).match(/^(comic|novel|anime)-(authors|categories|tags|review)$/);
    if (metaPage) {
      if (metaPage[2] === 'review') bindReview();
      else bindKindMeta(metaPage[1], metaPage[2]);
    }
    if (page === 'users' || page === 'vip-users') bindUsers();
    if (page === 'refunds') bindRefunds();
    if (page === 'agents') bindAgents();
    if (page === 'withdrawals') bindWithdrawals();
    if (page === 'settings') {
      const btn = document.getElementById('saveSet');
      if (btn) btn.onclick = () => { log('系统', '保存参数', 'settings'); toast('参数已保存'); };
    }

    if (page === 'banners') bindBanners();
    if (page === 'recommends') bindRecommends();
    if (page === 'ranking') bindRanking();
    if (page === 'exclusive') bindExclusive();
    if (page === 'freezone') bindFreezone();
    if (page === 'search-ops') bindSearchOps();
    if (page === 'news') bindNews();
    if (page === 'faq') bindFaq();

    const crud = {
      plans: { list: 'plans', title: '套餐', fields: [{ key: 'name', label: '名称' }, { key: 'price', label: '售价', type: 'number' }, { key: 'origin', label: '原价', type: 'number' }, { key: 'days', label: '天数', type: 'number' }] },
      coupons: { list: 'coupons', title: '优惠券', fields: [{ key: 'name', label: '名称' }, { key: 'value', label: '面值', type: 'number' }, { key: 'stock', label: '发行量', type: 'number' }] },
      campaigns: { list: 'campaigns', title: '活动', fields: [{ key: 'name', label: '名称' }, { key: 'type', label: '类型' }, { key: 'rule', label: '规则', span: 2 }] },
      campaigns2: { list: 'campaigns', title: '活动', fields: [{ key: 'name', label: '名称' }, { key: 'type', label: '类型' }, { key: 'rule', label: '规则', span: 2 }] },
      words: { list: 'words', title: '敏感词', fields: [{ key: 'word', label: '词' }, { key: 'action', label: '动作' }] },
      notices: { list: 'notices', title: '公告', fields: [{ key: 'title', label: '公告文案' }, { key: 'link', label: '跳转（如 news.html）' }, { key: 'body', label: '备注', type: 'textarea', span: 2 }] },
      blacklist: { list: 'blacklist', title: '黑名单', fields: [{ key: 'type', label: '类型' }, { key: 'value', label: '对象' }, { key: 'reason', label: '原因', span: 2 }] },
      commission: { list: 'rules', title: '佣金规则', fields: [{ key: 'level', label: '层级', type: 'number' }, { key: 'ratio', label: '比例', type: 'number' }, { key: 'version', label: '版本', type: 'number' }] },
    };
    if (crud[page]) {
      const cfg = crud[page];
      bindSimple(() => openForm({
        title: '新增' + cfg.title,
        fields: cfg.fields,
        onSubmit(data) {
          S.commit((db) => { db[cfg.list].unshift(Object.assign({ id: S.uid('x'), status: 'on', createdAt: S.now() }, data)); },
            { actor: actor().name, role: actor().role, module: cfg.title, action: '新增', detail: data.name || data.title || data.word || '' });
          toast('已新增');
          render();
        },
      }), (id) => {
        const row = S.db()[cfg.list].find((x) => x.id === id);
        openForm({
          title: '编辑' + cfg.title,
          fields: cfg.fields,
          value: row,
          onSubmit(data) {
            S.commit((db) => Object.assign(db[cfg.list].find((x) => x.id === id), data),
              { actor: actor().name, role: actor().role, module: cfg.title, action: '编辑', detail: id });
            toast('已保存');
            render();
          },
        });
      });
    }

    if (page === 'comments') {
      document.querySelectorAll('[data-id]').forEach((btn) => {
        btn.onclick = () => openForm({
          title: '评论处理',
          fields: [{ key: 'status', label: '状态', type: 'select', options: [{v:'approved',l:'通过'},{v:'hidden',l:'隐藏'},{v:'pending',l:'待审核'}] }],
          value: S.db().comments.find((c) => c.id === btn.dataset.id),
          onSubmit(data) {
            S.commit((db) => { db.comments.find((c) => c.id === btn.dataset.id).status = data.status; },
              { actor: actor().name, role: actor().role, module: '评论', action: '审核', detail: btn.dataset.id });
            toast('已处理');
            render();
          },
        });
      });
    }
    hydrateAssets(root);
  }

  window.addEventListener('hashchange', () => { pageIndex = 1; render(); });
  render();
})();
