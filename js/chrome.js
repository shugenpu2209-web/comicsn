(function () {
  'use strict';

  if (document.body && document.body.classList.contains('reader-page')) return;

  const phase = document.currentScript && document.currentScript.dataset.chrome;
  const file = location.pathname.split('/').pop() || 'index.html';
  const page = file === '' || file === '/' ? 'index.html' : file;
  const hash = location.hash || '';

  function gnbActive(href) {
    if (href === './') return page === 'index.html';
    if (href === 'ranking.html') return page === 'ranking.html';
    if (href === 'manga.html') return page === 'manga.html' || page === 'comic.html';
    if (href === 'novel.html') return page === 'novel.html' || page === 'novel-detail.html';
    if (href === 'anime.html') return page === 'anime.html' || page === 'anime-watch.html';
    if (href === 'bookshelf.html') return page === 'bookshelf.html';
    return false;
  }

  function menuActive(href) {
    if (href === 'mypage.html') return page === 'mypage.html' && hash !== '#vip';
    if (href === 'mypage.html#vip') return page === 'mypage.html' && hash === '#vip';
    return href === page;
  }

  function link(href, label, extraClass) {
    const active = extraClass === 'gnb' ? gnbActive(href) : menuActive(href);
    if (extraClass === 'gnb') {
      const key = label.key ? ` data-i18n="${label.key}"` : '';
      return `<a href="${href}" class="gnb-link${active ? ' is-active' : ''}"${key}>${label.text}</a>`;
    }
    return `<a href="${href}" class="menu-nav-item${active ? ' is-active' : ''}"><img class="menu-nav-icon" src="assets/menu/${label.icon}" alt=""><span class="menu-nav-label" data-i18n="${label.key}">${label.text}</span><img class="menu-nav-chevron" src="assets/menu/icon_chevron.svg" alt=""></a>`;
  }

  const HEADER = `
  <header class="header">
    <div class="container header-top">
      <div class="header-nav">
        <div class="logo-area">
          <a href="./" class="logo-link" id="logoLink">
            <img src="assets/logo_1.png" alt="COMICSN" class="logo-img" width="537" height="85" decoding="async" fetchpriority="high">
          </a>
        </div>
        <button type="button" class="nsfw-toggle" id="nsfwToggle" aria-label="NSFW toggle" aria-pressed="false">
          <img class="nsfw-switch" id="nsfwSwitchImg" src="assets/nsfw_btn_off.svg" alt="NSFW toggle">
        </button>
        <nav class="side-menu">
          <ul class="side-menu-list">
            <li class="lang-switch" id="langSwitch">
              <button type="button" class="side-menu-item side-menu-btn lang-switch-btn" id="langSwitchBtn" aria-haspopup="listbox" aria-expanded="false" aria-label="切换语言" data-i18n-aria="langAria">
                <svg class="lang-switch-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.5"/>
                  <ellipse cx="12" cy="12" rx="3.2" ry="8" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M4 12h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span id="langSwitchLabel">繁体中文</span>
              </button>
              <div class="lang-switch-menu" role="listbox" aria-labelledby="langSwitchBtn">
                <button type="button" class="lang-switch-option is-active" data-lang="zh" role="option" aria-selected="true">繁体中文</button>
                <button type="button" class="lang-switch-option" data-lang="en" role="option" aria-selected="false">English</button>
                <button type="button" class="lang-switch-option" data-lang="pt" role="option" aria-selected="false">Português</button>
              </div>
            </li>
            <li>
              <button type="button" class="side-menu-item side-menu-btn" id="searchButton" aria-label="搜索" aria-expanded="false" data-i18n-aria="search">
                <img src="assets/icons/icon_hd_search.png" alt="搜索" data-i18n-alt="search">
                <span data-i18n="search">搜索</span>
              </button>
            </li>
            <li>
              <button type="button" class="side-menu-item side-menu-btn" id="menuButton" aria-label="菜单" aria-expanded="false" data-i18n-aria="menu">
                <img src="assets/icons/icon_hd_menu.png" alt="菜单" data-i18n-alt="menu">
                <span data-i18n="menu">菜单</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
    <div class="header-divider"></div>
  </header>
  <div class="header-gnb-bar">
    <div class="container header-gnb-wrap">
      <nav class="gnb-nav">
        <div class="gnb-list">
          ${link('./', { text: '首页', key: 'navHome' }, 'gnb')}
          ${link('ranking.html', { text: '排行', key: 'navRank' }, 'gnb')}
          ${link('manga.html', { text: '漫画', key: 'navManga' }, 'gnb')}
          ${link('novel.html', { text: '小说', key: 'navNovel' }, 'gnb')}
          ${link('anime.html', { text: '动画', key: 'navAnime' }, 'gnb')}
          ${link('bookshelf.html', { text: '书架', key: 'navShelf' }, 'gnb')}
        </div>
      </nav>
    </div>
  </div>`;

  const FOOT = `
  <footer class="footer">
    <div class="container">
      <div class="footer-logo">
        <img src="assets/logo_1.png" alt="COMICSN" class="footer-logo-img" width="537" height="85" decoding="async">
      </div>
      <p class="footer-copyright" data-i18n="footerCopy">
        COMICSN出版的所有网络漫画均受版权法保护。任何非法复制行为都将导致立即采取法律行动。署名并不能免除版权侵权责任。
      </p>
      <p class="footer-contact">
        <a href="https://comicsn.com" target="_blank" rel="noopener noreferrer">comicsn.com</a>
      </p>
      <ul class="footer-links">
        <li><a href="terms.html" data-i18n="terms">服务条款</a></li>
        <li><a href="privacy.html" data-i18n="privacy">隐私政策</a></li>
        <li><a href="contact.html" data-i18n="contact">联系客服</a></li>
        <li><a href="faq.html" data-i18n="faq">常见问题</a></li>
      </ul>
    </div>
  </footer>

  <div class="search-overlay" id="searchOverlay" aria-hidden="true">
    <div class="search-panel" role="dialog" aria-modal="true" aria-label="搜索" data-i18n-aria="search">
      <div class="search-input-wrap">
        <img class="search-input-icon" src="assets/icons/icon_hd_search.png" alt="">
        <input type="search" class="search-input" id="searchInput" placeholder="按标题/作者/标签搜索" data-i18n-placeholder="searchPh" autocomplete="off">
        <button type="button" class="search-input-close" id="searchInputClose" hidden aria-label="清除">×</button>
      </div>
      <section class="search-section" id="searchRecentSection">
        <div class="search-section-head" id="searchRecentHead">
          <h3 class="search-section-title"><img class="search-section-icon-img" src="assets/icons/icon_hd_search.png" alt="" width="16" height="16"><span data-i18n="recentSearch">近期搜索</span></h3>
          <button type="button" class="search-clear-btn" id="searchClearRecent" hidden data-i18n="clearAll">全部清除</button>
        </div>
        <ul class="recent-search-list" id="searchRecentList"></ul>
        <ul class="search-result-list" id="searchResultList" hidden></ul>
        <p class="search-empty" id="searchEmpty" hidden data-i18n="searchEmpty">未找到结果。</p>
      </section>
      <div id="searchBrowse">
      <div class="search-divider"></div>
      <section class="search-section">
        <div class="search-section-head">
          <h3 class="search-section-title"><span class="search-section-icon">🔥</span><span data-i18n="hotSearch">热门搜索</span></h3>
        </div>
        <ol class="hot-search-list">
          <li><span class="hot-rank hot-rank-top">1</span><span class="hot-text" data-i18n="hotMom">妈妈</span></li>
          <li><span class="hot-rank hot-rank-top">2</span><span class="hot-text" data-i18n="hotSister">姐姐</span></li>
          <li><span class="hot-rank hot-rank-top">3</span><span class="hot-text" data-i18n="hotSecret">秘密</span></li>
          <li><span class="hot-rank">4</span><span class="hot-text" data-i18n="hotClass">秘密班级</span></li>
          <li><span class="hot-rank">5</span><span class="hot-text" data-i18n="hotMother">母亲</span></li>
          <li><span class="hot-rank">6</span><span class="hot-text" data-i18n="hotLove">爱</span></li>
          <li><span class="hot-rank">7</span><span class="hot-text" data-i18n="hotTeacher">老师</span></li>
          <li><span class="hot-rank">8</span><span class="hot-text" data-i18n="hotHole">洞</span></li>
          <li><span class="hot-rank">9</span><span class="hot-text" data-i18n="hotDella">德拉</span></li>
          <li><span class="hot-rank">10</span><span class="hot-text">P</span></li>
        </ol>
      </section>
      <div class="search-divider"></div>
      <section class="search-section">
        <div class="search-section-head">
          <h3 class="search-section-title"><span class="search-section-icon">✨</span><span data-i18n="hotKeywords">热门关键词</span></h3>
        </div>
        <div class="hot-keywords">
          <a href="#" class="keyword-tag" data-i18n="kwCougar">#美洲狮</a>
          <a href="anime.html" class="keyword-tag" data-i18n="kwCartoon">#动画片</a>
          <a href="#" class="keyword-tag" data-i18n="kwCollege">#大学</a>
          <a href="#" class="keyword-tag" data-i18n="kwPower">#特殊能力</a>
          <a href="#" class="keyword-tag" data-i18n="kwOutdoor">#户外活动</a>
          <a href="#" class="keyword-tag" data-i18n="kwHardcore">#硬核</a>
          <a href="#" class="keyword-tag" data-i18n="kwSwap">#角色互换</a>
        </div>
      </section>
      </div>
    </div>
  </div>

  <div class="menu-overlay" id="menuOverlay" aria-hidden="true">
    <div class="menu-drawer" role="dialog" aria-modal="true" aria-label="菜单">
      <button type="button" class="menu-close" id="menuClose" aria-label="关闭菜单" data-i18n-aria="closeMenu">
        <img src="assets/menu/icon_close.svg" alt="">
      </button>
      <div class="menu-profile">
        <img class="menu-profile-google" src="assets/menu/icon_google.svg" alt="Google">
        <div class="menu-profile-info">
          <div class="menu-vip-badge">
            <img src="assets/menu/icon_crown.svg" alt="">
            <span data-i18n="vipBronzeLabel">VIP 青铜</span>
          </div>
          <p class="menu-profile-email">shugenpu2209@gmail.com</p>
        </div>
      </div>
      <a href="ad.html" class="menu-promo-banner">
        <img src="assets/menu_promo_vip.png?v=2" alt="充值活动" data-i18n-alt="promoAlt">
      </a>
      <nav class="menu-nav">
        ${link('mypage.html', { icon: 'icon_user.svg', text: '我的页面', key: 'mypage' })}
        ${link('mypage.html#vip', { icon: 'icon_vip.svg', text: 'VIP充值', key: 'vip' })}
        ${link('bookshelf.html', { icon: 'icon_book.svg', text: '我的书架', key: 'myShelf' })}
        ${link('news.html', { icon: 'icon_news.svg', text: '最新消息', key: 'news' })}
        ${link('faq.html', { icon: 'icon_faq.svg', text: '常见问题', key: 'faq' })}
        ${link('contact.html', { icon: 'icon_service.svg', text: '联系客服', key: 'contact' })}
      </nav>
      <button type="button" class="menu-logout-btn">
        <img class="menu-nav-icon" src="assets/menu/icon_logout.svg" alt="">
        <span class="menu-nav-label" data-i18n="logout">退出登录</span>
      </button>
    </div>
  </div>

  <button type="button" class="floating-nsfw" id="floatingNsfw" aria-label="NSFW toggle">
    <span class="floating-nsfw-label">NSFW OFF</span>
  </button>`;

  if (phase !== 'foot') document.write(HEADER);
  if (phase !== 'head') document.write(FOOT);
})();
