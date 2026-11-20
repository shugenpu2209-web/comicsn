(function (global) {
  'use strict';

  const VIP_EXPIRE_KEY = 'comicsn-vip-expire';
  const NSFW_KEY = 'comicsn-nsfw';
  const LANG_KEY = 'comicsn-lang';
  const PLAY_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';

  function currentLang() {
    if (window.ComicsI18n && typeof window.ComicsI18n.getLang === 'function') {
      return window.ComicsI18n.getLang();
    }
    const stored = localStorage.getItem(LANG_KEY);
    return stored === 'en' || stored === 'pt' ? stored : 'zh';
  }

  const COPY = {
    zh: {
      exclusive: '独播',
      updatedOn: '更新于',
      members: '会员',
      membership: '会员资格',
      bookmark: '收藏',
      continueRead: '开通 VIP 继续阅读',
      backToWork: '返回作品页',
      prevEp: '上一集',
      nextEpBtn: '下一集',
      prevCh: '上一章',
      nextChBtn: '下一章',
      pickEp: '选集',
      readerSettings: '阅读设置',
      panelWidth: '画面宽度',
      widthNarrow: '紧凑',
      widthRegular: '标准',
      widthWide: '宽屏',
      brightness: '亮度',
      fontSize: '字体大小',
      fontSm: '小',
      fontMd: '中',
      fontLg: '大',
      bgTheme: '背景',
      themeNight: '夜间',
      themePaper: '护眼',
      themeDay: '日间',
      latestEp: '已是最新一集',
      latestCh: '已是最新一章',
      readNextEp: '阅读下一集',
      readNextCh: '阅读下一章',
      nextEp: '下一集：',
      nextCh: '下一章：',
      epDone: '第{n}集 完',
      chDone: '第{n}章 完',
      goVip: '前往充值',
      tabFree: '免费',
      toc: '目录',
      close: '关闭',
      lockFromCh: '第{n}章起为 VIP 专属，开通后可继续阅读',
    },
    en: {
      exclusive: 'Exclusive',
      updatedOn: 'Updated',
      members: 'Members',
      membership: 'Membership',
      bookmark: 'Bookmark',
      continueRead: 'Go VIP to keep reading',
      backToWork: 'Back to title',
      prevEp: 'Previous',
      nextEpBtn: 'Next',
      prevCh: 'Previous',
      nextChBtn: 'Next',
      pickEp: 'Episodes',
      readerSettings: 'Reading settings',
      panelWidth: 'Width',
      widthNarrow: 'Compact',
      widthRegular: 'Standard',
      widthWide: 'Wide',
      brightness: 'Brightness',
      fontSize: 'Font size',
      fontSm: 'S',
      fontMd: 'M',
      fontLg: 'L',
      bgTheme: 'Background',
      themeNight: 'Night',
      themePaper: 'Paper',
      themeDay: 'Day',
      latestEp: "You're on the latest episode",
      latestCh: "You're on the latest chapter",
      readNextEp: 'Read next episode',
      readNextCh: 'Read next chapter',
      nextEp: 'Next: ',
      nextCh: 'Next: ',
      epDone: 'Episode {n} end',
      chDone: 'Chapter {n} end',
      goVip: 'Get VIP',
      tabFree: 'Free',
      toc: 'Contents',
      close: 'Close',
      lockFromCh: 'Chapter {n} and later are VIP only. Subscribe to keep reading.',
    },
    pt: {
      exclusive: 'Exclusivo',
      updatedOn: 'Atualizado',
      members: 'Membros',
      membership: 'Assinatura',
      bookmark: 'Favoritar',
      continueRead: 'Assine o VIP para continuar lendo',
      backToWork: 'Voltar ao título',
      prevEp: 'Anterior',
      nextEpBtn: 'Próximo',
      prevCh: 'Anterior',
      nextChBtn: 'Próximo',
      pickEp: 'Episódios',
      readerSettings: 'Ajustes de leitura',
      panelWidth: 'Largura',
      widthNarrow: 'Compacto',
      widthRegular: 'Padrão',
      widthWide: 'Amplo',
      brightness: 'Brilho',
      fontSize: 'Tamanho da fonte',
      fontSm: 'P',
      fontMd: 'M',
      fontLg: 'G',
      bgTheme: 'Fundo',
      themeNight: 'Noite',
      themePaper: 'Papel',
      themeDay: 'Dia',
      latestEp: 'Este é o episódio mais recente',
      latestCh: 'Este é o capítulo mais recente',
      readNextEp: 'Ler próximo episódio',
      readNextCh: 'Ler próximo capítulo',
      nextEp: 'Próximo: ',
      nextCh: 'Próximo: ',
      epDone: 'Fim do ep. {n}',
      chDone: 'Fim do cap. {n}',
      goVip: 'Assinar VIP',
      tabFree: 'Grátis',
      toc: 'Índice',
      close: 'Fechar',
      lockFromCh: 'O capítulo {n} em diante é VIP. Assine para continuar lendo.',
    },
  };

  function t(key, fallback) {
    if (window.ComicsI18n && typeof window.ComicsI18n.t === 'function') {
      const val = window.ComicsI18n.t(key);
      if (val) return val;
    }
    const pack = COPY[currentLang()] || COPY.zh;
    if (pack[key] != null) return pack[key];
    return fallback != null ? fallback : key;
  }

  function parseViews(views) {
    const match = String(views).match(/^([\d.]+)(K)?$/);
    if (!match) return 0;
    return parseFloat(match[1]) * (match[2] ? 1000 : 1);
  }

  function hasVip() {
    const stamp = localStorage.getItem(VIP_EXPIRE_KEY);
    if (!stamp) return false;
    const parts = stamp.split('.').map(Number);
    if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return false;
    return new Date(parts[0], parts[1] - 1, parts[2], 23, 59, 59).getTime() >= Date.now();
  }

  function canRead(item) {
    return !!(item && (item.free || hasVip()));
  }

  function bindSortMenu({ wrap, btn, label, options, labels, fallbackKey, onChange }) {
    if (!wrap || !btn || !label || !options || !options.length) return;

    function setOpen(open) {
      wrap.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    }

    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      setOpen(!wrap.classList.contains('is-open'));
    });

    options.forEach((option) => {
      option.addEventListener('click', () => {
        const key = option.dataset.sort || fallbackKey;
        label.textContent = option.textContent.trim() || labels[key] || labels[fallbackKey];
        options.forEach((item) => item.classList.toggle('is-active', item === option));
        setOpen(false);
        onChange(key);
      });
    });

    document.addEventListener('click', () => setOpen(false));
  }

  function bindGroup(selector, attr, state, stateKey, render, onSelect) {
    const buttons = document.querySelectorAll(selector);
    if (!buttons.length) return;
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        state[stateKey] = btn.dataset[attr] || buttons[0].dataset[attr];
        buttons.forEach((item) => {
          item.classList.toggle('is-active', item === btn);
          item.setAttribute('aria-selected', String(item === btn));
        });
        if (typeof onSelect === 'function') onSelect(state[stateKey], btn);
        if (typeof render === 'function') render();
      });
    });
  }

  function bindShareButton(btn, title) {
    if (!btn) return;
    btn.addEventListener('click', async () => {
      const url = window.location.href;
      const name = typeof title === 'function' ? title() : (title || document.title);
      try {
        if (navigator.share) await navigator.share({ title: name, url });
        else if (navigator.clipboard) await navigator.clipboard.writeText(url);
      } catch (err) { /* cancelled */ }
    });
  }

  const LIKE_HEART = '<svg class="category-like-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';

  function workCardHtml(item, href, options) {
    options = options || {};
    const title = localizedTitle(item);
    const thumb = options.thumb || coverOf(item, options.list);
    const newBadge = item.isNew ? '<span class="category-new-badge">NEW</span>' : '';
    const vipBadge = item.free ? '' : '<span class="manga-vip-badge">VIP</span>';
    const hotIcon = item.hot ? badgeUpHtml() : '';
    const tags = options.tags || [];
    const tagsHtml = tags.length
      ? `<p class="novel-related-tags">${tags.map((tag) => `<span class="novel-related-tag">#${escapeHtml(tag)}</span>`).join('')}</p>`
      : '';
    return `
        <a href="${href}" class="category-card">
          <div class="category-thumb">
            <img src="${thumb}" alt="${escapeHtml(title)}" loading="lazy">
            ${newBadge}
            ${vipBadge}
          </div>
          <div class="category-title-row">
            <h3 class="category-title">${escapeHtml(title)}</h3>
            ${hotIcon}
          </div>
          <p class="category-meta">
            <span class="likes">${LIKE_HEART}${escapeHtml(item.likes || '0')}</span>
            <span class="dot">·</span>
            <span class="views"><img src="${BADGE_VIEW}" alt="">${escapeHtml(item.views)}</span>
          </p>
          ${tagsHtml}
        </a>
      `;
  }

  const CHAPTER_SORT_ASC = '<svg class="novel-chapter-sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 19V5" stroke-linecap="round"/><path d="M6 11l6-6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const CHAPTER_SORT_DESC = '<svg class="novel-chapter-sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14" stroke-linecap="round"/><path d="M6 13l6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function bindChapterList({ pageSize, latestSize, getItems, renderItems }) {
    let tab = new URLSearchParams(window.location.search).get('tab') === 'toc' ? 'toc' : 'latest';
    let tocAsc = true;
    let rangeIndex = 0;

    function items() {
      return getItems() || [];
    }

    function rangeCount() {
      return Math.max(1, Math.ceil(items().length / pageSize));
    }

    function syncTabButtons() {
      document.querySelectorAll('.novel-chapter-tab').forEach((item) => {
        const on = item.dataset.tab === tab;
        item.classList.toggle('is-active', on);
        item.setAttribute('aria-selected', String(on));
      });
    }

    function renderRanges() {
      const rangesEl = document.getElementById('novelChapterRanges');
      if (!rangesEl) return;
      const total = items().length;
      const pages = rangeCount();
      rangesEl.innerHTML = Array.from({ length: pages }, (_, i) => {
        const start = i * pageSize + 1;
        const end = Math.min(start + pageSize - 1, total);
        const on = i === rangeIndex;
        return `<button type="button" class="novel-chapter-range${on ? ' is-active' : ''}" data-range="${i}" aria-pressed="${on}">${start}-${end}</button>`;
      }).join('');
    }

    function syncTocControls() {
      const toolbar = document.getElementById('novelChapterToolbar');
      const sortBtn = document.getElementById('novelChapterSort');
      const onToc = tab === 'toc';
      if (toolbar) toolbar.hidden = !onToc;
      if (sortBtn) {
        sortBtn.innerHTML = `${tocAsc ? CHAPTER_SORT_ASC : CHAPTER_SORT_DESC}<span>${tocAsc ? t('sortAsc', '正序') : t('sortDesc', '倒序')}</span>`;
        sortBtn.setAttribute(
          'aria-label',
          tocAsc ? t('sortAscAria', '当前正序，点击切换倒序') : t('sortDescAria', '当前倒序，点击切换正序')
        );
      }
      if (onToc) renderRanges();
    }

    function visibleItems() {
      const all = items();
      if (tab !== 'toc') return all.slice().reverse().slice(0, latestSize);
      const start = rangeIndex * pageSize;
      const slice = all.slice(start, start + pageSize);
      return tocAsc ? slice : slice.slice().reverse();
    }

    function render() {
      syncTabButtons();
      syncTocControls();
      if (typeof renderItems === 'function') renderItems(visibleItems());
    }

    const chapterTabs = document.querySelector('.novel-chapter-tabs');
    if (chapterTabs) {
      chapterTabs.addEventListener('click', (event) => {
        const next = event.target.closest('.novel-chapter-tab');
        if (!next || !chapterTabs.contains(next)) return;
        tab = next.dataset.tab || 'latest';
        if (tab === 'toc') {
          tocAsc = true;
          rangeIndex = 0;
        }
        render();
      });
    }

    const sortBtn = document.getElementById('novelChapterSort');
    if (sortBtn) {
      sortBtn.addEventListener('click', () => {
        tocAsc = !tocAsc;
        rangeIndex = tocAsc ? 0 : rangeCount() - 1;
        render();
      });
    }

    const rangesEl = document.getElementById('novelChapterRanges');
    if (rangesEl) {
      rangesEl.addEventListener('click', (event) => {
        const btn = event.target.closest('.novel-chapter-range');
        if (!btn || !rangesEl.contains(btn)) return;
        rangeIndex = Number(btn.dataset.range) || 0;
        render();
      });
    }

    return { render };
  }

  function findById(list, id, fallbackId) {
    if (!list || !list.length) return null;
    return list.find((item) => item.id === id)
      || (fallbackId ? list.find((item) => item.id === fallbackId) : null)
      || list[0];
  }

  function crumbTagOf(item, prefer, emptyKey, emptyFallback) {
    const cats = (item && item.categories) || [];
    const key = (prefer && cats.includes(prefer)) ? prefer : (cats[0] || '');
    if (!key) return { key: '', label: t(emptyKey, emptyFallback) };
    return { key, label: `#${catLabel(key)}` };
  }

  function fillWorkDetailShell(item, opts) {
    opts = opts || {};
    const locTitle = localizedTitle(item);
    const cover = opts.cover || coverOf(item, opts.list);
    const tags = opts.tags || [];
    document.title = `${locTitle} - COMICSN`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', `${locTitle} - ${item.author || 'COMICSN'}${opts.metaSuffix || ''}`);
    }
    const coverWrap = document.getElementById('novelCover');
    if (coverWrap) {
      coverWrap.innerHTML = `
        <img class="novel-cover-bg" src="${cover}" alt="" aria-hidden="true">
        <img class="novel-cover-art" src="${cover}" alt="${escapeHtml(locTitle)}">
        <span class="novel-cover-status${item.status === 'ended' ? ' is-ended' : ''}">${escapeHtml(statusLabel(item))}</span>
      `;
    }
    const badges = document.getElementById('novelBadges');
    if (badges) {
      const parts = [];
      if (item.exclusive) parts.push(`<span class="novel-badge novel-badge-exclusive">${t('exclusive', '独播')}</span>`);
      if (item.hot) parts.push('<span class="novel-badge novel-badge-hot">HOT</span>');
      badges.innerHTML = parts.join('');
      badges.hidden = !parts.length;
    }
    const titleEl = document.getElementById('novelTitle');
    if (titleEl) titleEl.textContent = locTitle;
    const crumbCat = document.getElementById('novelCrumbCat');
    if (crumbCat) {
      crumbCat.textContent = opts.crumbLabel || '';
      if (opts.crumbHref) crumbCat.href = opts.crumbHref;
    }
    const crumbTitle = document.getElementById('novelCrumbTitle');
    if (crumbTitle) crumbTitle.textContent = locTitle;
    const authorEl = document.getElementById('novelAuthor');
    if (authorEl) authorEl.textContent = localizedPhrase(item.author || 'COMICSN');
    const publishedEl = document.getElementById('novelPublished');
    if (publishedEl) publishedEl.textContent = `${t('published', '发布时间')}: ${publishedOf(item)}`;
    const likeBtn = document.getElementById('comicLikeBtn');
    if (likeBtn) likeBtn.dataset.id = item.id;
    const viewsEl = document.getElementById('novelViewCount');
    if (viewsEl) viewsEl.textContent = item.views;
    const detailsEl = document.getElementById('novelDetails');
    if (detailsEl && opts.details != null) detailsEl.textContent = opts.details;
    const keywordsEl = document.getElementById('novelKeywords');
    if (keywordsEl) {
      keywordsEl.innerHTML = tags.map((tag) => `<span class="novel-keyword">#${escapeHtml(tag)}</span>`).join('');
    }
    const readBtn = document.getElementById('novelReadBtn');
    if (readBtn && opts.readHref) {
      readBtn.href = opts.readHref;
      if (opts.readLabel) readBtn.textContent = opts.readLabel;
    }
  }

  function renderRelatedWorks(el, list, currentId, hrefOf, options) {
    options = options || {};
    if (!el) return;
    el.innerHTML = (list || []).filter((item) => item.id !== currentId).slice(0, 9).map((item) => (
      workCardHtml(item, hrefOf(item), {
        list: options.list || list,
        tags: typeof options.tagsOf === 'function' ? options.tagsOf(item) : (options.tags || []),
      })
    )).join('');
  }

  function bindWorkDetailPage(item, kind, opts) {
    opts = opts || {};
    const chapters = bindChapterList({
      pageSize: opts.pageSize || 10,
      latestSize: 3,
      getItems: opts.getChapters,
      renderItems: opts.renderChapters,
    });
    bindShareButton(document.getElementById('novelShareBtn'), () => localizedTitle(item));
    bindLikeButton(document.getElementById('comicLikeBtn'), kind, item.id, {
      countEl: document.getElementById('comicLikeCount'),
      baseCount: opts.baseLikes || 0,
    });
    bindBookmarkButton(document.getElementById('novelBookmarkBtn'), kind, item.id);
    function paint() {
      if (typeof opts.render === 'function') opts.render();
      if (chapters) chapters.render();
    }
    paint();
    window.addEventListener('comicsn:langchange', paint);
    return chapters;
  }

  const THUMBS = [
      'assets/comics/thumb-1.webp',
      'assets/comics/thumb-2.webp',
      'assets/comics/thumb-3.webp',
      'assets/comics/thumb-4.webp',
      'assets/comics/thumb-5.webp',
      'assets/comics/thumb-6.webp',
  ];
  function badgeUpHtml() {
    return '<span class="badge-up" aria-hidden="true">H</span>';
  }
  const BADGE_VIEW = 'assets/icons/ico_view.png';
  const CAT_LABELS_I18N = {
    school: { zh: '校园', en: 'School', pt: 'Escola' },
    bl: { zh: '耽美', en: 'BL', pt: 'BL' },
    fantasy: { zh: '奇幻', en: 'Fantasy', pt: 'Fantasia' },
    romance: { zh: '浪漫', en: 'Romance', pt: 'Romance' },
    action: { zh: '动作', en: 'Action', pt: 'Ação' },
    'sci-fi': { zh: '科幻', en: 'Sci-fi', pt: 'Ficção' },
    comedy: { zh: '喜剧', en: 'Comedy', pt: 'Comédia' },
    slice: { zh: '生活', en: 'Slice of life', pt: 'Cotidiano' },
  };
  const EXTRA_BY_CAT = {
    romance: ['甜宠', '都市'],
    slice: ['日常', '治愈'],
    fantasy: ['穿越', '冒险'],
    school: ['青春', '成长'],
    action: ['热血', '战斗'],
    'sci-fi': ['未来', '冒险'],
    comedy: ['轻松', '搞笑'],
    bl: ['暗恋', '年下'],
  };
  const SORT_LABELS = {
    popularity: '按人气排序',
    views: '浏览量最高',
    latest: '最新',
  };
  const NOVEL_CHAPTER_TITLES = {
    'night-store': ['关店铃', '多找的一块钱', '夜班搭档', '冰箱后的纸条', '雨夜的伞', '告白'],
    'villain-love': ['重生第一天', '反派人设崩了', '不该心动', '宫廷夜宴', '秘密同盟', '我也喜欢你'],
    'campus-xianxia': ['入学测试', '功法残页', '同门切磋', '禁地一夜', '灵气暴动', '心法初成'],
  };
  const NOVEL_CHAPTER_TITLES_BY_N = {
    'villain-love': { 112: '恶魔的邪恶手段' },
  };
  const NOVEL_GENERIC_CHAPTERS = ['序章', '意外的相遇', '靠近', '误会', '转折', '心意'];

  function novelChapterCount(item) {
    const match = String((item && item.ep) || '').match(/(\d+)/);
    const named = NOVEL_CHAPTER_TITLES[item && item.id] || NOVEL_GENERIC_CHAPTERS;
    return Math.max(match ? parseInt(match[1], 10) : named.length, named.length, 1);
  }

  function novelChapterTitle(item, n) {
    const named = NOVEL_CHAPTER_TITLES[item && item.id] || NOVEL_GENERIC_CHAPTERS;
    const byN = NOVEL_CHAPTER_TITLES_BY_N[item && item.id] || {};
    return byN[n] || named[n - 1] || '';
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/"/g, '&quot;');
  }

  function pad2(n) {
    return String(n).padStart(2, '0');
  }

  function catLabel(key) {
    const pack = CAT_LABELS_I18N[key];
    if (!pack) return key;
    return pack[currentLang()] || pack.zh;
  }

  const TITLE_I18N = {
    evolution: { en: 'Evolution: Road to Space Monster', pt: 'Evolução: Caminho até o Monstro Espacial' },
    bully: { en: "Bully's Love Story", pt: 'História de Amor do Valentão' },
    muscle: { en: 'Muscle Girls Colosseum', pt: 'Coliseu das Garotas Musculosas' },
    angel: { en: 'Angel and Devil', pt: 'Anjo e Demônio' },
    witch: { en: "The Witch's Child", pt: 'A Criança da Bruxa' },
    magical: { en: 'Magical Girl Chronicles ABC', pt: 'Crônicas da Garota Mágica ABC' },
    'too-much': { en: "She's Too Much for Me", pt: 'Ela É Demais para Mim' },
    drawing: { en: 'Drawing Romance', pt: 'Romance em Desenho' },
    mom: { en: "I'm a Mom", pt: 'Eu Sou Mãe' },
    vengeance: { en: 'Vengeance', pt: 'Vingança' },
    classmate: { en: 'In the Same Class With My Childhood Friend and My Ex-girlfriend', pt: 'Na Mesma Classe que Minha Amiga de Infância e Minha Ex' },
    asteroid: { en: 'The Day an Asteroid Fell Into School', pt: 'O Dia em que um Asteroide Caiu na Escola' },
    starry: { en: 'Starry Walk in the Dark', pt: 'Caminhada Estrelada no Escuro' },
    'white-hole': { en: 'White Hole', pt: 'Buraco Branco' },
    zombie: { en: 'Newlywed Zombies', pt: 'Zumbis Recém-Casados' },
    yurong: { en: 'My Little Wooreongi', pt: 'Meu Pequeno Wooreongi' },
    'no-hero': { en: "I Don't Want to Be a Hero!", pt: 'Eu Não Quero Ser Herói!' },
    hunter: { en: 'Dokkaebi Hunter', pt: 'Caçador de Dokkaebi' },
    drink: { en: "Let's Have a Drink!", pt: 'Vamos Beber!' },
    'boy-world': { en: 'Schoolboy vs The World', pt: 'Garoto da Escola vs o Mundo' },
    apocalypse: { en: 'Apocalypse Stories', pt: 'Histórias do Apocalipse' },
    'fantasy-tale': { en: 'Fantasy Legend', pt: 'Lenda de Fantasia' },
    growth: { en: 'Coming of Age', pt: 'Amadurecer' },
    'space-return': { en: 'Space Monster Returns', pt: 'O Monstro Espacial Retorna' },
    'secret-class': { en: 'Secret Class Restart', pt: 'Aula Secreta: Reinício' },
    'love-letter': { en: 'The Wrong Love Letter', pt: 'A Carta de Amor Errada' },
    maid: { en: 'The Exhausted Maid Is Here!', pt: 'A Empregada Exausta Chegou!' },
    neighbor: { en: 'Dear Neighbor', pt: 'Querida Vizinha' },
    concrete: { en: 'Concrete Jungle', pt: 'Selva de Concreto' },
    robot: { en: "If You're a Robot, Show Yourself", pt: 'Se Você É um Robô, Mostre-se' },
    romance: { en: 'Drawing Romance', pt: 'Romance em Desenho' },
    school: { en: 'In the Same Class With My Childhood Friend and My Ex-girlfriend', pt: 'Na Mesma Classe que Minha Amiga de Infância e Minha Ex' },
    'night-store': { en: 'Confession at the Midnight Store', pt: 'Confissão na Loja da Meia-Noite' },
    'villain-love': { en: 'Even as the Villain, I Still Fall in Love', pt: 'Mesmo Sendo a Vilã, Eu Me Apaixono' },
    'campus-xianxia': { en: 'Campus Cultivation Log', pt: 'Diário de Cultivo no Campus' },
    'ceo-standin': { en: "The CEO's Stand-in Lover", pt: 'A Amante Substituta do CEO' },
    'last-garden': { en: 'The Last Garden', pt: 'O Último Jardim' },
    'roommate-rules': { en: 'Roommate Rules: Not Cute', pt: 'Regras de Colega: Não É Fofa' },
    'starlight-her': { en: 'She Walked Out of the Starlight', pt: 'Ela Saiu da Luz das Estrelas' },
    'library-reader': { en: 'The Secret Reader in the Library', pt: 'A Leitora Secreta da Biblioteca' },
    'inn-rebirth': { en: 'Reborn: I Opened an Inn in Jianghu', pt: 'Renascida: Abri uma Pousada no Jianghu' },
    'cat-next-door': { en: 'The Cat Next Door and You', pt: 'O Gato do Lado e Você' },
    'last-swordsman': { en: "The Empire's Last Swordsman", pt: 'O Último Espadachim do Império' },
    'rain-mystery': { en: 'Rainy Night Mystery Club', pt: 'Clube de Mistério da Noite Chuvosa' },
    'contract-marriage': { en: 'Sign Here for a Contract Marriage', pt: 'Assine Aqui para um Casamento por Contrato' },
    'magic-fail': { en: 'Failing Student at the Magic Academy', pt: 'Aluna Reprovada na Academia de Magia' },
    'villain-moonlight': { en: "Transmigrated as the Villain's White Moonlight", pt: 'Transmigrada como o Luar Branco do Vilão' },
    'sea-lighthouse': { en: 'Sea Breeze and the Lighthouse', pt: 'Brisa do Mar e o Farol' },
    'fake-workplace': { en: 'Workplace Survival Guide (Not Really)', pt: 'Guia de Sobrevivência no Trabalho (Mentira)' },
    'dragon-days': { en: '100 Days Living with a Dragon', pt: '100 Dias Vivendo com um Dragão' },
    'time-bookstore': { en: 'The Time Traveler in the Used Bookstore', pt: 'O Viajante do Tempo na Sebo' },
    'alley-heartbeat': { en: 'Heartbeat in the Dark Alley', pt: 'Batida do Coração no Beco Escuro' },
    'after-masquerade': { en: 'After the Masquerade', pt: 'Depois do Baile de Máscaras' },
    'star-postman': { en: 'Interstellar Postman', pt: 'Carteiro Interestelar' },
    'winter-onsen': { en: 'Winter Hot-Spring Inn', pt: 'Pousada de Fontes Termais de Inverno' },
    'god-off-duty': { en: 'Gods, Please Clock Out', pt: 'Deuses, Por Favor Batam o Ponto' },
    'silent-pianist': { en: 'The Silent Pianist', pt: 'O Pianista Silencioso' },
    'city-south': { en: 'Tales of the South City, Continued', pt: 'Contos da Cidade do Sul, Continuação' },
    'no-gravity': { en: "If There's No Gravity Tomorrow", pt: 'Se Amanhã Não Houver Gravidade' },
    'villain-tea': { en: 'Villain Alliance Tea Party', pt: 'Chá da Aliança dos Vilões' },
    'martial-boy': { en: "The Martial Boy Who Doesn't Want to Try", pt: 'O Garoto Marcial que Não Quer Tentar' },
    'fox-deskmate': { en: 'My Deskmate Is a Little Fox', pt: 'Minha Colega de Carteira É uma Raposinha' },
  };

  const PHRASE_I18N = {
    校园: { en: 'School', pt: 'Escola' },
    耽美: { en: 'BL', pt: 'BL' },
    奇幻: { en: 'Fantasy', pt: 'Fantasia' },
    浪漫: { en: 'Romance', pt: 'Romance' },
    动作: { en: 'Action', pt: 'Ação' },
    科幻: { en: 'Sci-fi', pt: 'Ficção' },
    喜剧: { en: 'Comedy', pt: 'Comédia' },
    生活: { en: 'Slice of life', pt: 'Cotidiano' },
    剧情: { en: 'Drama', pt: 'Drama' },
    恐怖: { en: 'Horror', pt: 'Terror' },
    甜宠: { en: 'Sweet romance', pt: 'Romance doce' },
    都市: { en: 'Urban', pt: 'Urbano' },
    日常: { en: 'Daily life', pt: 'Cotidiano' },
    治愈: { en: 'Healing', pt: 'Cura' },
    穿越: { en: 'Isekai', pt: 'Isekai' },
    冒险: { en: 'Adventure', pt: 'Aventura' },
    青春: { en: 'Youth', pt: 'Juventude' },
    成长: { en: 'Coming of age', pt: 'Amadurecer' },
    热血: { en: 'Hot-blooded', pt: 'Sangue quente' },
    战斗: { en: 'Battle', pt: 'Batalha' },
    未来: { en: 'Future', pt: 'Futuro' },
    轻松: { en: 'Light', pt: 'Leve' },
    搞笑: { en: 'Funny', pt: 'Engraçado' },
    暗恋: { en: 'Secret crush', pt: 'Paixão secreta' },
    年下: { en: 'Younger', pt: 'Mais novo' },
    连载: { en: 'Serial', pt: 'Em série' },
    原创: { en: 'Original', pt: 'Original' },
    欢喜: { en: 'Joy', pt: 'Alegria' },
    进化: { en: 'Evolution', pt: 'Evolução' },
    竞技: { en: 'Arena', pt: 'Arena' },
    对立: { en: 'Rivals', pt: 'Rivais' },
    宫斗: { en: 'Palace intrigue', pt: 'Intriga palaciana' },
    修仙: { en: 'Cultivation', pt: 'Cultivo' },
    豪门: { en: 'Wealthy family', pt: 'Alta sociedade' },
    末世: { en: 'Apocalypse', pt: 'Apocalipse' },
    生存: { en: 'Survival', pt: 'Sobrevivência' },
    同居: { en: 'Roommates', pt: 'Colegas de casa' },
    悬疑: { en: 'Mystery', pt: 'Mistério' },
    重生: { en: 'Rebirth', pt: 'Renascimento' },
    江湖: { en: 'Jianghu', pt: 'Jianghu' },
    初次相遇: { en: 'First meeting', pt: 'Primeiro encontro' },
    意外的约定: { en: 'Unexpected promise', pt: 'Promessa inesperada' },
    食堂风波: { en: 'Cafeteria trouble', pt: 'Confusão no refeitório' },
    秘密基地: { en: 'Secret base', pt: 'Base secreta' },
    雨天的告白: { en: 'Rainy-day confession', pt: 'Confissão na chuva' },
    新的开始: { en: 'A new start', pt: 'Um novo começo' },
    觉醒: { en: 'Awakening', pt: 'Despertar' },
    第一次进化: { en: 'First evolution', pt: 'Primeira evolução' },
    太空裂隙: { en: 'Space rift', pt: 'Fenda espacial' },
    怪兽来袭: { en: 'Monster attack', pt: 'Ataque do monstro' },
    同伴: { en: 'Companions', pt: 'Companheiros' },
    新世界: { en: 'New world', pt: 'Novo mundo' },
    入场: { en: 'Entrance', pt: 'Entrada' },
    试炼: { en: 'Trial', pt: 'Prova' },
    女巫之力: { en: "Witch's power", pt: 'Poder da bruxa' },
    竞技场: { en: 'Colosseum', pt: 'Coliseu' },
    反转: { en: 'Twist', pt: 'Reviravolta' },
    冠军之路: { en: 'Road to the title', pt: 'Caminho do título' },
    序幕: { en: 'Prologue', pt: 'Prólogo' },
    序章: { en: 'Prologue', pt: 'Prólogo' },
    靠近: { en: 'Closer', pt: 'Mais perto' },
    误会: { en: 'Misunderstanding', pt: 'Mal-entendido' },
    转折: { en: 'Turning point', pt: 'Virada' },
    心意: { en: 'True feelings', pt: 'Sentimentos' },
    关店铃: { en: 'Closing bell', pt: 'Sino de fechar' },
    多找的一块钱: { en: 'The extra yuan', pt: 'O troco a mais' },
    夜班搭档: { en: 'Night-shift partner', pt: 'Parceiro do turno da noite' },
    冰箱后的纸条: { en: 'Note behind the fridge', pt: 'Bilhete atrás da geladeira' },
    雨夜的伞: { en: 'Umbrella on a rainy night', pt: 'Guarda-chuva na chuva' },
    告白: { en: 'Confession', pt: 'Confissão' },
    重生第一天: { en: 'Reborn: day one', pt: 'Renascida: dia um' },
    反派人设崩了: { en: 'Villain persona cracked', pt: 'A vilã saiu do papel' },
    不该心动: { en: "I shouldn't fall", pt: 'Não deveria me apaixonar' },
    宫廷夜宴: { en: 'Palace banquet', pt: 'Banquete no palácio' },
    秘密同盟: { en: 'Secret alliance', pt: 'Aliança secreta' },
    我也喜欢你: { en: 'I like you too', pt: 'Eu também gosto de você' },
    入学测试: { en: 'Entrance test', pt: 'Teste de admissão' },
    功法残页: { en: 'Torn technique page', pt: 'Página rasgada da técnica' },
    同门切磋: { en: 'Sparring with peers', pt: 'Treino entre colegas' },
    禁地一夜: { en: 'A night in the forbidden land', pt: 'Uma noite na terra proibida' },
    灵气暴动: { en: 'Spirit surge', pt: 'Surto de energia' },
    心法初成: { en: 'First technique', pt: 'Primeira técnica' },
    恶魔的邪恶手段: { en: "The devil's methods", pt: 'Os métodos do demônio' },
    优丸: { en: 'Youwan', pt: 'Youwan' },
    学姐: { en: 'Senpai', pt: 'Senpai' },
    同学: { en: 'Classmate', pt: 'Colega' },
    意外的相遇: { en: 'Unexpected meeting', pt: 'Encontro inesperado' },
    韩宇: { en: 'Han Yu', pt: 'Han Yu' },
    南风: { en: 'Nanfeng', pt: 'Nanfeng' },
    白夜: { en: 'Baiye', pt: 'Baiye' },
    林深: { en: 'Lin Shen', pt: 'Lin Shen' },
    顾清: { en: 'Gu Qing', pt: 'Gu Qing' },
    沈星: { en: 'Shen Xing', pt: 'Shen Xing' },
    叶舟: { en: 'Ye Zhou', pt: 'Ye Zhou' },
    陈川: { en: 'Chen Chuan', pt: 'Chen Chuan' },
    苏晚: { en: 'Su Wan', pt: 'Su Wan' },
    江北: { en: 'Jiang Bei', pt: 'Jiang Bei' },
    白鹿: { en: 'Bai Lu', pt: 'Bai Lu' },
    明川: { en: 'Mingchuan', pt: 'Mingchuan' },
    方舟: { en: 'Fang Zhou', pt: 'Fang Zhou' },
    夏至: { en: 'Xiazhi', pt: 'Xiazhi' },
    顾南: { en: 'Gu Nan', pt: 'Gu Nan' },
    林舟: { en: 'Lin Zhou', pt: 'Lin Zhou' },
    沈夜: { en: 'Shen Ye', pt: 'Shen Ye' },
    叶白: { en: 'Ye Bai', pt: 'Ye Bai' },
    陈星: { en: 'Chen Xing', pt: 'Chen Xing' },
    苏川: { en: 'Su Chuan', pt: 'Su Chuan' },
    江晚: { en: 'Jiang Wan', pt: 'Jiang Wan' },
    白舟: { en: 'Bai Zhou', pt: 'Bai Zhou' },
    明夜: { en: 'Mingye', pt: 'Mingye' },
    方白: { en: 'Fang Bai', pt: 'Fang Bai' },
    夏川: { en: 'Xia Chuan', pt: 'Xia Chuan' },
    顾星: { en: 'Gu Xing', pt: 'Gu Xing' },
    林白: { en: 'Lin Bai', pt: 'Lin Bai' },
    沈川: { en: 'Shen Chuan', pt: 'Shen Chuan' },
    叶晚: { en: 'Ye Wan', pt: 'Ye Wan' },
    林晚星: { en: 'Lin Wanxing', pt: 'Lin Wanxing' },
    江澄舟: { en: 'Jiang Chengzhou', pt: 'Jiang Chengzhou' },
    顾南乔: { en: 'Gu Nanqiao', pt: 'Gu Nanqiao' },
    沈予安: { en: "Shen Yu'an", pt: "Shen Yu'an" },
    叶知秋: { en: 'Ye Zhiqiu', pt: 'Ye Zhiqiu' },
    陈见鹿: { en: 'Chen Jianlu', pt: 'Chen Jianlu' },
    苏晚晴: { en: 'Su Wanqing', pt: 'Su Wanqing' },
    白敬衡: { en: 'Bai Jingheng', pt: 'Bai Jingheng' },
  };

  function pickLang(map, fallback) {
    if (map == null) return fallback != null ? fallback : '';
    if (typeof map === 'string') return map;
    const lang = currentLang();
    if (map[lang] != null) return map[lang];
    if (map.zh != null) return map.zh;
    return fallback != null ? fallback : '';
  }

  const PHRASE_BY_VALUE = {};
  Object.keys(PHRASE_I18N).forEach((zh) => {
    PHRASE_BY_VALUE[zh] = zh;
    const pack = PHRASE_I18N[zh];
    if (pack.en) PHRASE_BY_VALUE[pack.en] = zh;
    if (pack.pt) PHRASE_BY_VALUE[pack.pt] = zh;
  });

  function canonicalPhrase(text) {
    const raw = String(text || '').trim();
    if (!raw) return '';
    return PHRASE_BY_VALUE[raw] || raw;
  }

  function localizedPhrase(text) {
    const zh = canonicalPhrase(text);
    if (!zh) return '';
    const lang = currentLang();
    if (lang === 'zh') return zh;
    const pack = PHRASE_I18N[zh];
    if (!pack) return zh;
    return pack[lang] || zh;
  }

  function localizedTitle(item) {
    if (!item) return '';
    const lang = currentLang();
    const pack = TITLE_I18N[item.id];
    if (pack && pack[lang]) return pack[lang];
    return (pack && pack.zh) || item.title || '';
  }

  function localizedEp(ep, kind) {
    const raw = String(ep || '');
    const match = raw.match(/(\d+)/);
    if (!match) return raw;
    const isChapter = /章/.test(raw) || kind === 'novel';
    return epLabel(match[1], isChapter ? 'novel' : 'comic');
  }

  function epLabel(n, kind) {
    const lang = currentLang();
    if (kind === 'novel') {
      if (lang === 'en') return `Ch.${n}`;
      if (lang === 'pt') return `Cap.${n}`;
      return `第${n}章`;
    }
    if (lang === 'en' || lang === 'pt') return `Ep.${n}`;
    return `第${n}集`;
  }

  function localizedDuration(raw) {
    const text = String(raw || '');
    const min = text.match(/(\d+)\s*分钟/);
    const sec = text.match(/(\d+)\s*秒/);
    const lang = currentLang();
    if (min) return lang === 'zh' ? `${min[1]}分钟` : `${min[1]} min`;
    if (sec) return lang === 'zh' ? `${sec[1]}秒` : (lang === 'pt' ? `${sec[1]} s` : `${sec[1]}s`);
    return text;
  }

  function formatCount(n) {
    if (currentLang() === 'zh' && n >= 10000) {
      const wan = n / 10000;
      return `${wan >= 10 ? Math.round(wan) : wan.toFixed(1).replace(/\.0$/, '')}万`;
    }
    if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
    return String(Math.round(n));
  }

  function coverOf(item, list) {
    const idx = Array.isArray(list) ? list.indexOf(item) : -1;
    return THUMBS[(idx >= 0 ? idx : 0) % THUMBS.length];
  }

  function publishedOf(item) {
    if (item && item.published) return item.published;
    let hash = 0;
    const id = String((item && item.id) || '');
    for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    const year = 2023 + (hash % 3);
    const month = pad2(1 + (hash % 12));
    const day = pad2(1 + (hash % 27));
    const hour = pad2(8 + (hash % 12));
    const min = pad2(hash % 60);
    return `${year}-${month}-${day} ${hour}:${min}`;
  }

  function publishedTime(item) {
    const raw = publishedOf(item).replace(' ', 'T');
    const time = Date.parse(raw);
    return Number.isNaN(time) ? 0 : time;
  }

  function sortCatalogList(list, sortKey) {
    const sorted = [...(list || [])];
    if (sortKey === 'views') {
      sorted.sort((a, b) => parseViews(b.views) - parseViews(a.views));
    } else if (sortKey === 'latest') {
      sorted.sort((a, b) => {
        const newDiff = Number(!!b.isNew) - Number(!!a.isNew);
        if (newDiff) return newDiff;
        return publishedTime(b) - publishedTime(a);
      });
    } else {
      sorted.sort((a, b) => parseViews(b.likes) - parseViews(a.likes));
    }
    return sorted;
  }

  function dateOfIssue(item, n) {
    const published = publishedOf(item);
    const match = published.match(/^(\d{4})-(\d{2})-(\d{2})/);
    const base = match
      ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
      : new Date(2025, 7, 1);
    const date = new Date(base.getTime());
    date.setDate(date.getDate() + (n - 1) * 7);
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
  }

  function extraKeywordsOf(item, cats, extraById) {
    const listed = extraById && extraById[item.id];
    if (listed) return listed.map((tag) => localizedPhrase(tag));
    const pool = [];
    (item.categories || []).forEach((cat) => {
      (EXTRA_BY_CAT[cat] || []).forEach((raw) => {
        const tag = localizedPhrase(raw);
        if (!cats.includes(tag) && !pool.includes(tag)) pool.push(tag);
      });
    });
    [localizedPhrase('连载'), localizedPhrase('原创')].forEach((tag) => {
      if (pool.length < 2 && !cats.includes(tag) && !pool.includes(tag)) pool.push(tag);
    });
    return pool.slice(0, 2);
  }

  function keywordsOf(item, extraById) {
    const cats = (item.categories || []).map((key) => catLabel(key));
    const extras = extraKeywordsOf(item, cats, extraById).filter((tag) => !cats.includes(tag));
    return [...cats, ...extras];
  }

  function statusLabel(item) {
    return item && item.status === 'ended' ? t('tabEnded', '已完结') : t('tabUpdating', '连载中');
  }

  function loadJsonList(key) {
    try {
      const list = JSON.parse(localStorage.getItem(key) || '[]');
      return Array.isArray(list) ? list : [];
    } catch (err) {
      return [];
    }
  }

  function saveJsonList(key, list) {
    localStorage.setItem(key, JSON.stringify(list));
  }

  const HISTORY_KEY = 'comicsn-watch-history';
  const HISTORY_LIMIT = 80;

  function loadHistory() {
    try {
      const list = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      if (!Array.isArray(list)) return [];
      return list.filter((row) => row && row.kind && row.id);
    } catch (err) {
      return [];
    }
  }

  function saveHistory(list) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  }

  function recordHistory(kind, id, ep) {
    if (!kind || !id) return;
    const n = Math.max(1, parseInt(ep, 10) || 1);
    const next = loadHistory().filter((row) => !(row.kind === kind && row.id === id));
    next.unshift({ kind, id, ep: n, at: Date.now() });
    saveHistory(next.slice(0, HISTORY_LIMIT));
  }

  function removeHistory(kind, id) {
    if (!kind || !id) return;
    saveHistory(loadHistory().filter((row) => !(row.kind === kind && row.id === id)));
  }

  function historyHref(kind, id, ep) {
    const n = Math.max(1, parseInt(ep, 10) || 1);
    const q = `id=${encodeURIComponent(id)}&ep=${n}`;
    if (kind === 'novel') return `novel-reader.html?${q}`;
    if (kind === 'anime') return `anime-watch.html?${q}`;
    return `reader.html?${q}`;
  }

  const BOOKMARK_KEYS = {
    comic: 'comicsn-bookmarked-comic',
    novel: 'comicsn-bookmarked-novel',
    anime: 'comicsn-fav-anime',
  };

  function loadBookmarks(kind) {
    return loadJsonList(BOOKMARK_KEYS[kind] || BOOKMARK_KEYS.comic);
  }

  function saveBookmarks(kind, list) {
    saveJsonList(BOOKMARK_KEYS[kind] || BOOKMARK_KEYS.comic, list);
  }

  function isBookmarked(kind, id) {
    return loadBookmarks(kind).includes(id);
  }

  function toggleBookmark(kind, id) {
    const list = loadBookmarks(kind);
    const i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1);
    else list.push(id);
    saveBookmarks(kind, list);
    return i < 0;
  }

  const BOOKMARK_BTN_SELECTOR = '[data-bookmark-kind][data-bookmark-id]';

  function syncBookmarkButton(btn) {
    if (!btn) return;
    const kind = btn.getAttribute('data-bookmark-kind');
    const id = btn.getAttribute('data-bookmark-id');
    if (!kind || !id) return;
    const on = isBookmarked(kind, id);
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', String(on));
  }

  function syncAllBookmarkButtons(root) {
    (root || document).querySelectorAll(BOOKMARK_BTN_SELECTOR).forEach(syncBookmarkButton);
  }

  function bindBookmarkButton(btn, kind, id) {
    if (!btn || !kind || !id) return;
    btn.setAttribute('data-bookmark-kind', kind);
    btn.setAttribute('data-bookmark-id', id);
    btn.setAttribute('aria-label', t('bookmark', '收藏'));
    syncBookmarkButton(btn);
  }

  function pageBookmarkTarget() {
    const file = (location.pathname.split('/').pop() || '').split('?')[0];
    const id = new URLSearchParams(location.search).get('id') || '';
    if (file === 'comic.html' || file === 'reader.html') return { kind: 'comic', id: id || 'bully' };
    if (file === 'novel-detail.html' || file === 'novel-reader.html') return { kind: 'novel', id: id || 'night-store' };
    if (file === 'anime-watch.html') return { kind: 'anime', id: id || 'evolution' };
    return null;
  }

  function initBookmarkButtons() {
    const target = pageBookmarkTarget();
    if (target && target.id) {
      ['novelBookmarkBtn', 'animeFavBtn', 'readerBookmarkBtn'].forEach((eid) => {
        const btn = document.getElementById(eid);
        if (btn) bindBookmarkButton(btn, target.kind, target.id);
      });
    }
    syncAllBookmarkButtons();
  }

  if (!global.__comicsnBookmarkBound) {
    global.__comicsnBookmarkBound = true;
    document.addEventListener('click', (event) => {
      const btn = event.target.closest(BOOKMARK_BTN_SELECTOR);
      if (!btn) return;
      const kind = btn.getAttribute('data-bookmark-kind');
      const id = btn.getAttribute('data-bookmark-id');
      if (!kind || !id) return;
      toggleBookmark(kind, id);
      syncAllBookmarkButtons();
      global.dispatchEvent(new CustomEvent('comicsn:bookmarkchange', {
        detail: { kind, id, on: isBookmarked(kind, id) },
      }));
    });
  }

  const LIKE_KEYS = {
    comic: 'comicsn-liked-comic',
    novel: 'comicsn-liked-novel',
    anime: 'comicsn-liked-anime',
  };
  const LIKE_BTN_SELECTOR = '[data-like-kind][data-like-id]';
  const likeCountEls = new WeakMap();

  function loadLikes(kind) {
    return loadJsonList(LIKE_KEYS[kind] || LIKE_KEYS.comic);
  }

  function saveLikes(kind, list) {
    saveJsonList(LIKE_KEYS[kind] || LIKE_KEYS.comic, list);
  }

  function isLiked(kind, id) {
    return loadLikes(kind).includes(id);
  }

  function toggleLike(kind, id) {
    const list = loadLikes(kind);
    const i = list.indexOf(id);
    if (i >= 0) list.splice(i, 1);
    else list.push(id);
    saveLikes(kind, list);
    return i < 0;
  }

  function likeCountElOf(btn) {
    return likeCountEls.get(btn) || btn.querySelector('#comicLikeCount, #animeWatchLikeCount, [data-like-count], span');
  }

  function syncLikeButton(btn) {
    if (!btn) return;
    const kind = btn.getAttribute('data-like-kind');
    const id = btn.getAttribute('data-like-id');
    if (!kind || !id) return;
    const on = isLiked(kind, id);
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-pressed', String(on));
    const countEl = likeCountElOf(btn);
    const baseRaw = btn.getAttribute('data-like-base');
    if (countEl && baseRaw != null && baseRaw !== '') {
      countEl.textContent = formatCount((Number(baseRaw) || 0) + (on ? 1 : 0));
    }
  }

  function syncAllLikeButtons(root) {
    (root || document).querySelectorAll(LIKE_BTN_SELECTOR).forEach(syncLikeButton);
  }

  function bindLikeButton(btn, kind, id, options) {
    if (!btn || !kind || !id) return;
    btn.setAttribute('data-like-kind', kind);
    btn.setAttribute('data-like-id', id);
    if (options && options.baseCount != null) {
      btn.setAttribute('data-like-base', String(options.baseCount));
    }
    if (options && options.countEl) likeCountEls.set(btn, options.countEl);
    syncLikeButton(btn);
  }

  function initLikeButtons() {
    const target = pageBookmarkTarget();
    if (target && target.id) {
      ['comicLikeBtn', 'animeWatchLikes'].forEach((eid) => {
        const btn = document.getElementById(eid);
        if (btn) bindLikeButton(btn, target.kind, target.id);
      });
    }
    syncAllLikeButtons();
  }

  if (!global.__comicsnLikeBound) {
    global.__comicsnLikeBound = true;
    document.addEventListener('click', (event) => {
      const btn = event.target.closest(LIKE_BTN_SELECTOR);
      if (!btn) return;
      const kind = btn.getAttribute('data-like-kind');
      const id = btn.getAttribute('data-like-id');
      if (!kind || !id) return;
      toggleLike(kind, id);
      syncAllLikeButtons();
      global.dispatchEvent(new CustomEvent('comicsn:likechange', {
        detail: { kind, id, on: isLiked(kind, id) },
      }));
    });
  }

  function bindCatalogPage({
    items,
    recommendId,
    gridId,
    sortWrapId,
    sortBtnId,
    sortLabelId,
    hrefOf,
    emptyRecommend,
    emptyGrid,
  }) {
    const list = items || [];

    function isVip(item) {
      return !item.free;
    }

    function byCategory(pool, category) {
      if (category === 'all') return pool;
      if (category === 'korean' || category === 'japanese') {
        return pool.filter((item) => (item.origin || 'korean') === category);
      }
      return pool.filter((item) => (item.categories || []).includes(category));
    }

    function byTab(pool, tab) {
      if (!tab || tab === 'all') return pool;
      if (tab === 'updating') return pool.filter((item) => item.status === 'updating');
      if (tab === 'ended') return pool.filter((item) => item.status === 'ended');
      if (tab === 'vip') return pool.filter(isVip);
      if (tab === 'free') return pool.filter((item) => item.free);
      return pool;
    }

    function renderRecommend(category) {
      const row = document.getElementById(recommendId);
      if (!row) return;
      const pool = byCategory(list, category);
      const featured = pool.filter((item) => item.featured);
      const rest = pool.filter((item) => !item.featured);
      const data = prioritizeNew([...featured, ...rest].slice(0, 6));
      row.innerHTML = data.length
        ? data.map((item) => workCardHtml(item, hrefOf(item), { list })).join('')
        : `<p class="manga-empty">${t('emptyRecommend', emptyRecommend)}</p>`;
    }

    function renderGrid(state) {
      const grid = document.getElementById(gridId);
      if (!grid) return;
      const filtered = byTab(byCategory(list, state.category), state.tab);
      const data = sortCatalogList(filtered, state.sort);
      grid.innerHTML = data.length
        ? data.map((item) => workCardHtml(item, hrefOf(item), { list })).join('')
        : `<p class="manga-empty">${t(/小说/.test(emptyGrid) ? 'emptyNovel' : 'emptyManga', emptyGrid)}</p>`;
    }

    const state = { category: 'all', tab: 'all', sort: 'popularity' };

    function render() {
      renderRecommend(state.category);
      renderGrid(state);
    }

    bindGroup('.manga-cat', 'category', state, 'category', render);
    bindGroup('.manga-tab', 'tab', state, 'tab', render);
    bindSortMenu({
      wrap: document.getElementById(sortWrapId),
      btn: document.getElementById(sortBtnId),
      label: document.getElementById(sortLabelId),
      options: document.querySelectorAll('.manga-sort-option'),
      labels: SORT_LABELS,
      fallbackKey: 'popularity',
      onChange(key) {
        state.sort = key;
        render();
      },
    });
    render();
    window.addEventListener('comicsn:langchange', render);
  }

  function bindLocalizedDetails({ items, copy, idPrefix }) {
    const LANG_KEY = 'comicsn-lang';

    function lang() {
      const stored = localStorage.getItem(LANG_KEY);
      return stored === 'en' || stored === 'pt' ? stored : 'zh';
    }

    function pick(map) {
      return map[lang()] || map.zh;
    }

    function render() {
      const list = document.getElementById('newsList');
      const heading = document.getElementById('newsPageTitle');
      const pageCopy = copy[lang()] || copy.zh;
      if (heading) heading.textContent = pageCopy.title;
      document.title = pageCopy.doc;
      if (!list) return;

      list.innerHTML = items.map((item) => {
        const tagClass = item.tagType === 'event' || item.tagType === 'update' ? ` is-${item.tagType}` : '';
        return `
          <details class="news-item" id="${idPrefix}-${item.id}">
            <summary class="news-item-toggle">
              <div class="news-item-meta">
                <span class="news-item-tag${tagClass}">${pick(item.tag)}</span>
                <span class="news-item-date">${item.date}</span>
              </div>
              <span class="news-item-title">${pick(item.title)}</span>
            </summary>
            <div class="news-item-body">${pick(item.body)}</div>
          </details>
        `;
      }).join('');
    }

    render();
    window.addEventListener('comicsn:langchange', render);
    new MutationObserver(render).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
    });
  }

  function prioritizeNew(list) {
    const source = list || [];
    const withNew = source.filter((item) => item.isNew)
      .sort((a, b) => publishedTime(b) - publishedTime(a));
    const withoutNew = source.filter((item) => !item.isNew);
    return [...withNew, ...withoutNew];
  }

  global.ComicsShared = {
    THUMBS,
    badgeUpHtml,
    BADGE_VIEW,
    PLAY_ICON,
    VIP_EXPIRE_KEY,
    NSFW_KEY,

    ANIMATIONS: [
      { id: 'bully', title: '恶霸的爱情故事', author: '优丸', views: '128K', likes: '91.4K', eps: 12, duration: '8分钟', durationSec: 24, status: 'updating', free: true, isNew: true, hot: true, featured: true, tags: ['校园', '耽美'], poster: 'assets/comics/thumb-2.webp' },
      { id: 'evolution', title: '进化：通往太空怪兽之路', author: 'COMICSN', views: '96K', likes: '8.2K', eps: 10, duration: '7分钟', durationSec: 22, status: 'updating', isNew: true, hot: true, featured: true, exclusive: true, published: '2024-02-08 09:49', tags: ['科幻', '动作'], poster: 'assets/comics/thumb-1.webp', blurb: '沈影璇一袭染血的月白长裙踏碎虚空，每一步落下，脚下便绽开一朵由剑意凝结的青莲，衬得她周身愈发孤绝。她身后，是被剑气犁碎的云海，以及十余道如附骨之疽的恐怖气息。三日了。自她从“归墟古境”那具上古真仙遗蜕手中......' },
      { id: 'muscle', title: '肌肉女巫竞技场', author: 'COMICSN', views: '54K', likes: '4.1K', eps: 8, duration: '6分钟', durationSec: 20, status: 'updating', hot: true, featured: true, tags: ['奇幻', '动作'], poster: 'assets/comics/thumb-3.webp' },
      { id: 'angel', title: '天使与恶魔', author: 'COMICSN', views: '41K', likes: '3.6K', eps: 9, duration: '8分钟', durationSec: 24, status: 'ended', free: true, isNew: true, tags: ['耽美', '浪漫'], poster: 'assets/comics/thumb-4.webp' },
      { id: 'witch', title: '女巫的孩子', author: 'COMICSN', views: '33K', likes: '1.2K', eps: 11, duration: '7分钟', durationSec: 21, status: 'updating', tags: ['奇幻', '恐怖'], poster: 'assets/comics/thumb-5.webp' },
      { id: 'magical', title: '魔法少女编年史', author: 'COMICSN', views: '29K', likes: '2.8K', eps: 6, duration: '5分钟', durationSec: 18, status: 'ended', hot: true, tags: ['奇幻', '动作'], poster: 'assets/comics/thumb-6.webp' },
      { id: 'romance', title: '绘画浪漫', author: 'COMICSN', views: '24K', likes: '9.7K', eps: 14, duration: '8分钟', durationSec: 24, status: 'updating', tags: ['浪漫', '生活'], poster: 'assets/comics/thumb-4.webp' },
      { id: 'mom', title: '我是妈妈', author: 'COMICSN', views: '21K', likes: '18.6K', eps: 7, duration: '6分钟', durationSec: 19, status: 'updating', isNew: true, hot: true, tags: ['生活', '剧情'], poster: 'assets/comics/thumb-5.webp' },
      { id: 'vengeance', title: '复仇', author: 'COMICSN', views: '18K', likes: '6.4K', eps: 13, duration: '9分钟', durationSec: 26, status: 'ended', tags: ['动作', '剧情'], poster: 'assets/comics/thumb-1.webp' },
      { id: 'school', title: '与青梅竹马和前女友同班', author: 'COMICSN', views: '15K', likes: '7.1K', eps: 8, duration: '7分钟', durationSec: 22, status: 'updating', free: true, tags: ['校园', '浪漫'], poster: 'assets/comics/thumb-2.webp' },
      { id: 'asteroid', title: '小行星落入学校的那天', author: 'COMICSN', views: '12K', likes: '5.3K', eps: 5, duration: '6分钟', durationSec: 18, status: 'ended', tags: ['校园', '喜剧'], poster: 'assets/comics/thumb-3.webp' },
      { id: 'starry', title: '暗夜星途', author: 'COMICSN', views: '9.6K', likes: '14.2K', eps: 10, duration: '8分钟', durationSec: 24, status: 'updating', tags: ['耽美', '剧情'], poster: 'assets/comics/thumb-6.webp' },
    ],

    COMICS: [
      { id: 'evolution', title: '进化：通往太空怪兽之路', ep: '第47集', views: '16.9K', likes: '8.2K', categories: ['action', 'fantasy', 'sci-fi'], isNew: true, hot: true, featured: true, exclusive: true, status: 'updating', author: '韩宇' },
      { id: 'bully', title: '恶霸的爱情故事', ep: '第24集', views: '277.2K', likes: '91.4K', categories: ['school', 'bl'], isNew: true, hot: true, featured: true, exclusive: true, status: 'updating', free: true, author: '优丸', published: '2025-08-01 10:00' },
      { id: 'muscle', title: '肌肉女巫竞技场', ep: '第29集', views: '2.7K', likes: '4.1K', categories: ['action', 'fantasy'], hot: true, featured: true, exclusive: true, status: 'updating', author: '南风' },
      { id: 'angel', title: '天使与恶魔', ep: '第25集', views: '1K', likes: '3.6K', categories: ['bl', 'romance'], isNew: true, status: 'updating', free: true, author: '白夜' },
      { id: 'witch', title: '女巫的孩子', ep: '第33集', views: '497', likes: '1.2K', categories: ['fantasy'], status: 'updating', author: '林深' },
      { id: 'magical', title: '魔法少女编年史 ABC', ep: '第27集', views: '450', likes: '2.8K', categories: ['action', 'fantasy'], hot: true, featured: true, exclusive: true, status: 'ended', author: '顾清' },
      { id: 'too-much', title: '她对我来说太过了', ep: '第88集', views: '20K', likes: '11.3K', categories: ['romance', 'comedy'], hot: true, featured: true, exclusive: true, status: 'updating', author: '沈星' },
      { id: 'drawing', title: '绘画浪漫', ep: '第62集', views: '15K', likes: '9.7K', categories: ['romance', 'slice'], featured: true, exclusive: true, status: 'updating', free: true, author: '叶舟' },
      { id: 'mom', title: '我是妈妈', ep: '第45集', views: '12K', likes: '18.6K', categories: ['slice'], isNew: true, hot: true, status: 'updating', author: '陈川' },
      { id: 'vengeance', title: '复仇', ep: '第51集', views: '9.8K', likes: '6.4K', categories: ['action'], status: 'ended', author: '苏晚' },
      { id: 'classmate', title: '与青梅竹马和前女友同班', ep: '第39集', views: '8.2K', likes: '7.1K', categories: ['romance', 'school'], status: 'updating', free: true, author: '江北' },
      { id: 'asteroid', title: '小行星落入学校的那天', ep: '第28集', views: '7.5K', likes: '5.3K', categories: ['school', 'comedy'], status: 'ended', free: true, author: '白鹿' },
      { id: 'starry', title: '暗夜星途', ep: '第33集', views: '6.1K', likes: '14.2K', categories: ['bl'], status: 'updating', author: '明川' },
      { id: 'white-hole', title: '白洞', ep: '第19集', views: '5.4K', likes: '3.9K', categories: ['sci-fi', 'fantasy'], status: 'updating', author: '方舟' },
      { id: 'zombie', title: '新婚僵尸', ep: '第22集', views: '4.9K', likes: '2.2K', categories: ['comedy'], isNew: true, status: 'updating', author: '夏至' },
      { id: 'yurong', title: '我的小宇荣', ep: '第17集', views: '4.2K', likes: '8.8K', categories: ['slice', 'comedy'], status: 'updating', free: true, author: '顾南' },
      { id: 'no-hero', title: '我不想当英雄！', ep: '第41集', views: '3.8K', likes: '4.6K', categories: ['action', 'comedy'], status: 'updating', author: '林舟' },
      { id: 'hunter', title: '鬼怪猎人', ep: '第26集', views: '3.1K', likes: '2.9K', categories: ['action', 'fantasy'], status: 'ended', author: '沈夜' },
      { id: 'drink', title: '来喝一杯吧！', ep: '第14集', views: '2.9K', likes: '6.7K', categories: ['slice', 'comedy'], status: 'updating', free: true, author: '叶白' },
      { id: 'boy-world', title: '少年对抗世界', ep: '第31集', views: '2.4K', likes: '1.8K', categories: ['action', 'school'], status: 'updating', author: '陈星' },
      { id: 'apocalypse', title: '末日故事集', ep: '第18集', views: '2.1K', likes: '1.5K', categories: ['sci-fi'], status: 'ended', author: '苏川' },
      { id: 'fantasy-tale', title: '奇幻传说', ep: '第24集', views: '1.9K', likes: '3.3K', categories: ['fantasy'], status: 'updating', author: '江晚' },
      { id: 'growth', title: '成长剧', ep: '第12集', views: '1.6K', likes: '2.1K', categories: ['school', 'slice'], status: 'updating', free: true, author: '白舟' },
      { id: 'space-return', title: '太空怪兽归来', ep: '第55集', views: '1.4K', likes: '980', categories: ['action', 'sci-fi'], status: 'updating', author: '明夜' },
      { id: 'secret-class', title: '秘密课堂 重启', ep: '第67集', views: '1.2K', likes: '5.5K', categories: ['school'], hot: true, status: 'updating', author: '方白' },
      { id: 'love-letter', title: '错发的情书', ep: '第8集', views: '980', likes: '4.4K', categories: ['romance'], isNew: true, status: 'updating', free: true, author: '夏川' },
      { id: 'maid', title: '疲惫女仆来了！', ep: '第11集', views: '860', likes: '1.1K', categories: ['comedy', 'slice'], status: 'updating', free: true, author: '顾星' },
      { id: 'neighbor', title: '亲爱的邻居', ep: '第9集', views: '740', likes: '2.4K', categories: ['romance', 'slice'], status: 'updating', author: '林白' },
      { id: 'concrete', title: '混凝土丛林', ep: '第16集', views: '620', likes: '890', categories: ['action'], status: 'ended', author: '沈川' },
      { id: 'robot', title: '如果你是机器人就现身', ep: '第7集', views: '510', likes: '1.7K', categories: ['sci-fi', 'comedy'], isNew: true, status: 'updating', free: true, author: '叶晚' },
    ],

    NOVELS: [
      { id: 'night-store', title: '深夜便利店的告白', ep: '第64章', views: '88K', likes: '32.1K', categories: ['romance', 'slice'], isNew: true, hot: true, featured: true, exclusive: true, status: 'updating', free: true, author: '林晚星' },
      { id: 'villain-love', title: '转生成反派也要谈恋爱', ep: '第112章', views: '61K', likes: '28.4K', categories: ['fantasy', 'romance'], isNew: true, hot: true, featured: true, exclusive: true, status: 'updating', author: '江澄舟' },
      { id: 'campus-xianxia', title: '校园修仙日志', ep: '第73章', views: '41K', likes: '19.6K', categories: ['school', 'fantasy'], hot: true, featured: true, exclusive: true, status: 'ended', published: '2025-02-03 14:20', author: '顾南乔' },
      { id: 'ceo-standin', title: '总裁的替身情人', ep: '第86章', views: '54K', likes: '21.3K', categories: ['romance'], featured: true, exclusive: true, status: 'updating', author: '沈予安' },
      { id: 'last-garden', title: '末世花园', ep: '第49章', views: '36K', likes: '14.8K', categories: ['sci-fi', 'action'], featured: true, exclusive: true, status: 'updating', author: '叶知秋' },
      { id: 'roommate-rules', title: '室友不可爱守则', ep: '第28章', views: '22K', likes: '17.2K', categories: ['school', 'bl'], isNew: true, featured: true, exclusive: true, status: 'updating', free: true, author: '陈见鹿' },
      { id: 'starlight-her', title: '她从星光里走来', ep: '第38章', views: '29K', likes: '12.5K', categories: ['romance', 'slice'], status: 'updating', free: true, author: '苏晚晴' },
      { id: 'library-reader', title: '图书馆的秘密读者', ep: '第55章', views: '24K', likes: '9.1K', categories: ['slice', 'school'], status: 'updating', author: '白敬衡' },
      { id: 'inn-rebirth', title: '重生之我在江湖开客栈', ep: '第91章', views: '21K', likes: '15.7K', categories: ['fantasy', 'action'], hot: true, status: 'updating', author: '林晚星' },
      { id: 'cat-next-door', title: '隔壁的猫与你', ep: '第27章', views: '18K', likes: '11.4K', categories: ['slice', 'comedy'], status: 'updating', free: true, author: '江澄舟' },
      { id: 'last-swordsman', title: '帝国的最后一位剑士', ep: '第44章', views: '16K', likes: '8.8K', categories: ['action', 'fantasy'], status: 'ended', author: '顾南乔' },
      { id: 'rain-mystery', title: '雨夜推理社', ep: '第33章', views: '13K', likes: '7.2K', categories: ['school'], status: 'updating', author: '沈予安' },
      { id: 'contract-marriage', title: '契约婚姻请签字', ep: '第58章', views: '11K', likes: '10.6K', categories: ['romance'], status: 'updating', author: '叶知秋' },
      { id: 'magic-fail', title: '魔法学院不及格生', ep: '第22章', views: '9.6K', likes: '6.4K', categories: ['school', 'fantasy'], isNew: true, hot: true, status: 'updating', free: true, author: '陈见鹿' },
      { id: 'villain-moonlight', title: '穿越成反派的白月光', ep: '第47章', views: '8.1K', likes: '13.9K', categories: ['fantasy', 'romance'], status: 'updating', author: '苏晚晴' },
      { id: 'sea-lighthouse', title: '海风与灯塔', ep: '第19章', views: '7.4K', likes: '4.1K', categories: ['slice'], status: 'ended', free: true, author: '白敬衡' },
      { id: 'fake-workplace', title: '职场生存指南（假的）', ep: '第31章', views: '6.2K', likes: '5.8K', categories: ['comedy', 'slice'], status: 'updating', free: true, author: '林晚星' },
      { id: 'dragon-days', title: '与龙同居的一百天', ep: '第16章', views: '5.5K', likes: '8.3K', categories: ['fantasy', 'comedy'], isNew: true, status: 'updating', author: '江澄舟' },
      { id: 'time-bookstore', title: '旧书店的时间旅人', ep: '第28章', views: '4.8K', likes: '3.6K', categories: ['fantasy', 'slice'], status: 'updating', author: '顾南乔' },
      { id: 'alley-heartbeat', title: '暗巷里的心跳', ep: '第21章', views: '4.4K', likes: '9.8K', categories: ['bl', 'romance'], isNew: true, hot: true, status: 'updating', author: '沈予安' },
      { id: 'after-masquerade', title: '假面舞会之后', ep: '第12章', views: '4.1K', likes: '2.9K', categories: ['romance'], status: 'updating', free: true, author: '叶知秋' },
      { id: 'star-postman', title: '星际邮差', ep: '第40章', views: '3.6K', likes: '2.4K', categories: ['sci-fi'], status: 'updating', author: '陈见鹿' },
      { id: 'winter-onsen', title: '冬日温泉旅馆', ep: '第15章', views: '2.9K', likes: '4.7K', categories: ['slice', 'romance'], status: 'ended', free: true, author: '苏晚晴' },
      { id: 'god-off-duty', title: '神明请下班', ep: '第21章', views: '2.3K', likes: '3.2K', categories: ['comedy', 'fantasy'], status: 'updating', free: true, author: '白敬衡' },
      { id: 'silent-pianist', title: '沉默的钢琴师', ep: '第9章', views: '1.8K', likes: '2.1K', categories: ['slice'], isNew: true, status: 'updating', author: '林晚星' },
      { id: 'city-south', title: '城南旧事续写', ep: '第18章', views: '1.2K', likes: '1.6K', categories: ['slice', 'school'], status: 'ended', author: '江澄舟' },
      { id: 'no-gravity', title: '如果明天没有重力', ep: '第11章', views: '980', likes: '1.9K', categories: ['sci-fi', 'romance'], isNew: true, status: 'updating', free: true, author: '顾南乔' },
      { id: 'villain-tea', title: '反派联盟茶话会', ep: '第14章', views: '860', likes: '2.7K', categories: ['comedy', 'action'], status: 'updating', author: '沈予安' },
      { id: 'martial-boy', title: '武道少年不想努力了', ep: '第26章', views: '740', likes: '1.4K', categories: ['action', 'school'], status: 'updating', author: '叶知秋' },
      { id: 'fox-deskmate', title: '同桌是只小狐狸', ep: '第8章', views: '610', likes: '3.5K', categories: ['school', 'fantasy'], isNew: true, status: 'updating', free: true, author: '陈见鹿' },
    ],

    parseViews,
    canRead,
    bindSortMenu,
    bindGroup,
    bindShareButton,
    workCardHtml,
    bindChapterList,
    bindCatalogPage,
    bindLocalizedDetails,
    findById,
    crumbTagOf,
    fillWorkDetailShell,
    renderRelatedWorks,
    bindWorkDetailPage,
    novelChapterCount,
    novelChapterTitle,
    escapeHtml,
    formatCount,
    coverOf,
    publishedOf,
    sortCatalogList,
    dateOfIssue,
    keywordsOf,
    catLabel,
    currentLang,
    t,
    pickLang,
    localizedPhrase,
    localizedTitle,
    localizedEp,
    epLabel,
    localizedDuration,
    loadHistory,
    recordHistory,
    removeHistory,
    historyHref,
    isBookmarked,
    toggleBookmark,
    bindBookmarkButton,
    isLiked,
    toggleLike,
    bindLikeButton,
    rotateList(list, offset) {
      const start = offset % list.length;
      return [...list.slice(start), ...list.slice(0, start)];
    },
    prioritizeNew,
  };

  const JP_COMIC_IDS = {
    evolution: 1, muscle: 1, angel: 1, witch: 1, magical: 1, vengeance: 1,
    'white-hole': 1, 'no-hero': 1, hunter: 1, apocalypse: 1, 'fantasy-tale': 1,
    'space-return': 1, concrete: 1, robot: 1,
  };
  (global.ComicsShared.COMICS || []).forEach((item) => {
    if (!item.origin) item.origin = JP_COMIC_IDS[item.id] ? 'japanese' : 'korean';
  });

  [global.ComicsShared.COMICS, global.ComicsShared.NOVELS, global.ComicsShared.ANIMATIONS].forEach((list) => {
    (list || []).forEach((item) => {
      if (!TITLE_I18N[item.id]) TITLE_I18N[item.id] = {};
      TITLE_I18N[item.id].zh = item.title;
    });
  });

  function initLibraryButtons() {
    initBookmarkButtons();
    initLikeButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLibraryButtons);
  } else {
    initLibraryButtons();
  }
})(window);
