(function () {
  'use strict';

  const MOBILE_BREAKPOINT = '(max-width: 768px)';
  const AUTOPLAY_MS = 4000;
  const SEARCH_PANEL_WIDTH = 300;
  const LANG_KEY = 'comicsn-lang';
  const LANG_META = {
    zh: { label: '繁体中文', htmlLang: 'zh-CN' },
    en: { label: 'English', htmlLang: 'en' },
    pt: { label: 'Português', htmlLang: 'pt-BR' },
  };
  const I18N = {
    zh: {
      search: '搜索',
      menu: '菜单',
      langAria: '切换语言',
      navHome: '首页',
      navRank: '排行',
      navNovel: '小说',
      navManga: '漫画',
      navAnime: '动画',
      navShelf: '书架',
      mypage: '我的页面',
      vip: 'VIP充值',
      myShelf: '我的书架',
      news: '最新消息',
      faq: '常见问题',
      contact: '联系客服',
      logout: '退出登录',
      register: '注册',
      login: '登录',
      close: '关闭',
      closeMenu: '关闭菜单',
      searchPh: '按标题/作者/标签搜索',
      recentSearch: '近期搜索',
      hotSearch: '热门搜索',
      hotKeywords: '热门关键词',
      clearAll: '全部清除',
      removeSearch: '删除',
      searchEmpty: '未找到结果。',
      noticeLabel: '公告',
      footerCopy: 'COMICSN出版的所有网络漫画均受版权法保护。任何非法复制行为都将导致立即采取法律行动。署名并不能免除版权侵权责任。',
      terms: '服务条款',
      privacy: '隐私政策',
      rankManga: '📖 漫画排行',
      rankNovel: '✨ 小说排行',
      rankAnime: '🌠 动画排行',
      completed: '🎆 完结漫画',
      moreReco: '🔆 其他推荐',
      seeAll: 'See All',
      hotCats: '热门类别',
      weekReco: '本周推荐',
      catAll: '全部',
      catKorean: '韩漫',
      catJapanese: '日漫',
      catSchool: '校园',
      catBl: '耽美',
      catFantasy: '奇幻',
      catRomance: '浪漫',
      catAction: '动作',
      catSciFi: '科幻',
      catComedy: '喜剧',
      catSlice: '生活',
      tabUpdating: '连载中',
      tabEnded: '已完结',
      tabVip: 'VIP专属',
      tabFree: '免费',
      sortPop: '按人气排序',
      sortViews: '浏览量最高',
      sortPlays: '播放量最高',
      sortLatest: '最新',
      periodWeekly: '周榜',
      periodMonthly: '月榜',
      periodQuarterly: '季度榜',
      periodYearly: '年榜',
      shelfRecent: '历史浏览',
      shelfFav: '我的收藏',
      shelfVip: '我喜欢的',
      searchWorks: '搜索作品',
      emptyRecommend: '暂无推荐',
      emptyManga: '暂无漫画',
      emptyNovel: '暂无小说',
      emptyAnime: '暂无动画',
      emptyShelfLead: '暂无阅览，',
      emptyShelfGo: '现在就去观看',
      emptyHistory: '暂无会员开通记录',
      plays: '播放',
      viewsTimes: '次观看',
      published: '发布时间',
      details: '细节',
      keywords: '关键词',
      relatedComics: '相关漫画',
      relatedBooks: '相关书籍',
      relatedAnime: '猜你喜欢',
      unlockAll: '解锁全部',
      latestCh: '最新章节',
      toc: '目录',
      sortAsc: '正序',
      sortDesc: '倒序',
      freeRead: '免费阅读第1章 >',
      freeWatch: '免费观看第1集 >',
      continueVip: '开通 VIP 继续观看',
      goVip: '前往充值',
      myFavorites: '我的收藏',
      vipSub: '我喜欢的',
      keepReading: '继续阅读',
      vipMember: 'VIP 会员',
      vipNone: '未开通',
      vipExpireNone: '暂未开通',
      spentPrefix: '累计充值',
      progressNext: '再充 ¥{n} 升至 {name}',
      progressMax: '已达最高等级',
      rechargeVip: '充值 VIP',
      packWeek: '一周',
      packMonth: '一月',
      packQuarter: '3月',
      packYear: '一年',
      days7: '7 天',
      days30: '30 天',
      days90: '90 天',
      days365: '365 天',
      tierBronze: '青铜',
      tierSilver: '白银',
      tierGold: '黄金',
      tierPlatinum: '铂金',
      tierDiamond: '钻石',
      orders: '会员开通记录',
      settings: '设置',
      nsfwContent: 'NSFW 内容',
      nsfwHint: '与顶部开关同步，开启后显示成人向作品',
      notify: '更新通知',
      notifyHint: '收藏作品有新章节时提醒',
      deleteAccount: '注销账号',
      confirmPay: '确认充值',
      payMethod: '充值方式',
      wechatPay: '微信支付',
      wechatPayHint: '微信钱包安全支付',
      alipay: '支付宝',
      alipayHint: '支付宝账号快捷支付',
      cancel: '取消',
      confirm: '确认',
      payNow: '确认支付',
      deleteSelected: '是否删除所选书籍？',
      adKicker: '活动详情',
      adTitle: '先选你喜欢的类型吧',
      adP1: '海量作品按类型整理，校园、奇幻、浪漫、动作一次找齐。先选定你最想看的类型，系统会为你推荐同好都在追的漫画与动画。',
      adP2: '现在进入漫画频道，立刻开始浏览。',
      adCta: '去漫画逛逛',
      contactTitle: '联系客服',
      termsTitle: '服务条款',
      privacyTitle: '隐私政策',
      siteOfficial: '官方网站',
      serviceHours: '服务时间',
      serviceHoursVal: '周一至周五 10:00–18:00（节假日顺延）',
      contactIntro: '使用过程中如遇账号、充值、版权或内容问题，欢迎通过以下方式联系我们。我们会在工作时间内尽快回复。',
      contactProvide: '提交时请尽量提供',
      contactLi1: '注册账号或绑定手机号',
      contactLi2: '问题发生时间、页面或作品名称',
      contactLi3: '截图或订单号（如涉及充值）',
      phoneSmsLogin: '手机短信登录',
      accountLogin: '账号密码登录',
      phoneRegister: '手机号注册',
      accountRegister: '账号密码注册',
      registerAccount: '注册账号',
      phone: '手机号',
      code: '验证码',
      setPassword: '设置密码',
      account: '账号',
      password: '密码',
      confirmPassword: '确认密码',
      forgotPassword: '忘记密码',
      getCode: '获取验证码',
      phonePh: '请输入11位手机号',
      codePh: '请输入验证码',
      passwordPh: '至少6位密码',
      usernamePh: '请输入账号',
      enterPasswordPh: '请输入密码',
      confirmPasswordPh: '再次输入密码',
      noAccount: '没有账号？',
      goRegister: '去注册',
      hasAccount: '已有账号？',
      goLogin: '去登录',
      resetTitle: '找回密码',
      bindPhonePh: '请输入绑定手机号',
      newPassword: '新密码',
      newPasswordPh: '至少6位新密码',
      confirmNewPassword: '确认新密码',
      confirmNewPasswordPh: '再次输入新密码',
      confirmReset: '确认找回',
      rememberPassword: '想起密码了？',
      errPhone: '请输入正确的11位手机号',
      errCode: '验证码不正确',
      errPassword: '密码至少6位',
      errPasswordNew: '新密码至少6位',
      errMismatch: '两次密码不一致',
      errLogin: '账号或密码不正确',
      errUsername: '账号需4–20位，字母开头',
      codeSent: '验证码已发送',
      retryIn: '秒后重试',
      exclusive: '独播',
      updatedOn: '更新于',
      members: '会员',
      membership: '会员资格',
      share: '分享',
      bookmark: '收藏',
      like: '喜欢',
      relatedVideos: '相关视频',
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
      selectedSeries: '您选择了“{n}”系列',
      validUntilPrefix: '有效期至',
      orderNo: '订单号',
      validPeriod: '有效期',
      openedAt: '开通时间',
      source: '开通来源',
      notifyOn: '已开启更新通知',
      notifyOff: '已关闭更新通知',
      logoutConfirm: '确定退出当前账号？',
      deleteConfirm: '注销后书架、VIP 与会员开通记录将无法恢复。确定注销？',
      logoutAction: '退出',
      deleteAction: '注销',
      paidVia: '已通过{pay}开通 VIP {plan}{tier}',
      currentTier: '，当前 {name}',
      validDaysTo: '{n}天（至 {date}）',
      payPlanLine: 'VIP {label} · {days} 天',
      lockFromEp: '第{n}集起为 VIP 专属，开通后可继续观看',
      groupN: '第 {n} 组',
      vipBronzeLabel: 'VIP 青铜',
      promoAlt: '充值活动',
      hashNovel: '#小说',
      hashManga: '#漫画',
      firstEp: '第一集',
      detailsEndedTpl: '{title}已完结，共{ep}。{tags} 向的故事可以一次看完。',
      detailsUpdatingTpl: '{title}连载至{ep}。{tags} 向的故事正在更新，欢迎收藏追更。',
      animeBlurbTpl: '{title} 动画版，由 {author} 制作，现已更新至第{n}集。',
      sortAscAria: '当前正序，点击切换倒序',
      sortDescAria: '当前倒序，点击切换正序',
      wechatShort: '微',
      alipayShort: '支',
      hotMom: '妈妈',
      hotSister: '姐姐',
      hotSecret: '秘密',
      hotClass: '秘密班级',
      hotMother: '母亲',
      hotLove: '爱',
      hotTeacher: '老师',
      hotHole: '洞',
      hotDella: '德拉',
      kwCougar: '#美洲狮',
      kwCartoon: '#动画片',
      kwCollege: '#大学',
      kwPower: '#特殊能力',
      kwOutdoor: '#户外活动',
      kwHardcore: '#硬核',
      kwSwap: '#角色互换',
      noticeAria: '最新公告',
      shelfAria: '书架分类',
      rankAria: '排行榜分类',
      periodAria: '排行榜周期',
      sortAria: '排序方式',
      workTypeAria: '作品类型',
      accountAria: '账户信息',
      vipLevelAria: 'VIP 等级',
      shortcutsAria: '快捷入口',
      accountContentAria: '账户内容',
      chapterList: '章节列表',
      breadcrumb: '面包屑',
      mangaFilter: '漫画筛选',
      novelFilter: '小说筛选',
      animeFilter: '动画筛选',
      bannerPrev: '上一组',
      bannerNext: '下一组',
      play: '播放',
      playPause: '播放/暂停',
      fullscreen: '全屏',
      progressAria: '播放进度',
      deleteAria: '删除',
      deleteSelectedAria: '删除所选',
      docNews: '最新消息 - COMICSN',
      docFaq: '常见问题 - COMICSN',
      docHome: 'COMICSN',
      docManga: '漫画 - COMICSN',
      docNovel: '小说 - COMICSN',
      docAnime: '动画 - COMICSN',
      docRank: '排行 - COMICSN',
      docShelf: '书架 - COMICSN',
      docMypage: '我的页面 - COMICSN',
      docTerms: '服务条款 - COMICSN',
      docPrivacy: '隐私政策 - COMICSN',
      docContact: '联系客服 - COMICSN',
      docAd: '先选你喜欢的类型吧 - COMICSN',
      notices: [
        '充值活动进行中：开通 VIP 即可解锁第7集起全部动画',
        '《恶霸的爱情故事》动画已更新至第12集',
        '新作上架：《进化：通往太空怪兽之路》现已开放观看',
      ],
    },
    en: {
      search: 'Search',
      menu: 'Menu',
      langAria: 'Change language',
      navHome: 'Home',
      navRank: 'Ranking',
      navNovel: 'Novels',
      navManga: 'Comics',
      navAnime: 'Anime',
      navShelf: 'Library',
      mypage: 'My page',
      vip: 'VIP',
      myShelf: 'My library',
      news: 'News',
      faq: 'FAQ',
      contact: 'Support',
      logout: 'Log out',
      register: 'Sign up',
      login: 'Log in',
      close: 'Close',
      closeMenu: 'Close menu',
      searchPh: 'Search by title, author, or tag',
      recentSearch: 'Recent',
      hotSearch: 'Popular',
      hotKeywords: 'Keywords',
      clearAll: 'Clear all',
      removeSearch: 'Remove',
      searchEmpty: 'No results found.',
      noticeLabel: 'News',
      footerCopy: 'All webcomics published by COMICSN are protected by copyright law. Any illegal copying will result in immediate legal action. Attribution does not excuse copyright infringement.',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
      rankManga: '📖 Comic Ranking',
      rankNovel: '✨ Novel Ranking',
      rankAnime: '🌠 Anime Ranking',
      completed: '🎆 Completed',
      moreReco: '🔆 More for you',
      seeAll: 'See All',
      hotCats: 'Popular categories',
      weekReco: 'This week',
      catAll: 'All',
      catKorean: 'Manhwa',
      catJapanese: 'Manga',
      catSchool: 'School',
      catBl: 'BL',
      catFantasy: 'Fantasy',
      catRomance: 'Romance',
      catAction: 'Action',
      catSciFi: 'Sci-fi',
      catComedy: 'Comedy',
      catSlice: 'Slice of life',
      tabUpdating: 'Ongoing',
      tabEnded: 'Completed',
      tabVip: 'VIP only',
      tabFree: 'Free',
      sortPop: 'Sort by popularity',
      sortViews: 'Most viewed',
      sortPlays: 'Most played',
      sortLatest: 'Newest',
      periodWeekly: 'Weekly',
      periodMonthly: 'Monthly',
      periodQuarterly: 'Quarterly',
      periodYearly: 'Yearly',
      shelfRecent: 'History',
      shelfFav: 'Favorites',
      shelfVip: 'Liked',
      searchWorks: 'Search titles',
      emptyRecommend: 'No picks yet',
      emptyManga: 'No comics',
      emptyNovel: 'No novels',
      emptyAnime: 'No anime',
      emptyShelfLead: 'Nothing here yet. ',
      emptyShelfGo: 'Go watch now',
      emptyHistory: 'No membership records',
      plays: 'plays',
      viewsTimes: 'views',
      published: 'Published',
      details: 'Details',
      keywords: 'Keywords',
      relatedComics: 'Related comics',
      relatedBooks: 'Related books',
      relatedAnime: 'You may also like',
      unlockAll: 'Unlock all',
      latestCh: 'Latest',
      toc: 'Contents',
      sortAsc: 'Oldest first',
      sortDesc: 'Newest first',
      freeRead: 'Read chapter 1 free >',
      freeWatch: 'Watch episode 1 free >',
      continueVip: 'Go VIP to keep watching',
      goVip: 'Get VIP',
      myFavorites: 'Favorites',
      vipSub: 'Liked',
      keepReading: 'Continue',
      vipMember: 'VIP membership',
      vipNone: 'Inactive',
      vipExpireNone: 'Not subscribed',
      spentPrefix: 'Total spent',
      progressNext: '¥{n} more to reach {name}',
      progressMax: 'Highest tier reached',
      rechargeVip: 'Get VIP',
      packWeek: '1 week',
      packMonth: '1 month',
      packQuarter: '3 months',
      packYear: '1 year',
      days7: '7 days',
      days30: '30 days',
      days90: '90 days',
      days365: '365 days',
      tierBronze: 'Bronze',
      tierSilver: 'Silver',
      tierGold: 'Gold',
      tierPlatinum: 'Platinum',
      tierDiamond: 'Diamond',
      orders: 'Membership history',
      settings: 'Settings',
      nsfwContent: 'NSFW content',
      nsfwHint: 'Synced with the header switch. Turn on to show adult titles.',
      notify: 'Update alerts',
      notifyHint: 'Notify me when favorited titles get new chapters',
      deleteAccount: 'Delete account',
      confirmPay: 'Confirm purchase',
      payMethod: 'Payment method',
      wechatPay: 'WeChat Pay',
      wechatPayHint: 'Pay securely with WeChat',
      alipay: 'Alipay',
      alipayHint: 'Pay quickly with Alipay',
      cancel: 'Cancel',
      confirm: 'Confirm',
      payNow: 'Pay now',
      deleteSelected: 'Delete the selected titles?',
      adKicker: 'Campaign',
      adTitle: 'Pick the genres you love',
      adP1: 'Browse school, fantasy, romance, action and more. Choose a genre and we’ll recommend titles fans like you are reading.',
      adP2: 'Head to Comics and start browsing now.',
      adCta: 'Browse comics',
      contactTitle: 'Support',
      termsTitle: 'Terms of Service',
      privacyTitle: 'Privacy Policy',
      siteOfficial: 'Website',
      serviceHours: 'Hours',
      serviceHoursVal: 'Mon–Fri 10:00–18:00 (holidays excluded)',
      contactIntro: 'For account, billing, copyright, or content issues, contact us during business hours and we’ll get back to you as soon as we can.',
      contactProvide: 'Please include',
      contactLi1: 'Your account or phone number',
      contactLi2: 'When it happened, plus the page or title',
      contactLi3: 'Screenshots or an order ID for billing issues',
      phoneSmsLogin: 'SMS login',
      accountLogin: 'Password login',
      phoneRegister: 'Phone sign-up',
      accountRegister: 'Password sign-up',
      registerAccount: 'Create account',
      phone: 'Phone',
      code: 'Code',
      setPassword: 'Set password',
      account: 'Account',
      password: 'Password',
      confirmPassword: 'Confirm password',
      forgotPassword: 'Forgot password',
      getCode: 'Send code',
      phonePh: '11-digit mobile number',
      codePh: 'Enter the code',
      passwordPh: 'At least 6 characters',
      usernamePh: 'Enter your account',
      enterPasswordPh: 'Enter your password',
      confirmPasswordPh: 'Enter password again',
      noAccount: 'No account?',
      goRegister: 'Sign up',
      hasAccount: 'Already have an account?',
      goLogin: 'Log in',
      resetTitle: 'Reset password',
      bindPhonePh: 'Phone number on the account',
      newPassword: 'New password',
      newPasswordPh: 'At least 6 characters',
      confirmNewPassword: 'Confirm new password',
      confirmNewPasswordPh: 'Enter new password again',
      confirmReset: 'Reset password',
      rememberPassword: 'Remembered it?',
      errPhone: 'Enter a valid 11-digit mobile number',
      errCode: 'Incorrect verification code',
      errPassword: 'Password must be at least 6 characters',
      errPasswordNew: 'New password must be at least 6 characters',
      errMismatch: 'Passwords do not match',
      errLogin: 'Incorrect account or password',
      errUsername: 'Account must be 4–20 characters and start with a letter',
      codeSent: 'Code sent',
      retryIn: 's retry',
      exclusive: 'Exclusive',
      updatedOn: 'Updated',
      members: 'Members',
      membership: 'Membership',
      share: 'Share',
      bookmark: 'Bookmark',
      like: 'Like',
      relatedVideos: 'Related videos',
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
      selectedSeries: '{n} selected',
      validUntilPrefix: 'Active until',
      orderNo: 'Order ID',
      validPeriod: 'Validity',
      openedAt: 'Activated',
      source: 'Source',
      notifyOn: 'Update alerts on',
      notifyOff: 'Update alerts off',
      logoutConfirm: 'Log out of this account?',
      deleteConfirm: 'Deleting your account also clears library, VIP, and membership history. Continue?',
      logoutAction: 'Log out',
      deleteAction: 'Delete',
      paidVia: 'VIP {plan} activated via {pay}{tier}',
      currentTier: ', now {name}',
      validDaysTo: '{n} days (until {date})',
      payPlanLine: 'VIP {label} · {days} days',
      lockFromEp: 'Episode {n} and later are VIP only. Subscribe to keep watching.',
      groupN: 'Group {n}',
      vipBronzeLabel: 'VIP Bronze',
      promoAlt: 'VIP offer',
      hashNovel: '#Novel',
      hashManga: '#Comics',
      firstEp: 'Episode 1',
      detailsEndedTpl: '{title} is complete ({ep}). A {tags} story you can binge in one go.',
      detailsUpdatingTpl: '{title} is ongoing through {ep}. A {tags} story still updating.',
      animeBlurbTpl: '{title} the anime, produced by {author}, now through episode {n}.',
      sortAscAria: 'Oldest first. Tap for newest first',
      sortDescAria: 'Newest first. Tap for oldest first',
      wechatShort: 'W',
      alipayShort: 'A',
      hotMom: 'Mom',
      hotSister: 'Sister',
      hotSecret: 'Secret',
      hotClass: 'Secret class',
      hotMother: 'Mother',
      hotLove: 'Love',
      hotTeacher: 'Teacher',
      hotHole: 'Hole',
      hotDella: 'Della',
      kwCougar: '#Cougar',
      kwCartoon: '#Cartoon',
      kwCollege: '#College',
      kwPower: '#Special ability',
      kwOutdoor: '#Outdoors',
      kwHardcore: '#Hardcore',
      kwSwap: '#Role swap',
      noticeAria: 'Latest news',
      shelfAria: 'Library',
      rankAria: 'Rankings',
      periodAria: 'Ranking period',
      sortAria: 'Sort',
      workTypeAria: 'Title type',
      accountAria: 'Account',
      vipLevelAria: 'VIP tier',
      shortcutsAria: 'Shortcuts',
      accountContentAria: 'Account',
      chapterList: 'Chapters',
      breadcrumb: 'Breadcrumb',
      mangaFilter: 'Comic filters',
      novelFilter: 'Novel filters',
      animeFilter: 'Anime filters',
      bannerPrev: 'Previous',
      bannerNext: 'Next',
      play: 'Play',
      playPause: 'Play/Pause',
      fullscreen: 'Full screen',
      progressAria: 'Playback',
      deleteAria: 'Delete',
      deleteSelectedAria: 'Delete selected',
      docNews: 'News - COMICSN',
      docFaq: 'FAQ - COMICSN',
      docHome: 'COMICSN',
      docManga: 'Comics - COMICSN',
      docNovel: 'Novels - COMICSN',
      docAnime: 'Anime - COMICSN',
      docRank: 'Ranking - COMICSN',
      docShelf: 'Library - COMICSN',
      docMypage: 'My page - COMICSN',
      docTerms: 'Terms of Service - COMICSN',
      docPrivacy: 'Privacy Policy - COMICSN',
      docContact: 'Support - COMICSN',
      docAd: 'Pick the genres you love - COMICSN',
      notices: [
        'VIP sale is live: unlock episode 7 and later with a membership',
        'Bully’s Love Story anime is now updated to episode 12',
        'New title: Evolution: Road to Space Monster is now available',
      ],
    },
    pt: {
      search: 'Pesquisar',
      menu: 'Menu',
      langAria: 'Mudar idioma',
      navHome: 'Início',
      navRank: 'Ranking',
      navNovel: 'Novels',
      navManga: 'HQs',
      navAnime: 'Anime',
      navShelf: 'Estante',
      mypage: 'Minha página',
      vip: 'VIP',
      myShelf: 'Minha estante',
      news: 'Novidades',
      faq: 'FAQ',
      contact: 'Suporte',
      logout: 'Sair',
      register: 'Cadastrar',
      login: 'Entrar',
      close: 'Fechar',
      closeMenu: 'Fechar menu',
      searchPh: 'Buscar por título, autor ou tag',
      recentSearch: 'Recentes',
      hotSearch: 'Populares',
      hotKeywords: 'Palavras-chave',
      clearAll: 'Limpar tudo',
      removeSearch: 'Remover',
      searchEmpty: 'Nenhum resultado.',
      noticeLabel: 'Aviso',
      footerCopy: 'Todas as webcomics publicadas pela COMICSN são protegidas por direitos autorais. Qualquer cópia ilegal resultará em ação legal imediata. A atribuição não isenta a infração.',
      terms: 'Termos de serviço',
      privacy: 'Política de privacidade',
      rankManga: '📖 Ranking de HQs',
      rankNovel: '✨ Ranking de novels',
      rankAnime: '🌠 Ranking de animes',
      completed: '🎆 Concluídos',
      moreReco: '🔆 Mais para você',
      seeAll: 'Ver tudo',
      hotCats: 'Categorias populares',
      weekReco: 'Destaques da semana',
      catAll: 'Tudo',
      catKorean: 'Manhwa',
      catJapanese: 'Mangá',
      catSchool: 'Escola',
      catBl: 'BL',
      catFantasy: 'Fantasia',
      catRomance: 'Romance',
      catAction: 'Ação',
      catSciFi: 'Ficção',
      catComedy: 'Comédia',
      catSlice: 'Cotidiano',
      tabUpdating: 'Em andamento',
      tabEnded: 'Concluído',
      tabVip: 'Só VIP',
      tabFree: 'Grátis',
      sortPop: 'Por popularidade',
      sortViews: 'Mais vistos',
      sortPlays: 'Mais assistidos',
      sortLatest: 'Mais novos',
      periodWeekly: 'Semanal',
      periodMonthly: 'Mensal',
      periodQuarterly: 'Trimestral',
      periodYearly: 'Anual',
      shelfRecent: 'Histórico',
      shelfFav: 'Favoritos',
      shelfVip: 'Curtidos',
      searchWorks: 'Buscar títulos',
      emptyRecommend: 'Sem destaques',
      emptyManga: 'Sem HQs',
      emptyNovel: 'Sem novels',
      emptyAnime: 'Sem animes',
      emptyShelfLead: 'Nada por aqui. ',
      emptyShelfGo: 'Assista agora',
      emptyHistory: 'Sem registros de assinatura',
      plays: 'plays',
      viewsTimes: 'visualizações',
      published: 'Publicado',
      details: 'Detalhes',
      keywords: 'Palavras-chave',
      relatedComics: 'HQs relacionadas',
      relatedBooks: 'Livros relacionados',
      relatedAnime: 'Você também pode gostar',
      unlockAll: 'Desbloquear tudo',
      latestCh: 'Mais recentes',
      toc: 'Índice',
      sortAsc: 'Mais antigos',
      sortDesc: 'Mais novos',
      freeRead: 'Ler cap. 1 grátis >',
      freeWatch: 'Assistir ep. 1 grátis >',
      continueVip: 'Assine o VIP para continuar',
      goVip: 'Assinar VIP',
      myFavorites: 'Favoritos',
      vipSub: 'Curtidos',
      keepReading: 'Continuar',
      vipMember: 'Assinatura VIP',
      vipNone: 'Inativo',
      vipExpireNone: 'Sem assinatura',
      spentPrefix: 'Total gasto',
      progressNext: 'Faltam ¥{n} para {name}',
      progressMax: 'Nível máximo',
      rechargeVip: 'Assinar VIP',
      packWeek: '1 semana',
      packMonth: '1 mês',
      packQuarter: '3 meses',
      packYear: '1 ano',
      days7: '7 dias',
      days30: '30 dias',
      days90: '90 dias',
      days365: '365 dias',
      tierBronze: 'Bronze',
      tierSilver: 'Prata',
      tierGold: 'Ouro',
      tierPlatinum: 'Platina',
      tierDiamond: 'Diamante',
      orders: 'Histórico da assinatura',
      settings: 'Ajustes',
      nsfwContent: 'Conteúdo NSFW',
      nsfwHint: 'Sincronizado com o interruptor do cabeçalho. Ative para ver títulos adultos.',
      notify: 'Alertas de atualização',
      notifyHint: 'Avisar quando títulos favoritos ganharem capítulos',
      deleteAccount: 'Excluir conta',
      confirmPay: 'Confirmar compra',
      payMethod: 'Forma de pagamento',
      wechatPay: 'WeChat Pay',
      wechatPayHint: 'Pague com segurança no WeChat',
      alipay: 'Alipay',
      alipayHint: 'Pague rapidamente com Alipay',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      payNow: 'Pagar agora',
      deleteSelected: 'Excluir os títulos selecionados?',
      adKicker: 'Campanha',
      adTitle: 'Escolha os gêneros que você ama',
      adP1: 'Escola, fantasia, romance, ação e mais. Escolha um gênero e recomendamos títulos que fãs como você estão lendo.',
      adP2: 'Entre em HQs e comece a explorar.',
      adCta: 'Ver HQs',
      contactTitle: 'Suporte',
      termsTitle: 'Termos de serviço',
      privacyTitle: 'Política de privacidade',
      siteOfficial: 'Site',
      serviceHours: 'Horário',
      serviceHoursVal: 'Seg–sex 10:00–18:00 (exceto feriados)',
      contactIntro: 'Para conta, pagamentos, direitos autorais ou conteúdo, fale conosco no horário comercial.',
      contactProvide: 'Inclua se possível',
      contactLi1: 'Conta ou telefone cadastrado',
      contactLi2: 'Quando ocorreu, página ou título',
      contactLi3: 'Prints ou número do pedido',
      phoneSmsLogin: 'Login por SMS',
      accountLogin: 'Login com senha',
      phoneRegister: 'Cadastro por telefone',
      accountRegister: 'Cadastro com senha',
      registerAccount: 'Criar conta',
      phone: 'Telefone',
      code: 'Código',
      setPassword: 'Definir senha',
      account: 'Conta',
      password: 'Senha',
      confirmPassword: 'Confirmar senha',
      forgotPassword: 'Esqueci a senha',
      getCode: 'Enviar código',
      phonePh: 'Celular com 11 dígitos',
      codePh: 'Digite o código',
      passwordPh: 'Pelo menos 6 caracteres',
      usernamePh: 'Digite a conta',
      enterPasswordPh: 'Digite a senha',
      confirmPasswordPh: 'Digite a senha de novo',
      noAccount: 'Não tem conta?',
      goRegister: 'Cadastrar',
      hasAccount: 'Já tem conta?',
      goLogin: 'Entrar',
      resetTitle: 'Redefinir senha',
      bindPhonePh: 'Telefone da conta',
      newPassword: 'Nova senha',
      newPasswordPh: 'Pelo menos 6 caracteres',
      confirmNewPassword: 'Confirmar nova senha',
      confirmNewPasswordPh: 'Digite a nova senha de novo',
      confirmReset: 'Redefinir senha',
      rememberPassword: 'Lembrou a senha?',
      errPhone: 'Digite um celular válido de 11 dígitos',
      errCode: 'Código incorreto',
      errPassword: 'A senha deve ter pelo menos 6 caracteres',
      errPasswordNew: 'A nova senha deve ter pelo menos 6 caracteres',
      errMismatch: 'As senhas não coincidem',
      errLogin: 'Conta ou senha incorreta',
      errUsername: 'A conta deve ter 4–20 caracteres e começar com letra',
      codeSent: 'Código enviado',
      retryIn: 's para reenviar',
      exclusive: 'Exclusivo',
      updatedOn: 'Atualizado',
      members: 'Membros',
      membership: 'Assinatura',
      share: 'Compartilhar',
      bookmark: 'Favoritar',
      like: 'Curtir',
      relatedVideos: 'Vídeos relacionados',
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
      selectedSeries: '{n} selecionado(s)',
      validUntilPrefix: 'Válido até',
      orderNo: 'Pedido',
      validPeriod: 'Validade',
      openedAt: 'Ativado em',
      source: 'Origem',
      notifyOn: 'Alertas ligados',
      notifyOff: 'Alertas desligados',
      logoutConfirm: 'Sair desta conta?',
      deleteConfirm: 'Excluir a conta também apaga estante, VIP e histórico. Continuar?',
      logoutAction: 'Sair',
      deleteAction: 'Excluir',
      paidVia: 'VIP {plan} ativado via {pay}{tier}',
      currentTier: ', agora {name}',
      validDaysTo: '{n} dias (até {date})',
      payPlanLine: 'VIP {label} · {days} dias',
      lockFromEp: 'Do episódio {n} em diante é VIP. Assine para continuar.',
      groupN: 'Grupo {n}',
      vipBronzeLabel: 'VIP Bronze',
      promoAlt: 'Oferta VIP',
      hashNovel: '#Novel',
      hashManga: '#HQs',
      firstEp: 'Episódio 1',
      detailsEndedTpl: '{title} está completo ({ep}). Uma história {tags} para ler de uma vez.',
      detailsUpdatingTpl: '{title} segue até {ep}. Uma história {tags} em atualização.',
      animeBlurbTpl: '{title} em anime, produção de {author}, agora no episódio {n}.',
      sortAscAria: 'Mais antigos. Toque para inverter',
      sortDescAria: 'Mais novos. Toque para inverter',
      wechatShort: 'W',
      alipayShort: 'A',
      hotMom: 'Mãe',
      hotSister: 'Irmã',
      hotSecret: 'Segredo',
      hotClass: 'Turma secreta',
      hotMother: 'Mamãe',
      hotLove: 'Amor',
      hotTeacher: 'Professor',
      hotHole: 'Buraco',
      hotDella: 'Della',
      kwCougar: '#Cougar',
      kwCartoon: '#Desenho',
      kwCollege: '#Faculdade',
      kwPower: '#Poder especial',
      kwOutdoor: '#Ar livre',
      kwHardcore: '#Hardcore',
      kwSwap: '#Troca de papéis',
      noticeAria: 'Últimas notícias',
      shelfAria: 'Estante',
      rankAria: 'Rankings',
      periodAria: 'Período',
      sortAria: 'Ordenar',
      workTypeAria: 'Tipo',
      accountAria: 'Conta',
      vipLevelAria: 'Nível VIP',
      shortcutsAria: 'Atalhos',
      accountContentAria: 'Conta',
      chapterList: 'Capítulos',
      breadcrumb: 'Navegação',
      mangaFilter: 'Filtros de HQs',
      novelFilter: 'Filtros de novels',
      animeFilter: 'Filtros de anime',
      bannerPrev: 'Anterior',
      bannerNext: 'Próximo',
      play: 'Reproduzir',
      playPause: 'Reproduzir/Pausar',
      fullscreen: 'Tela cheia',
      progressAria: 'Progresso',
      deleteAria: 'Excluir',
      deleteSelectedAria: 'Excluir seleção',
      docNews: 'Novidades - COMICSN',
      docFaq: 'FAQ - COMICSN',
      docHome: 'COMICSN',
      docManga: 'HQs - COMICSN',
      docNovel: 'Novels - COMICSN',
      docAnime: 'Anime - COMICSN',
      docRank: 'Ranking - COMICSN',
      docShelf: 'Estante - COMICSN',
      docMypage: 'Minha página - COMICSN',
      docTerms: 'Termos de serviço - COMICSN',
      docPrivacy: 'Política de privacidade - COMICSN',
      docContact: 'Suporte - COMICSN',
      docAd: 'Escolha os gêneros que você ama - COMICSN',
      notices: [
        'Promoção VIP: desbloqueie o episódio 7 em diante com a assinatura',
        'O anime Bully’s Love Story foi atualizado até o episódio 12',
        'Novidade: Evolution: Road to Space Monster já está disponível',
      ],
    },
  };

  function getLang() {
    const stored = localStorage.getItem(LANG_KEY);
    return stored === 'en' || stored === 'pt' ? stored : 'zh';
  }

  function dict() {
    return I18N[getLang()] || I18N.zh;
  }

  function t(key) {
    const copy = dict();
    return copy[key] != null ? copy[key] : (I18N.zh[key] != null ? I18N.zh[key] : '');
  }

  function applyDomI18n(copy) {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const val = copy[el.dataset.i18n];
      if (val == null) return;
      el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const val = copy[el.dataset.i18nPlaceholder];
      if (val) el.setAttribute('placeholder', val);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      const val = copy[el.dataset.i18nAria];
      if (val) el.setAttribute('aria-label', val);
    });
    document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
      const val = copy[el.dataset.i18nAlt];
      if (val) el.setAttribute('alt', val);
    });
    document.querySelectorAll('[data-lang-block]').forEach((el) => {
      el.hidden = el.dataset.langBlock !== getLang();
    });
    const docKey = document.body && document.body.dataset.i18nDoc;
    if (docKey && copy[docKey]) document.title = copy[docKey];

    document.querySelectorAll('#mangaSortLabel, #novelSortLabel, #animeSortLabel, #rankingPeriodLabel, #bookshelfSortLabel').forEach((label) => {
      const wrap = label.closest('.manga-sort, .anime-sort, .ranking-period, .bookshelf-sort');
      const active = wrap && wrap.querySelector('.is-active[data-sort], .is-active[role="option"]');
      if (active) label.textContent = active.textContent.trim();
    });
  }

  function applyAuthCopy() {
    const copy = dict();
    const modal = document.getElementById('authModal');
    if (modal && typeof modal.applyLang === 'function') modal.applyLang(copy);
    const reset = document.getElementById('authResetModal');
    if (reset && typeof reset.applyLang === 'function') reset.applyLang(copy);
  }

  function applyLang() {
    const lang = getLang();
    const copy = dict();
    const meta = LANG_META[lang];
    document.documentElement.lang = meta.htmlLang;

    const label = document.getElementById('langSwitchLabel');
    if (label) label.textContent = meta.label;

    document.querySelectorAll('.lang-switch-option').forEach((opt) => {
      const on = opt.dataset.lang === lang;
      opt.classList.toggle('is-active', on);
      opt.setAttribute('aria-selected', String(on));
    });

    const searchBtn = document.getElementById('searchButton');
    const menuBtn = document.getElementById('menuButton');
    const langBtn = document.getElementById('langSwitchBtn');
    searchBtn?.setAttribute('aria-label', copy.search);
    menuBtn?.setAttribute('aria-label', copy.menu);
    langBtn?.setAttribute('aria-label', copy.langAria);
    document.querySelector('.menu-drawer')?.setAttribute('aria-label', copy.menu);
    document.getElementById('menuClose')?.setAttribute('aria-label', copy.closeMenu);
    document.getElementById('searchOverlay')?.querySelector('.search-panel')?.setAttribute('aria-label', copy.search);

    applyDomI18n(copy);
    applyAuthCopy();
    applyHomeTitles();
    applyBannerDots(copy);
    renderNotices(copy);
    window.dispatchEvent(new CustomEvent('comicsn:langchange', { detail: { lang } }));
  }

  function applyHomeTitles() {
    const loc = window.ComicsShared && window.ComicsShared.localizedTitle;
    const epLabel = window.ComicsShared && window.ComicsShared.epLabel;
    if (!loc) return;
    document.querySelectorAll('[data-title-id]').forEach((el) => {
      const title = loc({ id: el.dataset.titleId, title: el.textContent });
      el.textContent = title;
      const card = el.closest('a');
      const img = card && card.querySelector('.comic-thumb img');
      if (img) img.alt = title;
      const epEl = card && card.querySelector('.comic-meta .ep');
      if (epEl && epLabel) {
        const raw = epEl.textContent.trim();
        const num = (raw.match(/(\d+)/) || [])[1];
        if (num) {
          const isCh = /ch\.|章|cap\./i.test(raw);
          epEl.textContent = epLabel(num, isCh ? 'novel' : 'comic');
        }
      }
    });
  }

  function applyBannerDots(copy) {
    document.querySelectorAll('#bannerPagination .dot').forEach((dot, i) => {
      dot.setAttribute('aria-label', (copy.groupN || 'Group {n}').replace('{n}', String(i + 1)));
    });
  }

  function renderNotices(copy) {
    const track = document.getElementById('noticeTrack');
    if (!track) return;
    const items = copy.notices || [];
    const html = items.map((text) => `<span class="notice-bar-item">${text}</span>`).join('');
    track.innerHTML = html + html;
    const label = document.querySelector('.notice-bar-label');
    if (label) label.textContent = copy.noticeLabel || '公告';
    document.querySelector('.notice-bar')?.setAttribute('aria-label', copy.noticeLabel || '公告');
  }

  function closeLangSwitch() {
    const wrap = document.getElementById('langSwitch');
    const btn = document.getElementById('langSwitchBtn');
    wrap?.classList.remove('is-open');
    btn?.setAttribute('aria-expanded', 'false');
  }

  function isMobile() {
    return window.matchMedia(MOBILE_BREAKPOINT).matches;
  }

  function initBannerCarousel() {
    const track = document.getElementById('bannerTrack');
    const carousel = document.getElementById('bannerCarousel');
    const slides = track ? [...track.querySelectorAll('.banner-slide')] : [];
    const prevBtn = document.getElementById('bannerPrev');
    const nextBtn = document.getElementById('bannerNext');

    if (!slides.length || !track || !carousel) return;

    let current = 0;
    let autoplayTimer = null;
    const gap = 10;
    const pagination = document.getElementById('bannerPagination');

    function getSlideMetrics() {
      const containerWidth = carousel.offsetWidth;
      const visibleCount = isMobile() ? 1 : 3;
      const slideGap = isMobile() ? 0 : gap;
      const slideWidth = (containerWidth - slideGap * (visibleCount - 1)) / visibleCount;
      return { slideWidth, visibleCount, slideGap };
    }

    function pageCount(visibleCount) {
      return Math.max(1, Math.ceil(slides.length / visibleCount));
    }

    function syncDots(pages) {
      if (!pagination) return;
      if (pagination.dataset.pages !== String(pages)) {
        pagination.dataset.pages = String(pages);
        pagination.innerHTML = Array.from({ length: pages }, (_, i) =>
          `<button type="button" class="dot${i === current ? ' active' : ''}" aria-label="${t('groupN').replace('{n}', String(i + 1))}"></button>`
        ).join('');
        [...pagination.querySelectorAll('.dot')].forEach((dot, i) => {
          dot.addEventListener('click', () => goTo(i));
        });
        return;
      }
      [...pagination.querySelectorAll('.dot')].forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    function updateSlides() {
      const { slideWidth, visibleCount, slideGap } = getSlideMetrics();
      const pages = pageCount(visibleCount);
      current = ((current % pages) + pages) % pages;
      const startIndex = current * visibleCount;
      const step = slideWidth + slideGap;

      slides.forEach((slide) => {
        slide.style.flexBasis = `${slideWidth}px`;
        slide.style.width = `${slideWidth}px`;
      });

      track.style.gap = `${slideGap}px`;
      track.style.transform = `translateX(-${startIndex * step}px)`;
      syncDots(pages);
    }

    function goTo(index) {
      current = index;
      updateSlides();
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    let touchStartX = 0;
    let touchDeltaX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchDeltaX = 0;
      stopAutoplay();
    }, { passive: true });

    carousel.addEventListener('touchmove', (e) => {
      touchDeltaX = e.touches[0].clientX - touchStartX;
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
      if (Math.abs(touchDeltaX) > 40) {
        goTo(touchDeltaX < 0 ? current + 1 : current - 1);
      }
      startAutoplay();
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateSlides, 100);
    });

    updateSlides();
    startAutoplay();
  }

  function initNsfwToggle() {
    const toggle = document.getElementById('nsfwToggle');
    const switchImg = document.getElementById('nsfwSwitchImg');
    const floating = document.getElementById('floatingNsfw');
    const floatingLabel = floating?.querySelector('.floating-nsfw-label');
    const NSFW_KEY = 'comicsn-nsfw';

    if (!toggle || !switchImg) return;

    const icons = {
      off: 'assets/nsfw_btn_off.svg',
      on: 'assets/nsfw_btn_on.svg',
    };

    let isOn = localStorage.getItem(NSFW_KEY) === '1';

    function updateNsfw() {
      switchImg.src = isOn ? icons.on : icons.off;
      toggle.setAttribute('aria-pressed', String(isOn));
      localStorage.setItem(NSFW_KEY, isOn ? '1' : '0');
      if (floatingLabel) {
        floatingLabel.textContent = isOn ? 'NSFW ON' : 'NSFW OFF';
      }
      floating?.classList.toggle('is-on', isOn);
    }

    function handleToggle() {
      isOn = !isOn;
      updateNsfw();
    }

    updateNsfw();

    toggle.addEventListener('click', handleToggle);
    floating?.addEventListener('click', handleToggle);
  }

  function initSearchModal() {
    const searchBtn = document.getElementById('searchButton');
    const overlay = document.getElementById('searchOverlay');
    const panel = overlay?.querySelector('.search-panel');
    const input = document.getElementById('searchInput');
    const clearBtn = document.getElementById('searchClearRecent');
    const recentList = document.getElementById('searchRecentList');
    const resultList = document.getElementById('searchResultList');
    const emptyEl = document.getElementById('searchEmpty');

    if (!searchBtn || !overlay || !panel) return;

    const RECENT_KEY = 'comicsn-recent-search';
    const RECENT_LIMIT = 10;
    const RESULT_LIMIT = 20;
    let saveTimer;

    function escapeText(str) {
      const shared = window.ComicsShared;
      if (shared && shared.escapeHtml) return shared.escapeHtml(str);
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function loadRecent() {
      try {
        const raw = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
        return Array.isArray(raw)
          ? raw.map((item) => String(item || '').trim()).filter(Boolean)
          : [];
      } catch (err) {
        return [];
      }
    }

    function saveRecent(term) {
      const q = String(term || '').trim();
      if (!q) return;
      const next = [q, ...loadRecent().filter((item) => item.toLowerCase() !== q.toLowerCase())]
        .slice(0, RECENT_LIMIT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    }

    function removeRecent(term) {
      const q = String(term || '').trim();
      const next = loadRecent().filter((item) => item !== q);
      if (next.length) localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      else localStorage.removeItem(RECENT_KEY);
    }

    function scheduleSave(term) {
      clearTimeout(saveTimer);
      const q = String(term || '').trim();
      if (!q) return;
      saveTimer = setTimeout(() => saveRecent(q), 500);
    }

    function escapeRegExp(str) {
      return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function highlightText(text, query) {
      const raw = String(text || '');
      const q = String(query || '').trim();
      if (!q) return escapeText(raw);
      const re = new RegExp(escapeRegExp(q), 'ig');
      let last = 0;
      let out = '';
      raw.replace(re, (match, offset) => {
        out += escapeText(raw.slice(last, offset));
        out += `<em class="search-hit">${escapeText(match)}</em>`;
        last = offset + match.length;
        return match;
      });
      out += escapeText(raw.slice(last));
      return out;
    }

    function workTags(item) {
      const shared = window.ComicsShared || {};
      const phrase = (tag) => (shared.localizedPhrase ? shared.localizedPhrase(tag) : tag);
      if (item.kind === 'anime') return (item.tags || []).map(phrase);
      if (shared.keywordsOf) return shared.keywordsOf(item);
      return (item.categories || []).map((cat) => (shared.catLabel ? shared.catLabel(cat) : cat));
    }

    function workThumb(item) {
      const shared = window.ComicsShared || {};
      if (item.poster) return item.poster;
      const list = item.kind === 'novel' ? shared.NOVELS : shared.COMICS;
      if (shared.coverOf) return shared.coverOf(item, list || []);
      return 'assets/comics/thumb-1.webp';
    }

    function kindLabel(kind) {
      if (kind === 'novel') return t('navNovel');
      if (kind === 'anime') return t('navAnime');
      return t('navManga');
    }

    function workHref(kind, id) {
      if (kind === 'novel') return `novel-detail.html?id=${encodeURIComponent(id)}`;
      if (kind === 'anime') return `anime-watch.html?id=${encodeURIComponent(id)}`;
      return `comic.html?id=${encodeURIComponent(id)}`;
    }

    function catalogWorks() {
      const shared = window.ComicsShared || {};
      const comics = (shared.COMICS || []).map((item) => Object.assign({}, item, { kind: 'comic' }));
      const novels = (shared.NOVELS || []).map((item) => Object.assign({}, item, { kind: 'novel' }));
      const anime = (shared.ANIMATIONS || []).map((item) => Object.assign({}, item, { kind: 'anime' }));
      return comics.concat(novels, anime);
    }

    function workText(item) {
      const shared = window.ComicsShared || {};
      const title = shared.localizedTitle ? shared.localizedTitle(item) : item.title;
      const cats = (item.categories || []).map((cat) => (shared.catLabel ? shared.catLabel(cat) : cat)).join(' ');
      const tags = workTags(item).join(' ');
      const rawTags = (item.tags || []).join(' ');
      return [item.id, item.title, title, item.author, cats, tags, rawTags].filter(Boolean).join(' ').toLowerCase();
    }

    function searchWorks(query) {
      const q = query.trim().toLowerCase();
      if (!q) return [];
      return catalogWorks()
        .filter((item) => workText(item).indexOf(q) !== -1)
        .slice(0, RESULT_LIMIT);
    }

    function limitRecentRows() {
      if (!recentList || recentList.hidden) return;
      const items = Array.prototype.slice.call(recentList.children);
      items.forEach((li) => { li.hidden = true; });
      items.forEach((li) => {
        li.hidden = false;
        const visible = items.filter((item) => !item.hidden);
        const tops = [];
        visible.forEach((item) => {
          const top = Math.round(item.offsetTop);
          if (tops.indexOf(top) === -1) tops.push(top);
        });
        if (tops.length > 2) li.hidden = true;
      });
    }

    function scheduleLimitRecentRows() {
      requestAnimationFrame(() => {
        requestAnimationFrame(limitRecentRows);
      });
    }

    function renderPanel() {
      if (!recentList || !resultList || !emptyEl) return;
      const q = (input && input.value.trim()) || '';
      const recents = loadRecent();
      const searching = !!q;
      const inputWrap = input && input.closest('.search-input-wrap');
      const closeBtn = document.getElementById('searchInputClose');
      const recentHead = document.getElementById('searchRecentHead');
      const browse = document.getElementById('searchBrowse');
      if (clearBtn) clearBtn.hidden = searching || !recents.length;
      if (inputWrap) inputWrap.classList.toggle('is-query', searching);
      overlay.classList.toggle('is-searching', searching);
      if (closeBtn) closeBtn.hidden = !searching;
      if (recentHead) recentHead.hidden = searching;
      if (browse) browse.hidden = searching;

      if (!q) {
        resultList.hidden = true;
        resultList.innerHTML = '';
        emptyEl.hidden = true;
        recentList.hidden = recents.length === 0;
        recentList.innerHTML = recents.map((term) => (
          `<li>
            <span class="recent-search-chip">
              <button type="button" class="recent-search-item" data-term="${escapeText(term)}">${escapeText(term)}</button>
              <button type="button" class="recent-search-remove" data-term="${escapeText(term)}" aria-label="${escapeText(t('removeSearch'))} ${escapeText(term)}">×</button>
            </span>
          </li>`
        )).join('');
        scheduleLimitRecentRows();
        return;
      }

      recentList.hidden = true;
      recentList.innerHTML = '';
      const hits = searchWorks(q);
      if (!hits.length) {
        resultList.hidden = true;
        resultList.innerHTML = '';
        emptyEl.hidden = false;
        emptyEl.textContent = t('searchEmpty');
        return;
      }

      const shared = window.ComicsShared || {};
      emptyEl.hidden = true;
      resultList.hidden = false;
      resultList.innerHTML = hits.map((item) => {
        const title = shared.localizedTitle ? shared.localizedTitle(item) : item.title;
        const tags = workTags(item).slice(0, 4);
        const tagsHtml = tags.map((tag) => `#${highlightText(tag, q)}`).join(' ');
        return `
          <li>
            <a class="search-result-item" href="${workHref(item.kind, item.id)}">
              <img class="search-result-thumb" src="${escapeText(workThumb(item))}" alt="" loading="lazy">
              <span class="search-result-body">
                <span class="search-result-title">${highlightText(title, q)}</span>
                <span class="search-result-kind">${escapeText(kindLabel(item.kind))}</span>
                ${tagsHtml ? `<span class="search-result-tags">${tagsHtml}</span>` : ''}
              </span>
            </a>
          </li>
        `;
      }).join('');
    }

    function applyQuery(term, shouldSave) {
      const q = String(term || '').trim();
      if (input) {
        input.value = q;
        input.focus();
      }
      if (shouldSave && q) saveRecent(q);
      renderPanel();
    }

    function resetPanelPosition() {
      panel.style.top = '0';
      panel.style.left = '0';
      panel.style.right = 'auto';
      panel.style.width = '';
    }

    function positionSearchPanel() {
      resetPanelPosition();

      if (isMobile()) return;

      const rect = searchBtn.getBoundingClientRect();
      const left = Math.max(8, Math.min(
        rect.right - SEARCH_PANEL_WIDTH,
        window.innerWidth - SEARCH_PANEL_WIDTH - 8
      ));

      panel.style.left = `${left}px`;
      panel.style.width = `${SEARCH_PANEL_WIDTH}px`;
    }

    function openSearch() {
      closeLangSwitch();
      positionSearchPanel();
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      searchBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('search-open');
      renderPanel();
      setTimeout(() => input?.focus(), 100);
    }

    function closeSearch() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      searchBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('search-open');
    }

    searchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      overlay.classList.contains('is-open') ? closeSearch() : openSearch();
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeSearch();
    });

    panel.addEventListener('click', (e) => {
      e.stopPropagation();
      const remove = e.target.closest('.recent-search-remove');
      if (remove) {
        e.preventDefault();
        removeRecent(remove.dataset.term || '');
        renderPanel();
        return;
      }
      const recent = e.target.closest('.recent-search-item');
      if (recent) {
        applyQuery(recent.dataset.term || recent.textContent, true);
        return;
      }
      const result = e.target.closest('.search-result-item');
      if (result && input && input.value.trim()) saveRecent(input.value);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        closeSearch();
      }
    });

    window.addEventListener('resize', () => {
      if (overlay.classList.contains('is-open')) {
        positionSearchPanel();
        scheduleLimitRecentRows();
      }
    });

    clearBtn?.addEventListener('click', () => {
      localStorage.removeItem(RECENT_KEY);
      if (input) input.value = '';
      renderPanel();
      input?.focus();
    });

    document.getElementById('searchInputClose')?.addEventListener('click', () => {
      if (input) input.value = '';
      renderPanel();
      input?.focus();
    });

    input?.addEventListener('input', (e) => {
      if (e.isComposing) return;
      renderPanel();
      scheduleSave(input.value);
    });

    input?.addEventListener('compositionend', () => {
      renderPanel();
      scheduleSave(input.value);
    });

    input?.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      const q = input.value.trim();
      if (q) saveRecent(q);
      renderPanel();
    });

    overlay.querySelectorAll('.hot-search-list li, .keyword-tag').forEach((el) => {
      el.addEventListener('click', (e) => {
        const href = el.getAttribute('href');
        if (href && href !== '#') return;
        e.preventDefault();
        const text = (el.querySelector('.hot-text')?.textContent || el.textContent || '').replace(/^#/, '').trim();
        if (text) applyQuery(text, true);
      });
    });

    window.addEventListener('comicsn:langchange', () => {
      if (overlay.classList.contains('is-open')) renderPanel();
    });
  }

  function isHomePage() {
    const path = window.location.pathname;
    return path === '/' || path.endsWith('/') || /\/index\.html$/i.test(path);
  }

  function initLogoLink() {
    const logoLink = document.getElementById('logoLink');
    if (!logoLink) return;

    logoLink.addEventListener('click', (e) => {
      if (!isHomePage()) return;

      e.preventDefault();
      window.location.reload();
    });
  }

  function initSideMenu() {
    const menuBtn = document.getElementById('menuButton');
    const overlay = document.getElementById('menuOverlay');
    const closeBtn = document.getElementById('menuClose');

    if (!menuBtn || !overlay) return;

    function openMenu() {
      closeLangSwitch();
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    }

    function closeMenu() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }

    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      overlay.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    closeBtn?.addEventListener('click', closeMenu);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  function initAuth() {
    const AUTH_KEY = 'comicsn-logged-in';
    const guestHtml = `
      <div class="menu-auth-actions">
        <button type="button" class="menu-auth-btn" data-auth="register" data-i18n="register">注册</button>
        <button type="button" class="menu-auth-btn is-primary" data-auth="login" data-i18n="login">登录</button>
      </div>
    `;

    function isLoggedIn() {
      return localStorage.getItem(AUTH_KEY) !== '0';
    }

    function isMypage() {
      return /mypage\.html$/i.test(window.location.pathname);
    }

    function isProtectedHref(href) {
      if (!href) return false;
      try {
        return /mypage\.html$/i.test(new URL(href, window.location.href).pathname);
      } catch (err) {
        return href.indexOf('mypage.html') !== -1;
      }
    }

    function ensureMenuGuest(profile) {
      if (profile.querySelector('.menu-profile-out')) return;
      const loggedIn = document.createElement('div');
      loggedIn.className = 'menu-profile-in';
      while (profile.firstChild) loggedIn.appendChild(profile.firstChild);
      const loggedOut = document.createElement('div');
      loggedOut.className = 'menu-profile-out';
      loggedOut.innerHTML = guestHtml;
      profile.append(loggedIn, loggedOut);
    }

    function syncAuthUi() {
      const on = isLoggedIn();
      document.querySelectorAll('.menu-profile').forEach((profile) => {
        ensureMenuGuest(profile);
        profile.classList.toggle('is-guest', !on);
      });
      document.querySelectorAll('.menu-drawer').forEach((drawer) => {
        drawer.classList.toggle('is-guest', !on);
      });
      applyLang();
    }

    let pendingHref = '';

    function setLoggedIn(on) {
      localStorage.setItem(AUTH_KEY, on ? '1' : '0');
      syncAuthUi();
      if (!on) {
        pendingHref = '';
        if (isMypage()) window.location.href = './';
        return;
      }
      if (pendingHref) {
        const next = pendingHref;
        pendingHref = '';
        window.location.href = next;
        return;
      }
      if (isMypage()) window.location.reload();
    }

    function closeSideMenu() {
      const overlay = document.getElementById('menuOverlay');
      const menuBtn = document.getElementById('menuButton');
      overlay?.classList.remove('is-open');
      overlay?.setAttribute('aria-hidden', 'true');
      menuBtn?.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }

    function ensureAuthModal() {
      let modal = document.getElementById('authModal');
      if (modal) return modal;
      modal = document.createElement('div');
      modal.id = 'authModal';
      modal.className = 'auth-modal';
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML = `
        <div class="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="authModalTitle">
          <button type="button" class="auth-dialog-close" data-auth-close aria-label="关闭" data-i18n-aria="close">×</button>
          <h2 id="authModalTitle">登录</h2>
          <div class="auth-tabs" role="tablist">
            <button type="button" class="auth-tab is-active" role="tab" aria-selected="true" data-reg="phone">手机短信登录</button>
            <button type="button" class="auth-tab" role="tab" aria-selected="false" data-reg="account">账号密码登录</button>
          </div>
          <form class="auth-form" data-form="phone">
            <label><span data-i18n="phone">手机号</span>
              <input type="tel" name="phone" maxlength="11" placeholder="请输入11位手机号" data-i18n-placeholder="phonePh" autocomplete="tel" inputmode="numeric">
            </label>
            <label><span data-i18n="code">验证码</span>
              <div class="auth-code-row">
                <input type="text" name="code" maxlength="6" placeholder="请输入验证码" data-i18n-placeholder="codePh" inputmode="numeric" autocomplete="one-time-code">
                <button type="button" class="auth-code-btn" data-i18n="getCode">获取验证码</button>
              </div>
            </label>
            <label class="auth-register-only"><span data-i18n="setPassword">设置密码</span>
              <input type="password" name="password" placeholder="至少6位密码" data-i18n-placeholder="passwordPh" autocomplete="new-password">
            </label>
            <p class="auth-form-error" hidden></p>
            <button type="submit" class="auth-submit">登录</button>
          </form>
          <form class="auth-form" data-form="account" hidden>
            <label><span data-i18n="account">账号</span>
              <input type="text" name="username" maxlength="20" placeholder="请输入账号" data-i18n-placeholder="usernamePh" autocomplete="username">
            </label>
            <label><span data-i18n="password">密码</span>
              <input type="password" name="password" placeholder="请输入密码" data-i18n-placeholder="enterPasswordPh" autocomplete="current-password">
            </label>
            <button type="button" class="auth-forgot auth-login-only" data-auth-forgot data-i18n="forgotPassword">忘记密码</button>
            <label class="auth-register-only"><span data-i18n="confirmPassword">确认密码</span>
              <input type="password" name="confirm" placeholder="再次输入密码" data-i18n-placeholder="confirmPasswordPh" autocomplete="new-password">
            </label>
            <p class="auth-form-error" hidden></p>
            <button type="submit" class="auth-submit">登录</button>
          </form>
          <p class="auth-switch"></p>
        </div>
      `;
      document.body.appendChild(modal);
      bindAuthModal(modal);
      return modal;
    }

    function showError(form, message) {
      const error = form.querySelector('.auth-form-error');
      if (!error) return;
      error.hidden = !message;
      error.textContent = message || '';
    }

    function sendSmsCode(form, codeBtn, state) {
      const phone = form?.phone?.value.trim() || '';
      if (!/^1[3-9]\d{9}$/.test(phone)) {
        showError(form, t('errPhone'));
        return;
      }
      state.sentCode = String(Math.floor(100000 + Math.random() * 900000));
      showError(form, `${t('codeSent')}：${state.sentCode}`);
      let left = 60;
      codeBtn.disabled = true;
      codeBtn.textContent = `${left}${t('retryIn')}`;
      window.clearInterval(state.timer);
      state.timer = window.setInterval(() => {
        left -= 1;
        if (left <= 0) {
          window.clearInterval(state.timer);
          codeBtn.disabled = false;
          codeBtn.textContent = t('getCode');
          return;
        }
        codeBtn.textContent = `${left}${t('retryIn')}`;
      }, 1000);
    }

    function resetSmsButton(codeBtn, state) {
      state.sentCode = '';
      window.clearInterval(state.timer);
      if (!codeBtn) return;
      codeBtn.disabled = false;
      codeBtn.textContent = t('getCode');
    }

    function bindAuthModal(modal) {
      const title = modal.querySelector('#authModalTitle');
      const tabs = [...modal.querySelectorAll('.auth-tab')];
      const forms = [...modal.querySelectorAll('.auth-form')];
      const codeBtn = modal.querySelector('.auth-code-btn');
      const switchEl = modal.querySelector('.auth-switch');
      const sms = { sentCode: '', timer: 0 };

      function setOpen(open, options) {
        modal.classList.toggle('is-open', open);
        modal.setAttribute('aria-hidden', String(!open));
        document.body.classList.toggle('auth-open', open);
        if (open) {
          const visible = modal.querySelector('.auth-form:not([hidden]) input');
          window.setTimeout(() => visible?.focus(), 80);
        } else if (!options?.keepPage && !isLoggedIn() && isMypage()) {
          window.location.href = './';
        }
      }

      function showTab(type) {
        tabs.forEach((tab) => {
          const on = tab.dataset.reg === type;
          tab.classList.toggle('is-active', on);
          tab.setAttribute('aria-selected', String(on));
        });
        forms.forEach((form) => {
          form.hidden = form.dataset.form !== type;
          showError(form, '');
        });
      }

      function applyMode(mode) {
        const isLogin = mode === 'login';
        const copy = dict();
        modal.dataset.mode = mode;
        title.textContent = isLogin ? copy.login : copy.registerAccount;
        tabs[0].textContent = isLogin ? copy.phoneSmsLogin : copy.phoneRegister;
        tabs[1].textContent = isLogin ? copy.accountLogin : copy.accountRegister;
        modal.querySelectorAll('.auth-submit').forEach((btn) => {
          btn.textContent = isLogin ? copy.login : copy.register;
        });
        modal.querySelectorAll('.auth-register-only').forEach((el) => {
          el.hidden = isLogin;
        });
        modal.querySelectorAll('.auth-login-only').forEach((el) => {
          el.hidden = !isLogin;
        });
        switchEl.innerHTML = isLogin
          ? `${copy.noAccount}<button type="button" data-auth-switch="register">${copy.goRegister}</button>`
          : `${copy.hasAccount}<button type="button" data-auth-switch="login">${copy.goLogin}</button>`;
      }

      modal.applyLang = function applyLangModal() {
        applyMode(modal.dataset.mode || 'login');
        applyDomI18n(dict());
      };

      modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.closest('[data-auth-close]')) setOpen(false);
        if (event.target.closest('[data-auth-forgot]')) {
          setOpen(false, { keepPage: true });
          ensureResetModal().openReset();
          return;
        }
        const next = event.target.closest('[data-auth-switch]');
        if (next) {
          applyMode(next.dataset.authSwitch);
          showTab('phone');
        }
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) setOpen(false);
      });
      tabs.forEach((tab) => {
        tab.addEventListener('click', () => showTab(tab.dataset.reg));
      });

      codeBtn?.addEventListener('click', () => {
        sendSmsCode(modal.querySelector('[data-form="phone"]'), codeBtn, sms);
      });

      forms.forEach((form) => {
        form.addEventListener('submit', (event) => {
          event.preventDefault();
          const isLogin = modal.dataset.mode === 'login';
          if (form.dataset.form === 'phone') {
            const phone = form.phone.value.trim();
            const code = form.code.value.trim();
            const password = form.password.value;
            if (!/^1[3-9]\d{9}$/.test(phone)) {
              showError(form, t('errPhone'));
              return;
            }
            if (!sms.sentCode || code !== sms.sentCode) {
              showError(form, t('errCode'));
              return;
            }
            if (!isLogin && password.length < 6) {
              showError(form, t('errPassword'));
              return;
            }
          } else {
            const username = form.username.value.trim();
            const password = form.password.value;
            const confirm = form.confirm.value;
            if (isLogin) {
              if (username.length < 4 || password.length < 6) {
                showError(form, t('errLogin'));
                return;
              }
            } else if (!/^[a-zA-Z][a-zA-Z0-9_]{3,19}$/.test(username)) {
              showError(form, t('errUsername'));
              return;
            } else if (password.length < 6) {
              showError(form, t('errPassword'));
              return;
            } else if (password !== confirm) {
              showError(form, t('errMismatch'));
              return;
            }
          }
          showError(form, '');
          setLoggedIn(true);
          setOpen(false);
        });
      });

      modal.openAuth = (mode, tab) => {
        applyMode(mode);
        showTab(tab || 'phone');
        forms.forEach((form) => {
          form.reset();
          showError(form, '');
        });
        resetSmsButton(codeBtn, sms);
        setOpen(true);
      };
    }

    function ensureResetModal() {
      let modal = document.getElementById('authResetModal');
      if (modal) return modal;
      modal = document.createElement('div');
      modal.id = 'authResetModal';
      modal.className = 'auth-modal';
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML = `
        <div class="auth-dialog" role="dialog" aria-modal="true" aria-labelledby="authResetTitle">
          <button type="button" class="auth-dialog-close" data-reset-close aria-label="关闭" data-i18n-aria="close">×</button>
          <h2 id="authResetTitle" data-i18n="resetTitle">找回密码</h2>
          <form class="auth-form" data-form="reset">
            <label><span data-i18n="phone">手机号</span>
              <input type="tel" name="phone" maxlength="11" placeholder="请输入绑定手机号" data-i18n-placeholder="bindPhonePh" autocomplete="tel" inputmode="numeric">
            </label>
            <label><span data-i18n="code">验证码</span>
              <div class="auth-code-row">
                <input type="text" name="code" maxlength="6" placeholder="请输入验证码" data-i18n-placeholder="codePh" inputmode="numeric" autocomplete="one-time-code">
                <button type="button" class="auth-code-btn" data-i18n="getCode">获取验证码</button>
              </div>
            </label>
            <label><span data-i18n="newPassword">新密码</span>
              <input type="password" name="password" placeholder="至少6位新密码" data-i18n-placeholder="newPasswordPh" autocomplete="new-password">
            </label>
            <label><span data-i18n="confirmNewPassword">确认新密码</span>
              <input type="password" name="confirm" placeholder="再次输入新密码" data-i18n-placeholder="confirmNewPasswordPh" autocomplete="new-password">
            </label>
            <p class="auth-form-error" hidden></p>
            <button type="submit" class="auth-submit" data-i18n="confirmReset">确认找回</button>
          </form>
          <p class="auth-switch"><span data-i18n="rememberPassword">想起密码了？</span><button type="button" data-reset-login data-i18n="goLogin">去登录</button></p>
        </div>
      `;
      document.body.appendChild(modal);

      const form = modal.querySelector('form');
      const codeBtn = modal.querySelector('.auth-code-btn');
      const sms = { sentCode: '', timer: 0 };

      function setOpen(open) {
        modal.classList.toggle('is-open', open);
        modal.setAttribute('aria-hidden', String(!open));
        document.body.classList.toggle('auth-open', open);
        if (open) window.setTimeout(() => form?.phone?.focus(), 80);
      }

      function backToLogin() {
        setOpen(false);
        ensureAuthModal().openAuth('login', 'account');
      }

      modal.addEventListener('click', (event) => {
        if (event.target === modal || event.target.closest('[data-reset-close]')) backToLogin();
        if (event.target.closest('[data-reset-login]')) backToLogin();
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) backToLogin();
      });

      codeBtn?.addEventListener('click', () => {
        sendSmsCode(form, codeBtn, sms);
      });

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const phone = form.phone.value.trim();
        const code = form.code.value.trim();
        const password = form.password.value;
        const confirm = form.confirm.value;
        if (!/^1[3-9]\d{9}$/.test(phone)) {
          showError(form, t('errPhone'));
          return;
        }
        if (!sms.sentCode || code !== sms.sentCode) {
          showError(form, t('errCode'));
          return;
        }
        if (password.length < 6) {
          showError(form, t('errPasswordNew'));
          return;
        }
        if (password !== confirm) {
          showError(form, t('errMismatch'));
          return;
        }
        showError(form, '');
        backToLogin();
      });

      modal.openReset = () => {
        form.reset();
        showError(form, '');
        resetSmsButton(codeBtn, sms);
        applyDomI18n(dict());
        setOpen(true);
      };
      modal.applyLang = function applyLangReset() {
        applyDomI18n(dict());
      };
      return modal;
    }

    function openAuth(mode) {
      closeSideMenu();
      ensureAuthModal().openAuth(mode);
    }

    document.addEventListener('click', (event) => {
      if (event.target.closest('#mypageLogoutBtn')) return;
      if (event.target.closest('.menu-logout-btn')) {
        setLoggedIn(false);
        return;
      }
      const authBtn = event.target.closest('[data-auth]');
      if (authBtn) {
        if (authBtn.dataset.auth === 'register') {
          openAuth('register');
          return;
        }
        if (authBtn.dataset.auth === 'login') {
          openAuth('login');
          return;
        }
      }
      if (isLoggedIn()) return;
      const link = event.target.closest('a[href]');
      if (!link || !isProtectedHref(link.getAttribute('href'))) return;
      event.preventDefault();
      pendingHref = link.href;
      openAuth('login');
    });

    if (!isLoggedIn() && isMypage()) {
      document.querySelector('.mypage')?.setAttribute('hidden', '');
      pendingHref = window.location.href;
      openAuth('login');
    }

    syncAuthUi();
    window.ComicsAuth = { setLoggedIn };
  }

  function initLangSwitch() {
    const wrap = document.getElementById('langSwitch');
    const btn = document.getElementById('langSwitchBtn');
    if (!wrap || !btn) {
      applyLang();
      return;
    }

    function setOpen(open) {
      wrap.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    }

    btn.addEventListener('click', (event) => {
      event.stopPropagation();
      const willOpen = !wrap.classList.contains('is-open');
      if (willOpen) {
        document.getElementById('searchOverlay')?.classList.remove('is-open');
        document.getElementById('searchOverlay')?.setAttribute('aria-hidden', 'true');
        document.getElementById('searchButton')?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('search-open');
        document.getElementById('menuOverlay')?.classList.remove('is-open');
        document.getElementById('menuOverlay')?.setAttribute('aria-hidden', 'true');
        document.getElementById('menuButton')?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
      }
      setOpen(willOpen);
    });

    wrap.addEventListener('click', (event) => {
      const option = event.target.closest('.lang-switch-option');
      if (!option || !wrap.contains(option)) return;
      event.preventDefault();
      event.stopPropagation();
      const next = option.dataset.lang;
      localStorage.setItem(LANG_KEY, next === 'en' || next === 'pt' ? next : 'zh');
      applyLang();
      setOpen(false);
    });

    document.addEventListener('click', (event) => {
      if (!wrap.contains(event.target)) setOpen(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });

    applyLang();
  }

  if (isHomePage()) initBannerCarousel();
  initNsfwToggle();
  initSearchModal();
  initSideMenu();
  initLogoLink();
  initAuth();
  initLangSwitch();
  window.ComicsI18n = { getLang, t, applyLang };
})();
