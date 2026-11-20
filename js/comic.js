(function () {
  'use strict';

  const shared = window.ComicsShared || {};
  const COMICS = shared.COMICS || [];
  const escapeHtml = shared.escapeHtml;
  const dateOfIssue = shared.dateOfIssue;
  const pickLang = shared.pickLang;
  const phrase = shared.localizedPhrase;
  function tt(key, fallback) {
    return shared.t(key, fallback);
  }

  const EXTRA_KEYWORDS = {
    bully: ['青春', '欢喜'],
    evolution: ['热血', '进化'],
    muscle: ['竞技', '热血'],
    angel: ['暗恋', '对立'],
  };

  const EPISODE_TITLES = {
    bully: ['初次相遇', '意外的约定', '食堂风波', '秘密基地', '雨天的告白', '新的开始'],
    evolution: ['觉醒', '第一次进化', '太空裂隙', '怪兽来袭', '同伴', '新世界'],
    muscle: ['入场', '试炼', '女巫之力', '竞技场', '反转', '冠军之路'],
  };

  const GENERIC_TITLES = ['序幕', '意外的相遇', '靠近', '误会', '转折', '心意'];
  const EPISODE_SUMMARIES = {
    bully: [
      {
        zh: '开学第一天，平凡少年与校园恶霸意外相撞，传说里的距离忽然变得很近。',
        en: 'On the first day of school, an ordinary boy collides with the campus bully. The legend is suddenly close enough to touch.',
        pt: 'No primeiro dia de aula, um garoto comum esbarra no valentão. A lenda fica perto o bastante para tocar.',
      },
      {
        zh: '布告栏上的字条把两人约上天台，一场逃不掉的约定就此开始。',
        en: 'A note on the board sends them to the rooftop. A promise neither can escape begins.',
        pt: 'Um bilhete no mural os chama ao terraço. Começa uma promessa da qual não dá para fugir.',
      },
      {
        zh: '食堂里找不到位子的少年，被拉到了那张没人敢坐的桌子。',
        en: 'The boy who cannot find a seat is pulled to the table nobody else dares to take.',
        pt: 'O garoto sem lugar é puxado para a mesa de que ninguém ousa se aproximar.',
      },
      {
        zh: '旧教学楼的空教室成了只属于两个人的秘密基地。',
        en: 'An unused classroom in the old building becomes a base that belongs only to them.',
        pt: 'Uma sala vazia no prédio antigo vira a base secreta só deles.',
      },
      {
        zh: '暴雨里只剩一把伞，心跳比雨声更响。',
        en: 'Only one umbrella is left in the storm. Heartbeats drown out the rain.',
        pt: 'Na tempestade sobra só um guarda-chuva. O coração fala mais alto que a chuva.',
      },
      {
        zh: '新学期的座位表打乱了，他终于问出那句迟到的话。',
        en: 'The new seating chart shuffles everything. He finally asks the question that came too late.',
        pt: 'A nova lista de lugares bagunça tudo. Ele finalmente faz a pergunta atrasada.',
      },
    ],
  };
  const GENERIC_SUMMARIES = [
    {
      zh: '关系出现新的裂痕，谁也不愿先开口。',
      en: 'A new crack appears. Neither wants to speak first.',
      pt: 'Surge uma nova rachadura. Ninguém quer falar primeiro.',
    },
    {
      zh: '一次意外让两人不得不并肩面对。',
      en: 'An accident forces them to stand side by side.',
      pt: 'Um acaso os obriga a ficar lado a lado.',
    },
    {
      zh: '隐藏已久的心意，在这一集里慢慢浮出水面。',
      en: 'Feelings kept hidden slowly surface in this episode.',
      pt: 'Sentimentos escondidos vêm à tona neste episódio.',
    },
    {
      zh: '过去的秘密被揭开一角，故事再难回头。',
      en: 'A corner of the past is peeled back. There is no going back.',
      pt: 'Um canto do passado se abre. Não há volta.',
    },
    {
      zh: '日常里的一次靠近，改变了原有的距离。',
      en: 'One ordinary step closer changes the distance between them.',
      pt: 'Um passo comum muda a distância entre os dois.',
    },
    {
      zh: '对峙之后，两人第一次认真看清对方。',
      en: 'After the clash, they finally look at each other for real.',
      pt: 'Depois do confronto, eles finalmente se veem de verdade.',
    },
  ];

  function keywordsOf(item) {
    return shared.keywordsOf(item, EXTRA_KEYWORDS);
  }

  function detailsOf(item) {
    const locTitle = shared.localizedTitle(item);
    if (item.id === 'bully') {
      return pickLang({
        zh: '校园里的恶霸与平凡少年，因一次意外结缘。在欢笑与误会中，两人逐渐走近，展开一段温暖又啼笑皆非的青春恋曲。',
        en: 'A school bully and an ordinary boy are thrown together by accident. Through laughs and mix-ups they grow close in a warm, messy coming-of-age romance.',
        pt: 'Um valentão da escola e um garoto comum se cruzam por acaso. Entre risos e mal-entendidos, eles se aproximam num romance adolescente quente e atrapalhado.',
      });
    }
    const tags = keywordsOf(item).map((tag) => `#${tag}`).join(' ');
    const ep = shared.localizedEp(item.ep);
    const key = item.status === 'ended' ? 'detailsEndedTpl' : 'detailsUpdatingTpl';
    return tt(key, '').replace('{title}', locTitle).replace('{ep}', ep).replace('{tags}', tags);
  }

  function episodeCountOf(item) {
    const match = String(item.ep || '').match(/(\d+)/);
    const named = EPISODE_TITLES[item.id] || GENERIC_TITLES;
    return Math.max(match ? parseInt(match[1], 10) : named.length, named.length, 1);
  }

  function summaryOf(item, n, title) {
    const listed = EPISODE_SUMMARIES[item.id];
    const raw = listed && listed[n - 1] ? listed[n - 1] : GENERIC_SUMMARIES[(n - 1) % GENERIC_SUMMARIES.length];
    const text = pickLang(raw, typeof raw === 'string' ? raw : '');
    const locTitle = phrase(title);
    if (locTitle && !(listed && listed[n - 1])) return `${locTitle}. ${text}`;
    return text;
  }

  function episodesOf(item) {
    const named = EPISODE_TITLES[item.id] || GENERIC_TITLES;
    const total = episodeCountOf(item);
    const list = [];
    for (let i = 1; i <= total; i += 1) {
      const rawTitle = named[i - 1] || '';
      list.push({
        n: i,
        title: phrase(rawTitle),
        date: dateOfIssue(item, i),
        summary: summaryOf(item, i, rawTitle),
      });
    }
    return list;
  }

  const params = new URLSearchParams(window.location.search);
  const comic = shared.findById(COMICS, params.get('id') || 'bully', 'bully');
  if (!comic) return;

  const cover = shared.coverOf(comic, COMICS);
  let allChapters = episodesOf(comic);
  let tags = keywordsOf(comic);
  const baseLikes = shared.parseViews(comic.likes);

  function readerUrl(ep) {
    return `reader.html?id=${encodeURIComponent(comic.id)}&ep=${ep}`;
  }

  function renderChapters(visible) {
    const list = document.getElementById('novelChapterList');
    if (!list) return;
    list.innerHTML = (visible || []).map((ch) => {
      const isFree = ch.n === 1;
      return `
      <a href="${readerUrl(ch.n)}" class="novel-chapter-row has-thumb" data-ep="${ch.n}">
        <img class="novel-chapter-thumb" src="${cover}" alt="" loading="lazy">
        <span class="novel-chapter-body">
          <span class="novel-chapter-name"><span class="novel-chapter-num">${shared.epLabel(ch.n, 'comic')}</span></span>
          <span class="novel-chapter-summary">${escapeHtml(ch.summary)}</span>
          <time class="novel-chapter-date" datetime="${ch.date}">${tt('updatedOn', '更新于')} ${ch.date}</time>
        </span>
        <span class="novel-chapter-flag ${isFree ? 'is-free' : 'is-vip'}">${isFree ? tt('tabFree', '免费') : 'VIP'}</span>
      </a>
    `;
    }).join('');
  }

  function renderAll() {
    allChapters = episodesOf(comic);
    tags = keywordsOf(comic);
    const crumb = shared.crumbTagOf(comic, 'school', 'hashManga', '#漫画');
    shared.fillWorkDetailShell(comic, {
      cover,
      tags,
      crumbLabel: crumb.label,
      crumbHref: 'manga.html',
      details: detailsOf(comic),
      readHref: readerUrl(1),
      readLabel: tt('freeWatch', '免费观看第1集 >'),
    });
    shared.renderRelatedWorks(
      document.getElementById('novelRelated'),
      COMICS,
      comic.id,
      (item) => `comic.html?id=${encodeURIComponent(item.id)}`,
      { list: COMICS, tagsOf: (item) => keywordsOf(item).slice(0, 4) }
    );
  }

  shared.bindWorkDetailPage(comic, 'comic', {
    pageSize: 10,
    baseLikes,
    getChapters: () => allChapters,
    renderChapters,
    render: renderAll,
  });
})();
