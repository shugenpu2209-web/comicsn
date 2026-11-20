(function (global) {
  'use strict';

  const DB_KEY = 'comicsn-admin-db-v1';
  const SESSION_KEY = 'comicsn-admin-session';
  const FAIL_KEY = 'comicsn-admin-fail';

  const ROLES = {
    super: { name: '超级管理员', perms: ['*'] },
    content: { name: '内容管理员', perms: ['dashboard', 'comics', 'chapters', 'novels', 'novel-chapters', 'anime', 'episodes', 'authors', 'categories', 'tags', 'review'] },
    review: { name: '审核管理员', perms: ['dashboard', 'review', 'comments', 'reports'] },
    ops: { name: '运营管理员', perms: ['dashboard', 'banners', 'recommends', 'ranking', 'exclusive', 'freezone', 'search-ops', 'campaigns', 'coupons', 'notices', 'news', 'faq'] },
    cs: { name: '客服/用户管理员', perms: ['dashboard', 'users', 'vip-users', 'behavior', 'logins', 'blacklist', 'feedback', 'messages'] },
    finance: { name: '财务管理员', perms: ['dashboard', 'orders', 'payments', 'refunds', 'finance', 'withdrawals'] },
    data: { name: '数据管理员', perms: ['dashboard', 'stats-users', 'stats-content', 'stats-revenue', 'stats-vip', 'stats-channel'] },
    agent: { name: '代理管理员', perms: ['dashboard', 'agents', 'channels', 'promo', 'commission', 'withdrawals', 'stats-channel'] },
  };

  const ACCOUNTS = [
    { id: 'au_admin', username: 'admin', password: 'admin123', name: '总部超管', role: 'super', status: 'active' },
    { id: 'au_content', username: 'content', password: 'content123', name: '林内容', role: 'content', status: 'active' },
    { id: 'au_review', username: 'review', password: 'review123', name: '周审核', role: 'review', status: 'active' },
    { id: 'au_ops', username: 'ops', password: 'ops123', name: '陈运营', role: 'ops', status: 'active' },
    { id: 'au_cs', username: 'cs', password: 'cs123', name: '赵客服', role: 'cs', status: 'active' },
    { id: 'au_finance', username: 'finance', password: 'finance123', name: '钱财务', role: 'finance', status: 'active' },
    { id: 'au_data', username: 'data', password: 'data123', name: '孙数据', role: 'data', status: 'active' },
    { id: 'au_agent', username: 'agent', password: 'agent123', name: '吴代理', role: 'agent', status: 'active' },
  ];

  const CAT_MAP = {
    school: '校园', bl: '耽美', fantasy: '奇幻', romance: '浪漫',
    action: '动作', 'sci-fi': '科幻', comedy: '喜剧', slice: '生活',
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

  function uid(prefix) {
    return prefix + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function now() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }

  function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    const p = (x) => String(x).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }

  function parseViews(v) {
    const m = String(v || '0').match(/^([\d.]+)(K)?$/i);
    if (!m) return 0;
    return Math.round(parseFloat(m[1]) * (m[2] ? 1000 : 1));
  }

  function thumbOf(id, list) {
    const i = Math.max(0, list.indexOf(id));
    return `../assets/comics/thumb-${(i % 6) + 1}.webp`;
  }

  const JP_COMIC_IDS = {
    evolution: 1, muscle: 1, angel: 1, witch: 1, magical: 1, vengeance: 1,
    'white-hole': 1, 'no-hero': 1, hunter: 1, apocalypse: 1, 'fantasy-tale': 1,
    'space-return': 1, concrete: 1, robot: 1,
  };

  function vipOf(item) {
    if (item.vip) return item.vip;
    if (item.free) return 'free';
    if (item.exclusive) return 'full';
    return 'partial';
  }

  function mapWorks(rows, kind) {
    const ids = rows.map((r) => r.id);
    return rows.map((r, i) => ({
      id: r.id,
      kind,
      title: r.title,
      titleEn: r.titleEn || r.title,
      titlePt: r.title,
      cover: thumbOf(r.id, ids),
      thumb: thumbOf(r.id, ids),
      authorId: r.authorId,
      categories: r.cats || [],
      tags: (r.cats || []).slice(0, 2),
      origin: r.origin || (kind === 'comic' ? (JP_COMIC_IDS[r.id] ? 'japanese' : 'korean') : ''),
      progress: r.progress || r.status || 'updating',
      vip: vipOf(r),
      recommend: !!(r.rec || r.featured),
      exclusive: !!r.exclusive,
      duration: r.duration || '',
      blurb: `${r.title}：平台原创连载作品。`,
      blurbEn: `${r.titleEn || r.title} original series.`,
      views: parseViews(r.views),
      likes: parseViews(r.likes),
      chapterCount: r.eps,
      publishStatus: r.publishStatus || 'published',
      createdAt: `2025-0${(i % 8) + 1}-12 10:00:00`,
      updatedAt: now(),
    }));
  }

  function seedUnits(works, { prefix, unit }) {
    const list = [];
    (works || []).forEach((c) => {
      const n = Math.min(c.chapterCount || 1, 8);
      for (let i = 1; i <= n; i += 1) {
        list.push({
          id: `${c.id}_${prefix}_${i}`,
          comicId: c.id,
          no: i,
          title: `第${i}${unit}`,
          cover: c.cover,
          free: i <= 2 || c.vip === 'free',
          status: c.publishStatus === 'draft' ? 'draft' : 'published',
          publishAt: `2025-08-${String(i).padStart(2, '0')} 12:00:00`,
          body: unit === '章' ? `${c.title} 第${i}章正文。` : '',
          duration: c.duration || '',
          assets: unit === '话' || unit === '集' ? [{ key: c.cover, sort: 1 }, { key: c.thumb, sort: 2 }] : [],
        });
      }
    });
    return list;
  }

  function seedComics() {
    return mapWorks([
      { id: 'evolution', title: '进化：通往太空怪兽之路', titleEn: 'Evolution: Road to Space Monster', authorId: '韩宇', cats: ['action', 'fantasy', 'sci-fi'], rec: true, views: '16.9K', likes: '8.2K', eps: 47, exclusive: true },
      { id: 'bully', title: '恶霸的爱情故事', titleEn: "Bully's Love Story", authorId: '优丸', cats: ['school', 'bl'], rec: true, views: '277.2K', likes: '91.4K', eps: 24, exclusive: true, free: true },
      { id: 'muscle', title: '肌肉女巫竞技场', titleEn: 'Muscle Girls Colosseum', authorId: '南风', cats: ['action', 'fantasy'], rec: true, views: '2.7K', likes: '4.1K', eps: 29, exclusive: true },
      { id: 'angel', title: '天使与恶魔', titleEn: 'Angel and Devil', authorId: '白夜', cats: ['bl', 'romance'], views: '1K', likes: '3.6K', eps: 25, free: true },
      { id: 'witch', title: '女巫的孩子', titleEn: "The Witch's Child", authorId: '林深', cats: ['fantasy'], views: '497', likes: '1.2K', eps: 33 },
      { id: 'magical', title: '魔法少女编年史 ABC', titleEn: 'Magical Girl Chronicles', authorId: '顾清', cats: ['action', 'fantasy'], rec: true, views: '450', likes: '2.8K', eps: 27, exclusive: true, progress: 'ended' },
      { id: 'too-much', title: '她对我来说太过了', titleEn: "She's Too Much for Me", authorId: '沈星', cats: ['romance', 'comedy'], rec: true, views: '20K', likes: '11.3K', eps: 88, exclusive: true },
      { id: 'drawing', title: '绘画浪漫', titleEn: 'Drawing Romance', authorId: '叶舟', cats: ['romance', 'slice'], rec: true, views: '15K', likes: '9.7K', eps: 62, exclusive: true, free: true },
      { id: 'mom', title: '我是妈妈', titleEn: "I'm a Mom", authorId: '陈川', cats: ['slice'], views: '12K', likes: '18.6K', eps: 45 },
      { id: 'vengeance', title: '复仇', titleEn: 'Vengeance', authorId: '苏晚', cats: ['action'], views: '9.8K', likes: '6.4K', eps: 51, progress: 'ended' },
      { id: 'classmate', title: '与青梅竹马和前女友同班', titleEn: 'Same Class', authorId: '江北', cats: ['romance', 'school'], views: '8.2K', likes: '7.1K', eps: 39, free: true },
      { id: 'asteroid', title: '小行星落入学校的那天', titleEn: 'Asteroid Day', authorId: '白鹿', cats: ['school', 'comedy'], views: '7.5K', likes: '5.3K', eps: 28, progress: 'ended', free: true },
      { id: 'starry', title: '暗夜星途', titleEn: 'Starry Night', authorId: '明川', cats: ['bl'], views: '6.1K', likes: '14.2K', eps: 33 },
      { id: 'white-hole', title: '白洞', titleEn: 'White Hole', authorId: '方舟', cats: ['sci-fi', 'fantasy'], views: '5.4K', likes: '3.9K', eps: 19 },
      { id: 'zombie', title: '新婚僵尸', titleEn: 'Zombie Newlyweds', authorId: '夏至', cats: ['comedy'], views: '4.9K', likes: '2.2K', eps: 22 },
      { id: 'yurong', title: '我的小宇荣', titleEn: 'My Little Yurong', authorId: '顾南', cats: ['slice', 'comedy'], views: '4.2K', likes: '8.8K', eps: 17, free: true },
      { id: 'no-hero', title: '我不想当英雄！', titleEn: 'I Don\'t Want to Be a Hero', authorId: '林舟', cats: ['action', 'comedy'], views: '3.8K', likes: '4.6K', eps: 41 },
      { id: 'hunter', title: '鬼怪猎人', titleEn: 'Ghost Hunter', authorId: '沈夜', cats: ['action', 'fantasy'], views: '3.1K', likes: '2.9K', eps: 26, progress: 'ended' },
      { id: 'drink', title: '来喝一杯吧！', titleEn: 'Have a Drink', authorId: '叶白', cats: ['slice', 'comedy'], views: '2.9K', likes: '6.7K', eps: 14, free: true },
      { id: 'boy-world', title: '少年对抗世界', titleEn: 'Boy vs World', authorId: '陈星', cats: ['action', 'school'], views: '2.4K', likes: '1.8K', eps: 31 },
      { id: 'apocalypse', title: '末日故事集', titleEn: 'Apocalypse Tales', authorId: '苏川', cats: ['sci-fi'], views: '2.1K', likes: '1.5K', eps: 18, progress: 'ended' },
      { id: 'fantasy-tale', title: '奇幻传说', titleEn: 'Fantasy Tale', authorId: '江晚', cats: ['fantasy'], views: '1.9K', likes: '3.3K', eps: 24 },
      { id: 'growth', title: '成长剧', titleEn: 'Coming of Age', authorId: '白舟', cats: ['school', 'slice'], views: '1.6K', likes: '2.1K', eps: 12, free: true },
      { id: 'space-return', title: '太空怪兽归来', titleEn: 'Space Monster Returns', authorId: '明夜', cats: ['action', 'sci-fi'], views: '1.4K', likes: '980', eps: 55 },
      { id: 'secret-class', title: '秘密课堂 重启', titleEn: 'Secret Class Returns', authorId: '方白', cats: ['school'], rec: true, views: '1.2K', likes: '5.5K', eps: 67 },
      { id: 'love-letter', title: '错发的情书', titleEn: 'Wrong Love Letter', authorId: '夏川', cats: ['romance'], views: '980', likes: '4.4K', eps: 8, free: true },
      { id: 'maid', title: '疲惫女仆来了！', titleEn: 'Tired Maid', authorId: '顾星', cats: ['comedy', 'slice'], views: '860', likes: '1.1K', eps: 11, free: true },
      { id: 'neighbor', title: '亲爱的邻居', titleEn: 'Dear Neighbor', authorId: '林白', cats: ['romance', 'slice'], views: '740', likes: '2.4K', eps: 9 },
      { id: 'concrete', title: '混凝土丛林', titleEn: 'Concrete Jungle', authorId: '沈川', cats: ['action'], views: '620', likes: '890', eps: 16, progress: 'ended' },
      { id: 'robot', title: '如果你是机器人就现身', titleEn: 'If You Are a Robot', authorId: '叶晚', cats: ['sci-fi', 'comedy'], views: '510', likes: '1.7K', eps: 7, free: true },
      { id: 'draft-new', title: '未发布：雨夜告白', titleEn: 'Rain Confession', authorId: '夏川', cats: ['romance'], views: '0', likes: '0', eps: 3, publishStatus: 'draft' },
    ], 'comic');
  }

  function seedNovels() {
    return mapWorks([
      { id: 'night-store', title: '深夜便利店的告白', authorId: '林晚星', cats: ['romance', 'slice'], rec: true, views: '88K', likes: '32.1K', eps: 64, exclusive: true, free: true },
      { id: 'villain-love', title: '转生成反派也要谈恋爱', authorId: '江澄舟', cats: ['fantasy', 'romance'], rec: true, views: '61K', likes: '28.4K', eps: 112, exclusive: true },
      { id: 'campus-xianxia', title: '校园修仙日志', authorId: '顾南乔', cats: ['school', 'fantasy'], rec: true, views: '41K', likes: '19.6K', eps: 73, exclusive: true, progress: 'ended' },
      { id: 'ceo-standin', title: '总裁的替身情人', authorId: '沈予安', cats: ['romance'], rec: true, views: '54K', likes: '21.3K', eps: 86, exclusive: true },
      { id: 'last-garden', title: '末世花园', authorId: '叶知秋', cats: ['sci-fi', 'action'], rec: true, views: '36K', likes: '14.8K', eps: 49, exclusive: true },
      { id: 'roommate-rules', title: '室友不可爱守则', authorId: '陈见鹿', cats: ['school', 'bl'], rec: true, views: '22K', likes: '17.2K', eps: 28, exclusive: true, free: true },
      { id: 'starlight-her', title: '她从星光里走来', authorId: '苏晚晴', cats: ['romance', 'slice'], views: '29K', likes: '12.5K', eps: 38, free: true },
      { id: 'library-reader', title: '图书馆的秘密读者', authorId: '白敬衡', cats: ['slice', 'school'], views: '24K', likes: '9.1K', eps: 55 },
      { id: 'inn-rebirth', title: '重生之我在江湖开客栈', authorId: '林晚星', cats: ['fantasy', 'action'], rec: true, views: '21K', likes: '15.7K', eps: 91 },
      { id: 'cat-next-door', title: '隔壁的猫与你', authorId: '江澄舟', cats: ['slice', 'comedy'], views: '18K', likes: '11.4K', eps: 27, free: true },
      { id: 'last-swordsman', title: '帝国的最后一位剑士', authorId: '顾南乔', cats: ['action', 'fantasy'], views: '16K', likes: '8.8K', eps: 44, progress: 'ended' },
      { id: 'rain-mystery', title: '雨夜推理社', authorId: '沈予安', cats: ['school'], views: '13K', likes: '7.2K', eps: 33 },
      { id: 'contract-marriage', title: '契约婚姻请签字', authorId: '叶知秋', cats: ['romance'], views: '11K', likes: '10.6K', eps: 58 },
      { id: 'magic-fail', title: '魔法学院不及格生', authorId: '陈见鹿', cats: ['school', 'fantasy'], rec: true, views: '9.6K', likes: '6.4K', eps: 22, free: true },
      { id: 'villain-moonlight', title: '穿越成反派的白月光', authorId: '苏晚晴', cats: ['fantasy', 'romance'], views: '8.1K', likes: '13.9K', eps: 47 },
      { id: 'sea-lighthouse', title: '海风与灯塔', authorId: '白敬衡', cats: ['slice'], views: '7.4K', likes: '4.1K', eps: 19, progress: 'ended', free: true },
      { id: 'fake-workplace', title: '职场生存指南（假的）', authorId: '林晚星', cats: ['comedy', 'slice'], views: '6.2K', likes: '5.8K', eps: 31, free: true },
      { id: 'dragon-days', title: '与龙同居的一百天', authorId: '江澄舟', cats: ['fantasy', 'comedy'], views: '5.5K', likes: '8.3K', eps: 16 },
      { id: 'time-bookstore', title: '旧书店的时间旅人', authorId: '顾南乔', cats: ['fantasy', 'slice'], views: '4.8K', likes: '3.6K', eps: 28 },
      { id: 'alley-heartbeat', title: '暗巷里的心跳', authorId: '沈予安', cats: ['bl', 'romance'], rec: true, views: '4.4K', likes: '9.8K', eps: 21 },
      { id: 'after-masquerade', title: '假面舞会之后', authorId: '叶知秋', cats: ['romance'], views: '4.1K', likes: '2.9K', eps: 12, free: true },
      { id: 'star-postman', title: '星际邮差', authorId: '陈见鹿', cats: ['sci-fi'], views: '3.6K', likes: '2.4K', eps: 40 },
      { id: 'winter-onsen', title: '冬日温泉旅馆', authorId: '苏晚晴', cats: ['slice', 'romance'], views: '2.9K', likes: '4.7K', eps: 15, progress: 'ended', free: true },
      { id: 'god-off-duty', title: '神明请下班', authorId: '白敬衡', cats: ['comedy', 'fantasy'], views: '2.3K', likes: '3.2K', eps: 21, free: true },
      { id: 'silent-pianist', title: '沉默的钢琴师', authorId: '林晚星', cats: ['slice'], views: '1.8K', likes: '2.1K', eps: 9 },
      { id: 'city-south', title: '城南旧事续写', authorId: '江澄舟', cats: ['slice', 'school'], views: '1.2K', likes: '1.6K', eps: 18, progress: 'ended' },
      { id: 'no-gravity', title: '如果明天没有重力', authorId: '顾南乔', cats: ['sci-fi', 'romance'], views: '980', likes: '1.9K', eps: 11, free: true },
      { id: 'villain-tea', title: '反派联盟茶话会', authorId: '沈予安', cats: ['comedy', 'action'], views: '860', likes: '2.7K', eps: 14 },
      { id: 'martial-boy', title: '武道少年不想努力了', authorId: '叶知秋', cats: ['action', 'school'], views: '740', likes: '1.4K', eps: 26 },
      { id: 'fox-deskmate', title: '同桌是只小狐狸', authorId: '陈见鹿', cats: ['school', 'fantasy'], views: '610', likes: '3.5K', eps: 8, free: true },
    ], 'novel');
  }

  function seedAnime() {
    return mapWorks([
      { id: 'bully', title: '恶霸的爱情故事', authorId: '优丸', cats: ['school', 'bl'], rec: true, views: '128K', likes: '91.4K', eps: 12, duration: '8分钟', exclusive: false, free: true },
      { id: 'evolution', title: '进化：通往太空怪兽之路', authorId: '韩宇', cats: ['sci-fi', 'action'], rec: true, views: '96K', likes: '8.2K', eps: 10, duration: '7分钟', exclusive: true },
      { id: 'muscle', title: '肌肉女巫竞技场', authorId: '南风', cats: ['fantasy', 'action'], rec: true, views: '54K', likes: '4.1K', eps: 8, duration: '6分钟' },
      { id: 'angel', title: '天使与恶魔', authorId: '白夜', cats: ['bl', 'romance'], views: '41K', likes: '3.6K', eps: 9, duration: '8分钟', progress: 'ended', free: true },
      { id: 'witch', title: '女巫的孩子', authorId: '林深', cats: ['fantasy'], views: '33K', likes: '1.2K', eps: 11, duration: '7分钟' },
      { id: 'magical', title: '魔法少女编年史', authorId: '顾清', cats: ['fantasy', 'action'], rec: true, views: '29K', likes: '2.8K', eps: 6, duration: '5分钟', progress: 'ended' },
      { id: 'romance', title: '绘画浪漫', authorId: '叶舟', cats: ['romance', 'slice'], views: '24K', likes: '9.7K', eps: 14, duration: '8分钟' },
      { id: 'mom', title: '我是妈妈', authorId: '陈川', cats: ['slice'], rec: true, views: '21K', likes: '18.6K', eps: 7, duration: '6分钟' },
      { id: 'vengeance', title: '复仇', authorId: '苏晚', cats: ['action'], views: '18K', likes: '6.4K', eps: 13, duration: '9分钟', progress: 'ended' },
      { id: 'school', title: '与青梅竹马和前女友同班', authorId: '江北', cats: ['school', 'romance'], views: '15K', likes: '7.1K', eps: 8, duration: '7分钟', free: true },
      { id: 'asteroid', title: '小行星落入学校的那天', authorId: '白鹿', cats: ['school', 'comedy'], views: '12K', likes: '5.3K', eps: 5, duration: '6分钟', progress: 'ended' },
      { id: 'starry', title: '暗夜星途', authorId: '明川', cats: ['bl'], views: '9.6K', likes: '14.2K', eps: 10, duration: '8分钟' },
    ], 'anime');
  }

  function seedChapters(comics) { return seedUnits(comics, { prefix: 'ch', unit: '话' }); }
  function seedNovelChapters(novels) { return seedUnits(novels, { prefix: 'ch', unit: '章' }); }
  function seedEpisodes(anime) { return seedUnits(anime, { prefix: 'ep', unit: '集' }); }

  function makeAuthors(works, kind) {
    const names = [...new Set(works.map((c) => c.authorId).filter(Boolean))];
    return names.map((name, i) => ({
      id: `${kind}:${name}`,
      kind,
      name,
      bio: `${name}，平台签约作者。`,
      works: works.filter((c) => c.authorId === name).length,
      status: 'active',
      createdAt: `2024-0${(i % 9) + 1}-01 09:00:00`,
    }));
  }

  function seedCategories() {
    const kinds = ['comic', 'novel', 'anime'];
    const rows = [];
    kinds.forEach((kind) => {
      const extra = kind === 'comic'
        ? [{ key: 'korean', name: '韩漫' }, { key: 'japanese', name: '日漫' }]
        : [];
      extra.concat(Object.keys(CAT_MAP).map((key) => ({ key, name: CAT_MAP[key] }))).forEach((item, i) => {
        rows.push({ id: `${kind}:${item.key}`, kind, key: item.key, name: item.name, sort: i + 1, status: 'on' });
      });
    });
    return rows;
  }

  function seedTags() {
    const names = ['甜宠', '都市', '穿越', '青春', '热血', '日常', '暗恋', '原创'];
    const kinds = ['comic', 'novel', 'anime'];
    const rows = [];
    kinds.forEach((kind) => {
      names.forEach((name, i) => {
        rows.push({ id: `${kind}:tag_${i}`, kind, name, status: 'on' });
      });
    });
    return rows;
  }

  function mergeById(existing, seeded) {
    const have = new Set((existing || []).map((x) => x.id));
    const extra = seeded.filter((x) => !have.has(x.id));
    return (existing || []).concat(extra);
  }

  function seedSiteOps() {
    return {
      banners: [
        { id: 'bn_1', title: '全班地铁求生', image: '../assets/1.webp', slot: 'home', jumpType: 'url', jumpId: 'ad.html', start: daysAgo(10), end: '2026-12-31', sort: 1, status: 'on' },
        { id: 'bn_2', title: '恶霸的爱情故事', image: '../assets/2.webp', slot: 'home', jumpType: 'comic', jumpId: 'bully', start: daysAgo(8), end: '2026-12-31', sort: 2, status: 'on' },
        { id: 'bn_3', title: 'VIP 年卡活动', image: '../assets/3.webp', slot: 'home', jumpType: 'url', jumpId: 'mypage.html#vip', start: daysAgo(3), end: '2026-10-31', sort: 3, status: 'on' },
        { id: 'bn_4', title: '进化：通往太空怪兽之路', image: '../assets/4.webp', slot: 'home', jumpType: 'anime', jumpId: 'evolution', start: daysAgo(6), end: '2026-12-31', sort: 4, status: 'on' },
        { id: 'bn_5', title: '深夜便利店的告白', image: '../assets/5.webp', slot: 'home', jumpType: 'novel', jumpId: 'night-store', start: daysAgo(5), end: '2026-12-31', sort: 5, status: 'on' },
        { id: 'bn_6', title: '绘画浪漫', image: '../assets/6.webp', slot: 'home', jumpType: 'comic', jumpId: 'drawing', start: daysAgo(4), end: '2026-12-31', sort: 6, status: 'on' },
        { id: 'bn_menu', title: '侧栏充值活动', image: '../assets/menu_promo_vip.png', slot: 'menu', jumpType: 'url', jumpId: 'ad.html', start: daysAgo(20), end: '2026-12-31', sort: 20, status: 'on' },
      ],
      recommends: [
        { id: 'rc_m1', kind: 'comic', workId: 'evolution', reason: '首页漫画排行 1', slot: 'rank-manga', sort: 1, start: daysAgo(7), end: '2026-12-31', status: 'on' },
        { id: 'rc_m2', kind: 'comic', workId: 'bully', reason: '首页漫画排行 2', slot: 'rank-manga', sort: 2, start: daysAgo(7), end: '2026-12-31', status: 'on' },
        { id: 'rc_n1', kind: 'novel', workId: 'night-store', reason: '首页小说排行 1', slot: 'rank-novel', sort: 1, start: daysAgo(7), end: '2026-12-31', status: 'on' },
        { id: 'rc_a1', kind: 'anime', workId: 'evolution', reason: '首页动画排行 1', slot: 'rank-anime', sort: 1, start: daysAgo(7), end: '2026-12-31', status: 'on' },
        { id: 'rc_more1', kind: 'comic', workId: 'too-much', reason: '其他推荐', slot: 'more', sort: 1, start: daysAgo(2), end: '2026-12-31', status: 'on' },
        { id: 'rc_ex1', kind: 'comic', workId: 'drawing', reason: '独播', slot: 'exclusive', sort: 1, start: daysAgo(2), end: '2026-12-31', status: 'on' },
      ],
      news: [
        { id: 'news_vip', date: '2026.09.08', tag: '活动', tagType: 'event', title: '充值活动进行中：开通 VIP 即可解锁第7集起全部动画', titleEn: 'VIP sale is live: unlock episode 7 and later with a membership', titlePt: 'Promoção VIP: desbloqueie o episódio 7 em diante', body: '活动期间开通任意 VIP 套餐，即可观看全部动画第7集及之后内容。已开通会员的用户无需重复购买，到期前均可继续观看。', status: 'on', createdAt: daysAgo(32) + ' 09:00:00' },
        { id: 'news_bully', date: '2026.09.05', tag: '更新', tagType: 'update', title: '《恶霸的爱情故事》动画已更新至第12集', titleEn: "Bully’s Love Story anime is now updated to episode 12", titlePt: 'O anime Bully’s Love Story foi atualizado até o episódio 12', body: '新一集现已上线。第1–6集可免费观看，第7集起为 VIP 专属。前往动画页即可继续追更。', status: 'on', createdAt: daysAgo(35) + ' 10:00:00' },
        { id: 'news_evolution', date: '2026.09.01', tag: '公告', tagType: 'notice', title: '新作上架：《进化：通往太空怪兽之路》现已开放观看', titleEn: 'New title: Evolution: Road to Space Monster is now available', titlePt: 'Novo título: Evolution: Road to Space Monster já está disponível', body: '科幻动作新作已同步上线漫画与动画。可在首页、漫画或动画频道找到该作品。', status: 'on', createdAt: daysAgo(39) + ' 11:00:00' },
        { id: 'news_nsfw', date: '2026.08.22', tag: '公告', tagType: 'notice', title: '关于 NSFW 内容展示说明', titleEn: 'About NSFW content display', titlePt: 'Sobre a exibição de conteúdo NSFW', body: '部分作品含成人向内容。可使用页头 NSFW 开关控制展示。关闭后相关封面与条目将按站点规则隐藏或替换。', status: 'on', createdAt: daysAgo(49) + ' 12:00:00' },
        { id: 'news_maintain', date: '2026.08.15', tag: '公告', tagType: 'notice', title: '系统维护完成，阅读与播放已恢复正常', titleEn: 'Maintenance finished: reading and playback are back to normal', titlePt: 'Manutenção concluída: leitura e reprodução voltaram ao normal', body: '8 月 15 日进行的短时维护已经结束。如仍遇到无法翻页或播放卡顿，请刷新页面或重新登录后再试。', status: 'on', createdAt: daysAgo(56) + ' 08:00:00' },
      ],
      faq: [
        { id: 'faq_vip', sort: 1, tag: 'VIP', title: '如何开通 VIP？开通后可以看哪些内容？', body: '打开侧栏进入「VIP充值」，选择套餐完成支付即可。开通后可观看动画第7集及之后内容，并解锁需会员资格的漫画章节。', status: 'on' },
        { id: 'faq_free', sort: 2, tag: '观看', title: '哪些集数可以免费观看？', body: '动画第1–6集可免费观看，第7集起为 VIP 专属。漫画同样会标注「免费」或「会员资格」。未登录也可浏览免费内容。', status: 'on' },
        { id: 'faq_nsfw', sort: 3, tag: '内容', title: 'NSFW 开关是做什么的？', body: '部分作品含成人向内容。打开页头 NSFW 后显示完整封面与条目；关闭后将按站点规则隐藏或替换相关内容。', status: 'on' },
        { id: 'faq_shelf', sort: 4, tag: '书架', title: '如何把作品加入我的书架？', body: '进入作品页点击「收藏」，即可在「书架」中查看。书架支持搜索、排序和批量删除。', status: 'on' },
        { id: 'faq_account', sort: 5, tag: '账号', title: '忘记密码或无法登录怎么办？', body: '在登录弹窗选择「忘记密码」，使用绑定手机号收取验证码后重置。若仍无法登录，请通过「联系客服」提交账号信息。', status: 'on' },
      ],
      searchHots: [
        { id: 'sh_1', name: '妈妈', sort: 1, status: 'on' },
        { id: 'sh_2', name: '继母', sort: 2, status: 'on' },
        { id: 'sh_3', name: '阿姨', sort: 3, status: 'on' },
        { id: 'sh_4', name: '秘密班级', sort: 4, status: 'on' },
        { id: 'sh_5', name: '母亲', sort: 5, status: 'on' },
        { id: 'sh_6', name: '爱', sort: 6, status: 'on' },
        { id: 'sh_7', name: '老师', sort: 7, status: 'on' },
        { id: 'sh_8', name: '洞', sort: 8, status: 'on' },
        { id: 'sh_9', name: '德拉', sort: 9, status: 'on' },
        { id: 'sh_10', name: 'P', sort: 10, status: 'on' },
      ],
      searchKeywords: [
        { id: 'sk_1', name: '美洲狮', href: 'manga.html', sort: 1, status: 'on' },
        { id: 'sk_2', name: '动画片', href: 'anime.html', sort: 2, status: 'on' },
        { id: 'sk_3', name: '大学', href: 'manga.html', sort: 3, status: 'on' },
        { id: 'sk_4', name: '特殊能力', href: 'manga.html', sort: 4, status: 'on' },
        { id: 'sk_5', name: '户外活动', href: 'novel.html', sort: 5, status: 'on' },
        { id: 'sk_6', name: '硬核', href: 'anime.html', sort: 6, status: 'on' },
        { id: 'sk_7', name: '角色互换', href: 'manga.html', sort: 7, status: 'on' },
      ],
    };
  }

  function seed() {
    const comics = seedComics();
    const novels = seedNovels();
    const anime = seedAnime();
    const authors = makeAuthors(comics, 'comic').concat(makeAuthors(novels, 'novel'), makeAuthors(anime, 'anime'));
    const categories = seedCategories();
    const tags = seedTags();
    const users = [
      ['u1001', '影璇', 'shugenpu2209@gmail.com', 'google', 'vip', 1280],
      ['u1002', '北川', 'kitagawa@example.com', 'email', 'vip', 860],
      ['u1003', '阿月', 'ayue@example.com', 'agent', 'normal', 0],
      ['u1004', '小林', 'kobayashi@example.com', 'email', 'vip', 199],
      ['u1005', 'Marta', 'marta@example.com', 'pt', 'normal', 49],
      ['u1006', 'Leo', 'leo@example.com', 'google', 'vip', 320],
      ['u1007', '陈见鹿', 'chen@example.com', 'agent', 'normal', 0],
      ['u1008', 'banned_user', 'risk@example.com', 'email', 'banned', 0],
    ].map((row, i) => ({
      id: row[0], nickname: row[1], email: row[2], channel: row[3], vip: row[4] === 'vip', vipUntil: row[4] === 'vip' ? '2026-12-31' : '',
      recharge: row[5], status: row[4] === 'banned' ? 'banned' : 'active',
      registeredAt: daysAgo(40 - i * 4) + ' 08:12:00', lastLogin: daysAgo(i) + ' 21:03:11',
      country: i % 3 === 0 ? 'CN' : i % 3 === 1 ? 'BR' : 'US', device: i % 2 ? 'iOS' : 'Android',
    }));

    const plans = [
      { id: 'plan_week', name: '周卡', price: 19, origin: 29, days: 7, perks: ['VIP内容', '去广告'], sort: 1, status: 'on' },
      { id: 'plan_month', name: '月卡', price: 49, origin: 69, days: 30, perks: ['VIP内容', '去广告', '动画权益'], sort: 2, status: 'on' },
      { id: 'plan_year', name: '年卡', price: 299, origin: 399, days: 365, perks: ['VIP内容', '去广告', '动画权益', '抢先看'], sort: 3, status: 'on' },
    ];
    const products = plans.map((p) => ({ id: 'prod_' + p.id, name: p.name, type: 'vip', planId: p.id, price: p.price, status: 'on' }));
    const siteOps = seedSiteOps();
    const orders = [
      ['OD20260928001', 'u1001', 'plan_month', 49, 'stripe', 'success', 1],
      ['OD20260928002', 'u1002', 'plan_year', 299, 'paypal', 'success', 2],
      ['OD20260928003', 'u1004', 'plan_week', 19, 'stripe', 'unpaid', 0],
      ['OD20260929001', 'u1006', 'plan_month', 49, 'paypal', 'success', 3],
      ['OD20260929002', 'u1005', 'plan_week', 19, 'pix', 'failed', 4],
      ['OD20260930001', 'u1001', 'plan_year', 299, 'stripe', 'refunding', 0],
    ].map((row) => ({
      id: row[0], userId: row[1], productId: 'prod_' + row[2], planId: row[2], amount: row[3],
      channel: row[4], channelNo: row[4].toUpperCase() + row[0].slice(-4),
      status: row[5], createdAt: daysAgo(row[6]) + ' 11:20:08', paidAt: row[5] === 'success' ? daysAgo(row[6]) + ' 11:20:19' : '',
      agentId: row[1] === 'u1003' || row[1] === 'u1007' ? 'ag_01' : (row[6] % 2 ? 'ag_02' : ''),
    }));

    return {
      version: 4,
      comics,
      chapters: seedChapters(comics),
      novels,
      novelChapters: seedNovelChapters(novels),
      authors,
      categories,
      tags,
      reviews: [
        { id: 'rv_1', kind: 'comic', targetType: 'comic', targetId: 'draft-new', title: '未发布：雨夜告白', status: 'pending', reason: '', reviewer: '', createdAt: now() },
        { id: 'rv_2', kind: 'comic', targetType: 'chapter', targetId: 'witch_ch_3', title: '女巫的孩子 第3话', status: 'rejected', reason: '封面含敏感画面', reviewer: '周审核', createdAt: daysAgo(1) + ' 16:00:00' },
        { id: 'rv_3', kind: 'novel', targetType: 'novel', targetId: 'villain-love', title: '转生成反派也要谈恋爱', status: 'pending', reason: '', reviewer: '', createdAt: now() },
        { id: 'rv_4', kind: 'anime', targetType: 'anime', targetId: 'evolution', title: '进化：通往太空怪兽之路', status: 'pending', reason: '', reviewer: '', createdAt: daysAgo(1) + ' 11:00:00' },
      ],
      anime,
      episodes: seedEpisodes(anime),
      banners: siteOps.banners,
      recommends: siteOps.recommends,
      news: siteOps.news,
      faq: siteOps.faq,
      searchHots: siteOps.searchHots,
      searchKeywords: siteOps.searchKeywords,
      users,
      blacklist: [
        { id: 'bl_1', type: 'account', value: 'u1008', reason: '恶意刷评', createdAt: daysAgo(6) + ' 09:00:00' },
        { id: 'bl_2', type: 'ip', value: '203.0.113.8', reason: '异常登录', createdAt: daysAgo(2) + ' 13:20:00' },
      ],
      feedback: [
        { id: 'fb_1', userId: 'u1003', type: '支付', content: 'PIX 支付未到账', status: 'open', createdAt: daysAgo(1) + ' 18:02:00' },
        { id: 'fb_2', userId: 'u1005', type: '内容', content: '章节图片顺序错乱', status: 'done', createdAt: daysAgo(5) + ' 10:11:00' },
      ],
      plans,
      products,
      coupons: [
        { id: 'cp_new', name: '新人立减', type: 'amount', value: 10, min: 19, stock: 1000, used: 126, start: daysAgo(20), end: '2026-12-31', apply: 'vip', status: 'on' },
        { id: 'cp_fest', name: '节日8折', type: 'percent', value: 80, min: 49, stock: 500, used: 88, start: daysAgo(2), end: '2026-10-07', apply: 'all', status: 'on' },
      ],
      campaigns: [
        { id: 'cm_first', name: '首充特惠', type: '首充', rule: '首单月卡立减10', budget: 20000, used: 4320, start: daysAgo(15), end: '2026-12-31', status: 'on' },
        { id: 'cm_renew', name: '续费返周卡', type: '续费', rule: '年卡续费赠7天', budget: 8000, used: 1200, start: daysAgo(5), end: '2026-11-30', status: 'on' },
      ],
      orders,
      refunds: [
        { id: 'rf_1', orderId: 'OD20260930001', userId: 'u1001', amount: 299, status: 'pending', reason: '重复开通', createdAt: now() },
      ],
      comments: [
        { id: 'c_1', comicId: 'bully', userId: 'u1001', content: '太好看了！', status: 'approved', createdAt: daysAgo(2) + ' 20:00:00' },
        { id: 'c_2', comicId: 'mom', userId: 'u1003', content: '灌水广告加微信', status: 'pending', createdAt: now() },
        { id: 'c_3', comicId: 'evolution', userId: 'u1006', content: '世界观很完整', status: 'approved', createdAt: daysAgo(3) + ' 12:00:00' },
      ],
      reports: [
        { id: 'rp_1', type: '色情', target: 'c_2', evidence: '评论含广告引流', status: 'open', handler: '', createdAt: now() },
      ],
      words: [
        { id: 'w_1', word: '加微信', action: 'hide', status: 'on' },
        { id: 'w_2', word: '免费看全集', action: 'reject', status: 'on' },
      ],
      agents: [
        { id: 'ag_01', name: '华南一号', level: 1, parentId: '', status: 'on', createdAt: '2025-01-08 10:00:00', sales: 12800, commission: 1920 },
        { id: 'ag_02', name: '巴西渠道A', level: 1, parentId: '', status: 'on', createdAt: '2025-03-02 10:00:00', sales: 8600, commission: 1290 },
        { id: 'ag_03', name: '华南一号-下级', level: 2, parentId: 'ag_01', status: 'on', createdAt: '2025-06-18 10:00:00', sales: 2100, commission: 210 },
        { id: 'ag_04', name: '待审核代理', level: 1, parentId: '', status: 'pending', createdAt: now(), sales: 0, commission: 0 },
      ],
      channels: [
        { id: 'ch_google', name: 'Google', status: 'on', clicks: 18020, regs: 940, pays: 122, revenue: 6120 },
        { id: 'ch_email', name: '邮箱注册', status: 'on', clicks: 0, regs: 410, pays: 55, revenue: 1980 },
        { id: 'ch_agent', name: '代理推广', status: 'on', clicks: 9900, regs: 360, pays: 80, revenue: 4300 },
        { id: 'ch_pix', name: 'PIX', status: 'on', clicks: 2200, regs: 90, pays: 18, revenue: 860 },
      ],
      rules: [
        { id: 'cr_l1', level: 1, ratio: 15, product: 'all', start: '2026-01-01', version: 3, status: 'on' },
        { id: 'cr_l2', level: 2, ratio: 8, product: 'all', start: '2026-01-01', version: 3, status: 'on' },
        { id: 'cr_l3', level: 3, ratio: 3, product: 'all', start: '2026-01-01', version: 2, status: 'on' },
      ],
      commissions: [
        { id: 'cc_1', orderId: 'OD20260928001', agentId: 'ag_02', amount: 7.35, status: 'settled', createdAt: daysAgo(1) + ' 11:21:00' },
        { id: 'cc_2', orderId: 'OD20260929001', agentId: 'ag_01', amount: 7.35, status: 'pending', createdAt: daysAgo(3) + ' 11:21:00' },
      ],
      withdrawals: [
        { id: 'wd_1', agentId: 'ag_01', amount: 1200, status: 'pending', createdAt: now() },
        { id: 'wd_2', agentId: 'ag_02', amount: 800, status: 'paid', createdAt: daysAgo(8) + ' 15:00:00' },
      ],
      notices: [
        { id: 'nt_home', title: '充值活动进行中：开通 VIP 即可解锁第7集起全部动画', body: '对应首页公告条。', link: 'news.html', status: 'on', createdAt: daysAgo(1) + ' 09:00:00' },
        { id: 'nt_1', title: '国庆内容提审截止', body: '10月1日前请完成待审章节提审。', link: '', status: 'on', createdAt: daysAgo(1) + ' 09:00:00' },
      ],
      messages: [
        { id: 'ms_1', userId: 'u1001', title: 'VIP 即将到期', body: '您的月卡将于 3 天后到期。', status: 'sent', createdAt: daysAgo(0) + ' 08:00:00' },
      ],
      templates: [
        { id: 'tpl_vip', name: 'VIP到期提醒', channel: '站内信', body: '您的{plan}将于{date}到期' },
        { id: 'tpl_pay', name: '支付成功', channel: '邮件', body: '订单{orderId}支付成功，金额{amount}' },
      ],
      settings: { siteName: 'COMICSN', langDefault: 'zh', langs: 'zh,en,pt', fileMaxMb: 20, videoMaxMb: 300, cdn: 'cdn.comicsn.com' },
      admins: ACCOUNTS.map(({ password, ...rest }) => rest),
      logs: [
        { id: 'lg_1', actor: '总部超管', role: 'super', module: '系统', action: '初始化后台数据', detail: 'seed v1', createdAt: now() },
      ],
      loginLogs: [
        { id: 'll_1', username: 'admin', ip: '127.0.0.1', result: '成功', createdAt: now() },
      ],
      alerts: [
        { id: 'al_1', level: 'warn', source: '支付', message: 'PIX 渠道近1小时失败率 18%', createdAt: now() },
      ],
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (!raw) return null;
      const db = JSON.parse(raw);
      return db && db.version ? db : null;
    } catch (err) {
      return null;
    }
  }

  const ASSET_DB = 'comicsn-admin-assets-v1';
  const assetUrlCache = {};

  function openAssetDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(ASSET_DB, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('files')) db.createObjectStore('files');
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('资源库打开失败'));
    });
  }

  function putAsset(key, blob) {
    return openAssetDb().then((idb) => new Promise((resolve, reject) => {
      const tx = idb.transaction('files', 'readwrite');
      tx.objectStore('files').put(blob, key);
      tx.oncomplete = () => resolve(key);
      tx.onerror = () => reject(tx.error || new Error('资源写入失败'));
    }));
  }

  function getAsset(key) {
    return openAssetDb().then((idb) => new Promise((resolve, reject) => {
      const tx = idb.transaction('files', 'readonly');
      const req = tx.objectStore('files').get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error || new Error('资源读取失败'));
    }));
  }

  function clearAssets() {
    Object.keys(assetUrlCache).forEach((k) => {
      try { URL.revokeObjectURL(assetUrlCache[k]); } catch (err) {}
      delete assetUrlCache[k];
    });
    return new Promise((resolve) => {
      const req = indexedDB.deleteDatabase(ASSET_DB);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
      req.onblocked = () => resolve();
    });
  }

  function assetUrl(ref) {
    if (!ref) return Promise.resolve('');
    if (typeof ref !== 'string' || !ref.startsWith('idb:')) return Promise.resolve(ref);
    if (assetUrlCache[ref]) return Promise.resolve(assetUrlCache[ref]);
    return getAsset(ref).then((blob) => {
      if (!blob) return '';
      if (typeof blob === 'string') {
        assetUrlCache[ref] = blob;
        return blob;
      }
      const url = URL.createObjectURL(blob);
      assetUrlCache[ref] = url;
      return url;
    });
  }

  function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('文件读取失败，请重试'));
      reader.readAsDataURL(file);
    });
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('图片无法解码，请换 jpg / png / webp'));
      img.src = src;
    });
  }

  function canvasToBlob(canvas, quality) {
    return new Promise((resolve) => {
      if (!canvas.toBlob) {
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        fetch(dataUrl).then((r) => r.blob()).then(resolve).catch(() => resolve(null));
        return;
      }
      canvas.toBlob((blob) => resolve(blob), 'image/jpeg', quality);
    });
  }

  function compressImage(file, opts) {
    const maxW = (opts && opts.maxW) || 1400;
    const quality = (opts && opts.quality) || 0.8;
    return readAsDataURL(file).then((src) => loadImage(src)).then((img) => {
      const scale = Math.min(1, maxW / Math.max(img.width, 1));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      return canvasToBlob(canvas, quality).then((blob) => {
        if (blob && blob.size) return blob;
        return fetch(canvas.toDataURL('image/jpeg', quality)).then((r) => r.blob());
      });
    });
  }

  function saveImage(file, opts) {
    if (!(file instanceof Blob)) return Promise.resolve('');
    const maxMb = Number((load() && load().settings && load().settings.fileMaxMb) || 20);
    if (file.size > maxMb * 1024 * 1024) {
      return Promise.reject(new Error('文件超过 ' + maxMb + 'MB 上限'));
    }
    const type = file.type || '';
    const ready = type.indexOf('image/') === 0 ? compressImage(file, opts) : Promise.resolve(file);
    return ready.then((blob) => {
      const key = 'idb:' + uid('as');
      return putAsset(key, blob).then(() => key);
    });
  }

  function saveFile(file, opts) {
    if (!(file instanceof Blob)) return Promise.resolve('');
    const settings = (load() && load().settings) || {};
    const kind = (opts && opts.kind) || ((file.type || '').indexOf('video/') === 0 ? 'video' : 'file');
    const maxMb = Number((opts && opts.maxMb) || (kind === 'video' ? (settings.videoMaxMb || 300) : (settings.fileMaxMb || 20)));
    if (file.size > maxMb * 1024 * 1024) {
      return Promise.reject(new Error('文件超过 ' + maxMb + 'MB 上限'));
    }
    const key = 'idb:' + uid(kind === 'video' ? 'vid' : 'as');
    return putAsset(key, file).then(() => key);
  }

  function save(data) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(data));
    } catch (err) {
      const quota = err && (err.name === 'QuotaExceededError' || err.code === 22 || err.code === 1014);
      throw new Error(quota
        ? '本地容量不足。封面和章节内容请重新上传（图片已改为独立存储）'
        : '保存失败，请重试');
    }
  }

  function migrate(data) {
    if (!data || typeof data !== 'object') return data;
    let changed = false;
    const comics = seedComics();
    const novels = seedNovels();
    const anime = seedAnime();
    const beforeComics = (data.comics || []).length;
    data.comics = mergeById(data.comics || [], comics);
    if (data.comics.length !== beforeComics) changed = true;
    const haveCh = new Set((data.chapters || []).map((c) => c.comicId));
    const extraCh = seedChapters(data.comics.filter((c) => !haveCh.has(c.id)));
    if (extraCh.length) {
      data.chapters = (data.chapters || []).concat(extraCh);
      changed = true;
    }
    if (!data.novels || !data.novels.length) {
      data.novels = novels;
      changed = true;
    } else {
      const n = data.novels.length;
      data.novels = mergeById(data.novels, novels);
      if (data.novels.length !== n) changed = true;
    }
    if (!data.novelChapters || !data.novelChapters.length) {
      data.novelChapters = seedNovelChapters(data.novels);
      changed = true;
    }
    const oldAnime = data.anime || [];
    const looksLegacy = oldAnime.length && oldAnime.every((a) => a.eps != null && a.chapterCount == null);
    if (!oldAnime.length || looksLegacy) {
      data.anime = mergeById(oldAnime.map((a) => {
        const fresh = anime.find((x) => x.id === a.id);
        return fresh ? Object.assign({}, fresh, {
          publishStatus: a.status === 'published' || !a.status ? (fresh.publishStatus || 'published') : a.status,
          title: a.title || fresh.title,
        }) : a;
      }), anime);
      changed = true;
    } else {
      const n = oldAnime.length;
      data.anime = mergeById(oldAnime, anime);
      if (data.anime.length !== n) changed = true;
    }
    if (!data.episodes || !data.episodes.length) {
      data.episodes = seedEpisodes(data.anime);
      changed = true;
    }
    const authors = makeAuthors(data.comics || [], 'comic')
      .concat(makeAuthors(data.novels || [], 'novel'), makeAuthors(data.anime || [], 'anime'));
    if (!(data.authors || []).some((a) => a.kind)) {
      data.authors = authors;
      changed = true;
    } else {
      const n = (data.authors || []).length;
      data.authors = mergeById(data.authors || [], authors);
      if (data.authors.length !== n) changed = true;
    }
    if (!(data.categories || []).some((c) => c.kind)) {
      const old = data.categories || [];
      data.categories = old.length
        ? ['comic', 'novel', 'anime'].reduce((acc, kind) => acc.concat(old.map((c, i) => ({
          id: `${kind}:${c.key || c.id || i}`,
          kind,
          key: c.key || c.id,
          name: c.name,
          sort: c.sort || i + 1,
          status: c.status || 'on',
        }))), [])
        : seedCategories();
      changed = true;
    } else {
      const n = data.categories.length;
      data.categories = mergeById(data.categories, seedCategories());
      if (data.categories.length !== n) changed = true;
    }
    if (!(data.tags || []).some((t) => t.kind)) {
      const old = data.tags || [];
      data.tags = old.length
        ? ['comic', 'novel', 'anime'].reduce((acc, kind) => acc.concat(old.map((t, i) => ({
          id: `${kind}:${t.id || i}`,
          kind,
          name: t.name,
          status: t.status || 'on',
        }))), [])
        : seedTags();
      changed = true;
    } else {
      const n = data.tags.length;
      data.tags = mergeById(data.tags, seedTags());
      if (data.tags.length !== n) changed = true;
    }
    (data.reviews || []).forEach((r) => {
      if (r.kind) return;
      r.kind = (r.targetType === 'novel' || r.targetType === 'novel-chapter')
        ? 'novel'
        : (r.targetType === 'anime' || r.targetType === 'episode') ? 'anime' : 'comic';
      changed = true;
    });
    if ((data.version || 0) < 3) {
      data.version = 3;
      changed = true;
    }
    if (data.settings && !data.settings.videoMaxMb) {
      data.settings.videoMaxMb = 300;
      changed = true;
    }
    const siteOps = seedSiteOps();
    ['banners', 'recommends', 'news', 'faq', 'searchHots', 'searchKeywords'].forEach((key) => {
      const before = (data[key] || []).length;
      data[key] = mergeById(data[key] || [], siteOps[key]);
      if (data[key].length !== before) changed = true;
    });
    (data.banners || []).forEach((b) => {
      if (!b.slot) { b.slot = b.jumpType === 'ad' ? 'menu' : 'home'; changed = true; }
    });
    (data.recommends || []).forEach((r) => {
      if (!r.workId && r.comicId) { r.workId = r.comicId; changed = true; }
      if (!r.kind) { r.kind = 'comic'; changed = true; }
      if (r.slot === 'week') { r.slot = 'rank-manga'; changed = true; }
      if (r.slot === 'home') { r.slot = 'more'; changed = true; }
    });
    if ((data.version || 0) < 4) {
      data.version = 4;
      changed = true;
    }
    return changed;
  }

  function db() {
    let data = load();
    if (!data) {
      data = seed();
      save(data);
      return data;
    }
    if (migrate(data)) save(data);
    return data;
  }

  function commit(mutator, log) {
    const data = db();
    mutator(data);
    if (log) {
      data.logs.unshift({
        id: uid('lg'),
        actor: log.actor || '系统',
        role: log.role || '',
        module: log.module || '',
        action: log.action || '',
        detail: log.detail || '',
        createdAt: now(),
      });
    }
    save(data);
    return data;
  }

  function session() {
    try {
      return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
    } catch (err) {
      return null;
    }
  }

  function setSession(value) {
    if (!value) sessionStorage.removeItem(SESSION_KEY);
    else sessionStorage.setItem(SESSION_KEY, JSON.stringify(value));
  }

  function can(perm) {
    const s = session();
    if (!s) return false;
    const role = ROLES[s.role];
    if (!role) return false;
    return role.perms.includes('*') || role.perms.includes(perm);
  }

  function failState() {
    try {
      return JSON.parse(sessionStorage.getItem(FAIL_KEY) || '{"n":0,"until":0}');
    } catch (err) {
      return { n: 0, until: 0 };
    }
  }

  function markFail() {
    const st = failState();
    st.n += 1;
    if (st.n >= 5) st.until = Date.now() + 30000;
    sessionStorage.setItem(FAIL_KEY, JSON.stringify(st));
    return st;
  }

  function clearFail() {
    sessionStorage.removeItem(FAIL_KEY);
  }

  function login(username, password) {
    const st = failState();
    if (st.until && Date.now() < st.until) {
      return { ok: false, error: '尝试过多，请稍后再试' };
    }
    const acc = ACCOUNTS.find((a) => a.username === username && a.password === password && a.status === 'active');
    if (!acc) {
      markFail();
      return { ok: false, error: '账号或密码错误' };
    }
    clearFail();
    const token = uid('tk');
    const s = { token, userId: acc.id, username: acc.username, name: acc.name, role: acc.role };
    setSession(s);
    commit((data) => {
      data.loginLogs.unshift({ id: uid('ll'), username, ip: '127.0.0.1', result: '成功', createdAt: now() });
    }, { actor: acc.name, role: acc.role, module: '认证', action: '登录', detail: username });
    return { ok: true, session: s };
  }

  function logout() {
    const s = session();
    if (s) {
      commit(() => {}, { actor: s.name, role: s.role, module: '认证', action: '退出', detail: s.username });
    }
    setSession(null);
  }

  global.AdminStore = {
    ROLES,
    ACCOUNTS,
    CAT_MAP,
    EXTRA_BY_CAT,
    uid,
    now,
    daysAgo,
    db,
    save,
    commit,
    session,
    setSession,
    can,
    login,
    logout,
    saveImage,
    saveFile,
    assetUrl,
    reset() {
      localStorage.removeItem(DB_KEY);
      return clearAssets().then(() => db());
    },
  };
})(window);
