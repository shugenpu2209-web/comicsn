(function () {
  'use strict';

  const shared = window.ComicsShared || {};
  const NOVELS = shared.NOVELS || [];
  const canRead = shared.canRead;
  function tt(key, fallback) {
    return (shared.t && shared.t(key, fallback)) || fallback || '';
  }
  function phrase(text) {
    return shared.localizedPhrase ? shared.localizedPhrase(text) : text;
  }
  const PROGRESS_KEY = 'comicsn-novel-reader-progress';
  const SETTINGS_KEY = 'comicsn-novel-reader-settings';

  const STORIES = {
    'villain-love': {
      1: [
        { zh: '她是在钟声里醒来的。', en: 'She woke inside the sound of a bell.', pt: 'Ela acordou dentro do som de um sino.' },
        { zh: '不是殿里那口青铜钟，是原作开篇写过的、只敲给恶役千金听的那一声——提醒她：今天开始，你要按剧本走向灭亡。', en: 'Not the bronze bell in the hall. The one from the original opening, meant only for the villainess: from today, you die on cue.', pt: 'Não o sino de bronze do salão. Aquele do prólogo original, só para a vilã: a partir de hoje, você cai no texto.' },
        { zh: '江澄舟坐起身。梳妆镜里的脸比记忆里更年轻，眼尾还没有被宫廷的灯火熬红。窗外是初春的御花园，紫藤还没开，命运倒先开了。', en: 'Jiang Chengzhou sat up. The face in the mirror was younger than memory. Outside, the imperial garden was still early spring. Wisteria had not bloomed. Fate had.', pt: 'Jiang Chengzhou sentou. O rosto no espelho era mais jovem que a memória. Lá fora, o jardim imperial ainda era início de primavera. A glicínia não floresceu. O destino, sim.' },
        { zh: '「小姐，殿下的请柬到了。」侍女把信封放在妆台上，声音发着抖。原作里，这封请柬会把她送进第一场羞辱。', en: '“Miss, the prince’s invitation is here.” The maid’s voice shook. In the original, this letter walked her into the first humiliation.', pt: '“Senhorita, o convite do príncipe chegou.” A voz da criada tremia. No original, essa carta a levava à primeira humilhação.' },
        { zh: '她拆开。字迹漂亮，内容恶毒。她却笑了一下。', en: 'She opened it. Pretty handwriting, poisonous content. She smiled anyway.', pt: 'Ela abriu. Letra linda, conteúdo venenoso. Mesmo assim sorriu.' },
        { zh: '「回信。就说——我去。」', en: '“Reply. Tell them I will go.”', pt: '“Responda. Diga que eu vou.”' },
        { zh: '侍女愣住。「可、可是……那样会中计的。」', en: 'The maid froze. “B-but… that is walking into the trap.”', pt: 'A criada congelou. “M-mas… isso é cair na armadilha.”' },
        { zh: '「没有原作了。」江澄舟把信纸对折，塞进袖中，「从今天起，我要谈一场不该谈的恋爱。」', en: '“There is no original anymore.” She folded the letter into her sleeve. “From today, I will have the love I was not supposed to have.”', pt: '“Não há mais original.” Ela dobrou a carta na manga. “A partir de hoje, vou viver o amor que não deveria.”' },
        { zh: '廊下有脚步声。那个本该在第三章才登场的人，此刻竟提前出现在朱红门槛外。他看着她，像在确认一份被改过的剧本。', en: 'Footsteps in the corridor. The man who should not appear until chapter three was already at the vermilion threshold, checking a rewritten script.', pt: 'Passos no corredor. O homem que só deveria entrar no capítulo três já estava no limiar vermelho, conferindo um roteiro reescrito.' },
        { zh: '江澄舟迎上去，行了一礼，声音很稳：「今日起，请多指教。」', en: 'She stepped forward, bowed, and said evenly, “From today, I look forward to working with you.”', pt: 'Ela avançou, fez uma reverência e disse com firmeza: “A partir de hoje, conta comigo.”' },
        { zh: '重生第一天。太阳才刚升起来，反派已经决定不按规矩死。', en: 'Day one of the rebirth. The sun had barely risen. The villain had already decided not to die on schedule.', pt: 'Primeiro dia do renascimento. O sol mal tinha subido. A vilã já decidiu não morrer no prazo.' },
      ],
      2: [
        { zh: '宫廷里的人最擅长一件事：把你按回原作的位置。', en: 'People at court are best at one thing: pressing you back into the original role.', pt: 'A corte é boa em uma coisa: te empurrar de volta ao papel original.' },
        { zh: '江澄舟刚踏进议事厅，便听见有人低声说：「恶役千金今天倒是准时。」她没反驳，只把扇骨收得更紧。', en: 'She had barely entered the hall when someone whispered, “The villainess is on time today.” She did not argue. She only closed the fan tighter.', pt: 'Mal entrou no salão e ouviu: “A vilã chegou no horário.” Não contestou. Só fechou o leque com mais força.' },
      ],
      112: [
        { zh: '夜宴散场之后，灯火只剩廊下那一溜。', en: 'After the banquet, only a line of lanterns was left along the corridor.', pt: 'Depois do banquete, restava só uma fileira de lanternas no corredor.' },
        { zh: '他靠得很近，近到能看清她睫毛上未干的酒意。原作里，这一章本该是阴谋收网；可他伸出的手，更像一次蓄谋已久的偏爱。', en: 'He stood close enough to see wine still on her lashes. In the original this chapter was a trap. The hand he offered looked more like a long-planned kindness.', pt: 'Ele chegou perto o bastante para ver o vinho nas pestanas. No original, este capítulo era uma armadilha. A mão que ele estendeu parecia um carinho planejado há tempo.' },
        { zh: '「这就是你的手段？」江澄舟问。', en: '“These are your methods?” she asked.', pt: '“Esses são os seus métodos?” ela perguntou.' },
        { zh: '「对。」他答得毫不心虚，「恶魔专用。专门用来让你活下去。」', en: '“Yes,” he said without shame. “Devil’s methods. Made to keep you alive.”', pt: '“Sim”, disse sem culpa. “Métodos de demônio. Feitos para você viver.”' },
        { zh: '她本想笑他荒唐，话到嘴边却软了。袖里那封旧请柬被捏出了折痕，像把一百一十二章的命运重新折成另一条路。', en: 'She meant to laugh at him. The words went soft. The old invitation in her sleeve creased, folding chapter one hundred twelve into another road.', pt: 'Ela ia rir dele. As palavras amoleceram. O convite antigo na manga amarrotou, dobrando o capítulo 112 em outro caminho.' },
        { zh: '紫藤在夜里无声地开了。这一次，灭亡没有如期而至。', en: 'Wisteria opened silently in the dark. This time, ruin did not arrive on schedule.', pt: 'A glicínia abriu em silêncio na noite. Desta vez, a ruína não chegou no prazo.' },
      ],
    },
    'night-store': {
      1: [
        { zh: '关店铃响的时候，便利店只剩两个人。', en: 'When the closing bell rang, only two people were left in the store.', pt: 'Quando o sino de fechar tocou, só restavam duas pessoas na loja.' },
        { zh: '林晚星把冷柜门关上，热罐咖啡的蒸汽在玻璃上画出一小片雾。常客站在门口，像还没决定要不要把那句话带回去。', en: 'Lin Wanxing shut the freezer. Steam from a hot can painted fog on the glass. The regular stood at the door, still deciding whether to take the sentence home.', pt: 'Lin Wanxing fechou o freezer. O vapor do café desenhou névoa no vidro. O freguês ficou na porta, ainda decidindo se levaria a frase embora.' },
        { zh: '「今天……也加班？」少年问得很轻。', en: '“Working late again… today?” the boy asked, almost not asking.', pt: '“Hoje… também hora extra?” o garoto perguntou quase sem voz.' },
        { zh: '「关店铃响了，就不算加班。」她把找零放进托盘，指尖在硬币边上停了一下，「要不要再拿一罐热的？」', en: '“Once the bell rings, it is not overtime.” She set the change down, paused on the coin. “Want another hot can?”', pt: '“Quando o sino toca, não é hora extra.” Ela pousou o troco e parou na moeda. “Quer outra lata quente?”' },
        { zh: '门外的雨还没停。夜班的灯把两个人的影子叠在一起，像一句还没说出口的告白，先学会了等待。', en: 'Rain still fell outside. Night-shift light stacked their shadows together, a confession that had learned to wait.', pt: 'A chuva lá fora não parava. A luz do turno da noite sobrepôs as sombras, uma confissão que aprendeu a esperar.' },
      ],
    },
  };

  const GENERIC_STORY = {
    zh: (heading, author, n) => [
      `「${heading}」这一天来得并不突然。${author}站在熟悉又陌生的光里，把上一回没说完的话重新咽回去。`,
      `第${n}章的风从走廊那头吹过来。该发生的事还在轨道上，可结局已经开始松动。`,
      `有人在远处喊名字。声音很轻，轻到像一句还没被写进正文的旁白。`,
      `袖口被理平。恋爱也好，覆灭也好，这一次要自己选。`,
    ],
    en: (heading, author, n) => [
      `“${heading}” did not arrive suddenly. ${author} stood in light that was both familiar and strange, swallowing the sentence left unfinished last time.`,
      `Chapter ${n}’s wind comes down the hall. What should happen is still on the rails. The ending has already started to slip.`,
      `Someone calls a name in the distance, light enough to be narration that has not made it into the page yet.`,
      `Sleeves are smoothed. Love or ruin — this time the choice is theirs.`,
    ],
    pt: (heading, author, n) => [
      `“${heading}” não chegou de surpresa. ${author} ficou na luz familiar e estranha, engolindo a frase que ficou pela metade.`,
      `O vento do capítulo ${n} vem pelo corredor. O que deveria acontecer ainda está nos trilhos. O final já começou a ceder.`,
      `Alguém chama um nome ao longe, leve como uma narração que ainda não entrou no texto.`,
      `A manga é ajeitada. Amor ou ruína — desta vez a escolha é deles.`,
    ],
  };

  const els = {
    reader: document.getElementById('reader'),
    stage: document.getElementById('readerStage'),
    title: document.getElementById('novelReaderTitle'),
    label: document.getElementById('readerEpisodeLabel'),
    back: document.getElementById('novelReaderBack'),
    bar: document.getElementById('readerProgressBar'),
    prev: document.getElementById('readerPrev'),
    next: document.getElementById('readerNext'),
    listBtn: document.getElementById('readerListBtn'),
    listSheet: document.getElementById('readerListSheet'),
    list: document.getElementById('readerEpisodeList'),
    settingsBtn: document.getElementById('readerSettingsBtn'),
    settingsSheet: document.getElementById('readerSettingsSheet'),
  };

  const params = new URLSearchParams(window.location.search);
  const novel = (NOVELS.find((item) => item.id === params.get('id')) || NOVELS[0]);
  if (!novel) return;

  function chaptersOf(item) {
    const total = shared.novelChapterCount(item);
    const list = [];
    for (let i = 1; i <= total; i += 1) {
      list.push({
        n: i,
        title: phrase(shared.novelChapterTitle(item, i)),
        date: '2025-08-12',
        free: i === 1 || !!item.free,
      });
    }
    return list;
  }

  const escapeHtml = shared.escapeHtml;

  function paragraphsOf(ch) {
    const lang = shared.currentLang ? shared.currentLang() : 'zh';
    const custom = STORIES[novel.id] && STORIES[novel.id][ch.n];
    if (custom) {
      return custom.map((p) => (typeof p === 'string' ? p : (p[lang] || p.zh || p.en || '')));
    }
    const heading = ch.title || (shared.epLabel ? shared.epLabel(ch.n, 'novel') : `第${ch.n}章`);
    const author = phrase(novel.author || '') || (lang === 'zh' ? '她' : 'She');
    const pack = GENERIC_STORY[lang] || GENERIC_STORY.zh;
    return pack(heading, author, ch.n);
  }

  const CHAPTERS = chaptersOf(novel);
  const detailHref = `novel-detail.html?id=${encodeURIComponent(novel.id)}`;
  let currentEp = 1;
  let hideTimer = 0;
  let ignoreScroll = false;

  function clampEp(value) {
    const num = Number(value) || 1;
    return Math.min(CHAPTERS.length, Math.max(1, num));
  }

  function chapterById(id) {
    return CHAPTERS.find((item) => item.n === id) || CHAPTERS[0];
  }

  function chapterLabel(ch) {
    return ch.title ? `${shared.epLabel ? shared.epLabel(ch.n, 'novel') : ('第' + ch.n + '章')} · ${ch.title}` : (shared.epLabel ? shared.epLabel(ch.n, 'novel') : `第${ch.n}章`);
  }

  function readerHref(ep) {
    return `novel-reader.html?id=${encodeURIComponent(novel.id)}&ep=${ep}`;
  }

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) || 'null') || {};
    } catch (err) {
      return {};
    }
  }

  function saveProgress(extra) {
    const payload = Object.assign({ novelId: novel.id, ep: currentEp, ratio: 0 }, loadProgress(), extra);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(payload));
  }

  function loadSettings() {
    try {
      return Object.assign({ font: 'md', theme: 'night' }, JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null'));
    } catch (err) {
      return { font: 'md', theme: 'night' };
    }
  }

  function saveSettings(settings) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  function applySettings(settings) {
    els.reader.classList.remove('is-theme-night', 'is-theme-paper', 'is-theme-day');
    els.reader.classList.add('is-theme-' + settings.theme);
    document.documentElement.style.background = getComputedStyle(els.reader).getPropertyValue('--nr-bg');
    document.body.style.background = getComputedStyle(els.reader).getPropertyValue('--nr-bg');
    els.stage.classList.remove('is-font-sm', 'is-font-md', 'is-font-lg');
    els.stage.classList.add('is-font-' + settings.font);
    document.querySelectorAll('[data-font]').forEach((btn) => {
      btn.classList.toggle('is-on', btn.dataset.font === settings.font);
    });
    document.querySelectorAll('[data-theme]').forEach((btn) => {
      btn.classList.toggle('is-on', btn.dataset.theme === settings.theme);
    });
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute('content', settings.theme === 'night' ? '#0e0e0f' : settings.theme === 'paper' ? '#f3ead4' : '#f4f4f4');
  }

  function renderLock(ch) {
    return `
      <section class="reader-lock">
        <p class="reader-lock-kicker">${tt('membership', '会员资格')}</p>
        <h2>${tt('continueRead', '开通 VIP 继续阅读')}</h2>
        <p>${tt('lockFromCh', '第{n}章起为 VIP 专属，开通后可继续阅读').replace('{n}', String(ch.n))}</p>
        <a class="reader-lock-btn" href="mypage.html#vip">${tt('goVip', '前往充值')}</a>
      </section>
    `;
  }

  function renderEnd(ch) {
    const next = chapterById(ch.n + 1);
    const hasNext = ch.n < CHAPTERS.length;
    return `
      <section class="reader-end">
        <h2>${tt('chDone', '第{n}章 完').replace('{n}', String(ch.n))}</h2>
        <p>${hasNext ? tt('nextCh', '下一章：') + chapterLabel(next) : tt('latestCh', '已是最新一章')}</p>
        <div class="reader-end-actions">
          ${hasNext ? `<button type="button" class="reader-end-btn is-primary" data-go-ep="${next.n}">${tt('readNextCh', '阅读下一章')}</button>` : ''}
          <a class="reader-end-btn is-ghost" href="${detailHref}">${tt('backToWork', '返回作品页')}</a>
        </div>
      </section>
    `;
  }

  function renderEpisodeList() {
    els.list.innerHTML = CHAPTERS.map((item) => `
      <button type="button" class="reader-ep-item${item.n === currentEp ? ' is-current' : ''}" data-go-ep="${item.n}">
        <span>
          <strong>${escapeHtml(chapterLabel(item))}</strong>
          <small>${item.date}</small>
        </span>
        <span class="reader-ep-badge ${item.free ? 'is-free' : 'is-vip'}">${item.free ? tt('tabFree', '免费') : tt('members', '会员')}</span>
      </button>
    `).join('');
  }

  function updateProgress() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const ratio = max <= 0 ? 0 : Math.min(1, Math.max(0, window.scrollY / max));
    if (els.bar) els.bar.style.width = (ratio * 100).toFixed(1) + '%';
    saveProgress({ novelId: novel.id, ep: currentEp, ratio: Number(ratio.toFixed(3)) });
  }

  function showChrome(autoHide) {
    els.reader.classList.add('is-chrome-on');
    clearTimeout(hideTimer);
    if (autoHide) {
      hideTimer = window.setTimeout(() => els.reader.classList.remove('is-chrome-on'), 2800);
    }
  }

  function setSheet(sheet, open) {
    if (!sheet) return;
    sheet.classList.toggle('is-open', open);
    sheet.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function closeSheets() {
    setSheet(els.listSheet, false);
    setSheet(els.settingsSheet, false);
  }

  function render(ep, options) {
    const ch = chapterById(ep);
    const locked = !canRead(ch);
    const paras = paragraphsOf(ch);
    const visible = locked ? paras.slice(0, 2) : paras;
    currentEp = ch.n;
    const locTitle = shared.localizedTitle ? shared.localizedTitle(novel) : novel.title;
    document.title = `${chapterLabel(ch)} - ${locTitle} - COMICSN`;
    if (els.title) els.title.textContent = locTitle;
    if (els.label) els.label.textContent = chapterLabel(ch);
    if (els.back) els.back.href = detailHref;
    els.prev.disabled = ch.n <= 1;
    els.next.disabled = ch.n >= CHAPTERS.length;
    els.prev.textContent = tt('prevCh', '上一章');
    els.next.textContent = tt('nextChBtn', '下一章');
    els.stage.innerHTML = `
      <article class="nr-article">
        <header class="nr-head">
          <p class="nr-kicker">COMICSN NOVEL</p>
          <h2>${escapeHtml(chapterLabel(ch))}</h2>
          <p class="nr-meta">${escapeHtml(locTitle)}${novel.author ? ' · ' + escapeHtml(phrase(novel.author)) : ''}</p>
        </header>
        ${visible.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
      </article>
      ${locked ? renderLock(ch) : renderEnd(ch)}
    `;
    renderEpisodeList();
    history[options && options.push ? 'pushState' : 'replaceState']({ ep: ch.n }, '', readerHref(ch.n));
    ignoreScroll = true;
    window.scrollTo(0, 0);
    if (options && options.restore && options.ratio) {
      window.setTimeout(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, Math.max(0, max * options.ratio));
        updateProgress();
        ignoreScroll = false;
      }, 180);
    } else {
      updateProgress();
      window.requestAnimationFrame(() => {
        ignoreScroll = false;
      });
    }
    showChrome(true);
    if (shared.recordHistory) shared.recordHistory('novel', novel.id, ch.n);
  }

  function goTo(ep, push) {
    render(clampEp(ep), { push: Boolean(push) });
  }

  function initialEpisode() {
    if (params.get('ep')) return clampEp(params.get('ep'));
    const saved = loadProgress();
    if (saved.novelId === novel.id && saved.ep) return clampEp(saved.ep);
    return 1;
  }

  function bind() {
    const lang = shared.currentLang ? shared.currentLang() : 'zh';
    document.documentElement.lang = lang === 'en' ? 'en' : lang === 'pt' ? 'pt-BR' : 'zh-CN';
    const listTitle = document.getElementById('readerListTitle');
    if (listTitle) listTitle.textContent = tt('toc', '目录');
    const settingsTitle = document.getElementById('readerSettingsTitle');
    if (settingsTitle) settingsTitle.textContent = tt('readerSettings', '阅读设置');
    document.querySelectorAll('[data-font]').forEach((btn) => {
      const map = { sm: 'fontSm', md: 'fontMd', lg: 'fontLg' };
      if (map[btn.dataset.font]) btn.textContent = tt(map[btn.dataset.font], btn.textContent);
    });
    document.querySelectorAll('[data-theme]').forEach((btn) => {
      const map = { night: 'themeNight', paper: 'themePaper', day: 'themeDay' };
      if (map[btn.dataset.theme]) btn.textContent = tt(map[btn.dataset.theme], btn.textContent);
    });
    document.querySelectorAll('.reader-setting-label').forEach((label, i) => {
      label.childNodes[0].textContent = i === 0 ? tt('fontSize', '字体大小') : tt('bgTheme', '背景');
    });
    if (els.back) els.back.setAttribute('aria-label', tt('backToWork', '返回作品页'));
    const bookmarkBtn = document.getElementById('readerBookmarkBtn');
    if (bookmarkBtn) bookmarkBtn.setAttribute('aria-label', tt('bookmark', '收藏'));
    if (els.settingsBtn) els.settingsBtn.setAttribute('aria-label', tt('readerSettings', '阅读设置'));
    if (els.listBtn) {
      const nodes = [...els.listBtn.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim());
      nodes.forEach((n) => { n.textContent = tt('toc', '目录'); });
    }
    document.querySelectorAll('[data-close-sheet]').forEach((btn) => {
      btn.setAttribute('aria-label', tt('close', '关闭'));
    });
    document.querySelectorAll('.reader-seg[aria-label]').forEach((group, i) => {
      group.setAttribute('aria-label', i === 0 ? tt('fontSize', '字体大小') : tt('bgTheme', '背景'));
    });
    els.stage.addEventListener('click', (event) => {
      if (event.target.closest('a, button')) return;
      els.reader.classList.toggle('is-chrome-on');
    });

    els.prev.addEventListener('click', () => {
      if (currentEp > 1) goTo(currentEp - 1, true);
    });
    els.next.addEventListener('click', () => {
      if (currentEp < CHAPTERS.length) goTo(currentEp + 1, true);
    });

    els.listBtn.addEventListener('click', () => {
      renderEpisodeList();
      setSheet(els.listSheet, true);
    });
    els.settingsBtn.addEventListener('click', () => setSheet(els.settingsSheet, true));

    document.querySelectorAll('[data-close-sheet]').forEach((btn) => {
      btn.addEventListener('click', closeSheets);
    });

    els.list.addEventListener('click', (event) => {
      const target = event.target.closest('[data-go-ep]');
      if (!target) return;
      closeSheets();
      goTo(target.dataset.goEp, true);
    });

    els.stage.addEventListener('click', (event) => {
      const target = event.target.closest('[data-go-ep]');
      if (!target) return;
      goTo(target.dataset.goEp, true);
    });

    const settings = loadSettings();
    applySettings(settings);
    document.querySelectorAll('[data-font]').forEach((btn) => {
      btn.addEventListener('click', () => {
        settings.font = btn.dataset.font;
        saveSettings(settings);
        applySettings(settings);
      });
    });
    document.querySelectorAll('[data-theme]').forEach((btn) => {
      btn.addEventListener('click', () => {
        settings.theme = btn.dataset.theme;
        saveSettings(settings);
        applySettings(settings);
      });
    });

    window.addEventListener('scroll', () => {
      updateProgress();
      if (!ignoreScroll) els.reader.classList.remove('is-chrome-on');
    }, { passive: true });

    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (els.listSheet.classList.contains('is-open') || els.settingsSheet.classList.contains('is-open')) {
          closeSheets();
          return;
        }
        window.location.href = detailHref;
        return;
      }
      if (event.key === 'ArrowLeft' && currentEp > 1) goTo(currentEp - 1, true);
      if (event.key === 'ArrowRight' && currentEp < CHAPTERS.length) goTo(currentEp + 1, true);
    });

    window.addEventListener('popstate', (event) => {
      const ep = event.state && event.state.ep ? event.state.ep : initialEpisode();
      render(clampEp(ep));
    });
  }

  if (els.back) els.back.href = detailHref;
  if (shared.bindBookmarkButton) {
    shared.bindBookmarkButton(document.getElementById('readerBookmarkBtn'), 'novel', novel.id);
  }
  bind();
  const saved = loadProgress();
  if (!params.get('ep') && saved.novelId === novel.id && saved.ratio) {
    render(initialEpisode(), { restore: true, ratio: saved.ratio });
  } else {
    render(initialEpisode());
  }
})();
