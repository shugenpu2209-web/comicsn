(function () {
  'use strict';

  const shared = window.ComicsShared || {};
  const NOVELS = shared.NOVELS || [];
  const escapeHtml = shared.escapeHtml;
  const dateOfIssue = shared.dateOfIssue;
  const pickLang = shared.pickLang;
  const phrase = shared.localizedPhrase;
  function tt(key, fallback) {
    return shared.t(key, fallback);
  }

  const EXTRA_KEYWORDS = {
    'night-store': ['都市', '甜宠'],
    'villain-love': ['穿越', '宫斗'],
    'campus-xianxia': ['修仙', '青春'],
    'ceo-standin': ['豪门', '甜宠'],
    'last-garden': ['末世', '生存'],
    'roommate-rules': ['同居', '青春'],
    'starlight-her': ['都市', '治愈'],
    'library-reader': ['悬疑', '青春'],
    'inn-rebirth': ['重生', '江湖'],
    'cat-next-door': ['治愈', '日常'],
  };

  function keywordsOf(item) {
    return shared.keywordsOf(item, EXTRA_KEYWORDS);
  }

  function detailsOf(item) {
    const locTitle = shared.localizedTitle(item);
    if (item.id === 'night-store') {
      return pickLang({
        zh: '深夜便利店的关店铃一响，打工少年与常客之间那些没说出口的话，才刚刚开始。在冷柜灯光和热罐咖啡的气味里，告白来得又晚又真。',
        en: 'When the closing bell rings, the words the clerk and the regular never said are only just beginning. In freezer light and canned coffee, the confession comes late and true.',
        pt: 'Quando o sino de fechar toca, as palavras que o atendente e o freguês não disseram só então começam. Na luz do freezer e no café quente, a confissão chega tarde e sincera.',
      });
    }
    if (item.id === 'villain-love') {
      return pickLang({
        zh: '转生成恶役千金本该按剧本走向灭亡，可她只想把恋爱这件事谈明白。宫廷夜宴、秘密同盟与一次次不该心动的靠近之后，原作的结局开始松动。',
        en: 'Reborn as the villainess, she was meant to fall on cue. She would rather get the love story straight. After palace banquets, secret alliances, and closeness she was not supposed to feel, the original ending starts to slip.',
        pt: 'Renascida como a vilã, ela deveria cair no tempo certo. Prefere acertar o romance. Depois de banquetes, alianças secretas e aproximações proibidas, o final original começa a ceder.',
      });
    }
    const tags = keywordsOf(item).map((tag) => `#${tag}`).join(' ');
    const ep = shared.localizedEp(item.ep, 'novel');
    const key = item.status === 'ended' ? 'detailsEndedTpl' : 'detailsUpdatingTpl';
    return tt(key, '').replace('{title}', locTitle).replace('{ep}', ep).replace('{tags}', tags);
  }

  function chaptersOf(item) {
    const total = shared.novelChapterCount(item);
    const list = [];
    for (let i = 1; i <= total; i += 1) {
      list.push({
        n: i,
        title: phrase(shared.novelChapterTitle(item, i)),
        date: dateOfIssue(item, i),
      });
    }
    return list;
  }

  const params = new URLSearchParams(window.location.search);
  const novel = shared.findById(NOVELS, params.get('id') || 'night-store');
  if (!novel) return;

  const cover = shared.coverOf(novel, NOVELS);
  let allChapters = chaptersOf(novel);
  let tags = keywordsOf(novel);
  const baseLikes = shared.parseViews(novel.likes);

  function readerUrl(ep) {
    return `novel-reader.html?id=${encodeURIComponent(novel.id)}&ep=${ep}`;
  }

  function renderChapters(visible) {
    const list = document.getElementById('novelChapterList');
    if (!list) return;
    list.innerHTML = (visible || []).map((ch) => {
      const isFree = ch.n === 1;
      const title = ch.title ? escapeHtml(ch.title) : '';
      return `
      <a href="${readerUrl(ch.n)}" class="novel-chapter-row" data-ep="${ch.n}">
        <span class="novel-chapter-body">
          <span class="novel-chapter-name"><span class="novel-chapter-num">${shared.epLabel(ch.n, 'novel')}</span>${title}</span>
          <time class="novel-chapter-date" datetime="${ch.date}">${tt('updatedOn', '更新于')} ${ch.date}</time>
        </span>
        <span class="novel-chapter-flag ${isFree ? 'is-free' : 'is-vip'}">${isFree ? tt('tabFree', '免费') : 'VIP'}</span>
      </a>
    `;
    }).join('');
  }

  function renderAll() {
    allChapters = chaptersOf(novel);
    tags = keywordsOf(novel);
    const crumb = shared.crumbTagOf(novel, 'romance', 'hashNovel', '#小说');
    shared.fillWorkDetailShell(novel, {
      cover,
      tags,
      crumbLabel: crumb.label,
      crumbHref: 'novel.html',
      details: detailsOf(novel),
      readHref: readerUrl(1),
      readLabel: tt('freeRead', '免费阅读第1章 >'),
      metaSuffix: ' 作品详情',
    });
    shared.renderRelatedWorks(
      document.getElementById('novelRelated'),
      NOVELS,
      novel.id,
      (item) => `novel-detail.html?id=${encodeURIComponent(item.id)}`,
      { list: NOVELS, tagsOf: (item) => keywordsOf(item).slice(0, 4) }
    );
  }

  shared.bindWorkDetailPage(novel, 'novel', {
    pageSize: 20,
    baseLikes,
    getChapters: () => allChapters,
    renderChapters,
    render: renderAll,
  });
})();
