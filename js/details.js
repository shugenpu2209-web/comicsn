(function () {
  'use strict';

  const NEWS = {
    idPrefix: 'news',
    copy: {
      zh: { title: '最新消息', doc: '最新消息 - COMICSN' },
      en: { title: 'News', doc: 'News - COMICSN' },
      pt: { title: 'Novidades', doc: 'Novidades - COMICSN' },
    },
    items: [
      {
        id: 'vip',
        date: '2026.09.08',
        tag: { zh: '活动', en: 'Event', pt: 'Evento' },
        tagType: 'event',
        title: {
          zh: '充值活动进行中：开通 VIP 即可解锁第7集起全部动画',
          en: 'VIP sale is live: unlock episode 7 and later with a membership',
          pt: 'Promoção VIP: desbloqueie o episódio 7 em diante',
        },
        body: {
          zh: '活动期间开通任意 VIP 套餐，即可观看全部动画第7集及之后内容。已开通会员的用户无需重复购买，到期前均可继续观看。',
          en: 'Subscribe to any VIP plan during the campaign to watch episode 7 and later. Current members keep access until their plan expires.',
          pt: 'Assine qualquer plano VIP durante a campanha para assistir do episódio 7 em diante. Membros atuais mantêm o acesso até o vencimento.',
        },
      },
      {
        id: 'bully',
        date: '2026.09.05',
        tag: { zh: '更新', en: 'Update', pt: 'Atualização' },
        tagType: 'update',
        title: {
          zh: '《恶霸的爱情故事》动画已更新至第12集',
          en: 'Bully’s Love Story anime is now updated to episode 12',
          pt: 'O anime Bully’s Love Story foi atualizado até o episódio 12',
        },
        body: {
          zh: '新一集现已上线。第1–6集可免费观看，第7集起为 VIP 专属。前往动画页即可继续追更。',
          en: 'The latest episode is live. Episodes 1–6 are free; episode 7 and later require VIP.',
          pt: 'O episódio mais recente já está no ar. Os episódios 1–6 são grátis; do 7 em diante é VIP.',
        },
      },
      {
        id: 'evolution',
        date: '2026.09.01',
        tag: { zh: '公告', en: 'Notice', pt: 'Aviso' },
        tagType: 'notice',
        title: {
          zh: '新作上架：《进化：通往太空怪兽之路》现已开放观看',
          en: 'New title: Evolution: Road to Space Monster is now available',
          pt: 'Novo título: Evolution: Road to Space Monster já está disponível',
        },
        body: {
          zh: '科幻动作新作已同步上线漫画与动画。可在首页、漫画或动画频道找到该作品。',
          en: 'The new sci-fi action title is available as both comic and anime on Home, Comics, and Anime.',
          pt: 'O novo título de ficção científica já está disponível em quadrinhos e anime.',
        },
      },
      {
        id: 'nsfw',
        date: '2026.08.22',
        tag: { zh: '公告', en: 'Notice', pt: 'Aviso' },
        tagType: 'notice',
        title: {
          zh: '关于 NSFW 内容展示说明',
          en: 'About NSFW content display',
          pt: 'Sobre a exibição de conteúdo NSFW',
        },
        body: {
          zh: '部分作品含成人向内容。可使用页头 NSFW 开关控制展示。关闭后相关封面与条目将按站点规则隐藏或替换。',
          en: 'Some titles include adult content. Use the header NSFW switch to control visibility.',
          pt: 'Alguns títulos incluem conteúdo adulto. Use o interruptor NSFW do cabeçalho para controlar a exibição.',
        },
      },
      {
        id: 'maintain',
        date: '2026.08.15',
        tag: { zh: '公告', en: 'Notice', pt: 'Aviso' },
        tagType: 'notice',
        title: {
          zh: '系统维护完成，阅读与播放已恢复正常',
          en: 'Maintenance finished: reading and playback are back to normal',
          pt: 'Manutenção concluída: leitura e reprodução voltaram ao normal',
        },
        body: {
          zh: '8 月 15 日进行的短时维护已经结束。如仍遇到无法翻页或播放卡顿，请刷新页面或重新登录后再试。',
          en: 'The short maintenance on Aug 15 has ended. If pages or playback still stall, refresh or sign in again.',
          pt: 'A manutenção de 15 de agosto foi concluída. Se a leitura ou o player falhar, atualize a página ou entre novamente.',
        },
      },
    ],
  };

  const FAQ = {
    idPrefix: 'faq',
    copy: {
      zh: { title: '常见问题', doc: '常见问题 - COMICSN' },
      en: { title: 'FAQ', doc: 'FAQ - COMICSN' },
      pt: { title: 'FAQ', doc: 'FAQ - COMICSN' },
    },
    items: [
      {
        id: 'vip',
        date: 'Q1',
        tag: { zh: 'VIP', en: 'VIP', pt: 'VIP' },
        tagType: 'event',
        title: {
          zh: '如何开通 VIP？开通后可以看哪些内容？',
          en: 'How do I get VIP, and what does it unlock?',
          pt: 'Como assinar o VIP e o que ele libera?',
        },
        body: {
          zh: '打开侧栏进入「VIP充值」，选择套餐完成支付即可。开通后可观看动画第7集及之后内容，并解锁需会员资格的漫画章节。到期前无需重复购买。',
          en: 'Open the menu, go to VIP, and complete a plan. VIP unlocks anime from episode 7 onward and member-only comic chapters until the plan expires.',
          pt: 'Abra o menu, entre em VIP e conclua um plano. O VIP libera o anime a partir do episódio 7 e capítulos exclusivos até o vencimento.',
        },
      },
      {
        id: 'free',
        date: 'Q2',
        tag: { zh: '观看', en: 'Watch', pt: 'Assistir' },
        tagType: 'update',
        title: {
          zh: '哪些集数可以免费观看？',
          en: 'Which episodes are free to watch?',
          pt: 'Quais episódios são grátis?',
        },
        body: {
          zh: '动画第1–6集可免费观看，第7集起为 VIP 专属。漫画同样会标注「免费」或「会员资格」。未登录也可浏览免费内容。',
          en: 'Anime episodes 1–6 are free; episode 7 and later need VIP. Comics are marked Free or Members. You can browse free titles without signing in.',
          pt: 'Os episódios 1–6 do anime são grátis; do 7 em diante é VIP. Os quadrinhos vêm marcados como Grátis ou Membros.',
        },
      },
      {
        id: 'nsfw',
        date: 'Q3',
        tag: { zh: '内容', en: 'Content', pt: 'Conteúdo' },
        tagType: 'notice',
        title: {
          zh: 'NSFW 开关是做什么的？',
          en: 'What does the NSFW switch do?',
          pt: 'Para que serve o interruptor NSFW?',
        },
        body: {
          zh: '部分作品含成人向内容。打开页头 NSFW 后显示完整封面与条目；关闭后将按站点规则隐藏或替换相关内容。',
          en: 'Some titles include adult content. Turn NSFW on in the header to show them; turn it off to hide or replace them.',
          pt: 'Alguns títulos incluem conteúdo adulto. Ative o NSFW no cabeçalho para exibi-los; desative para ocultá-los.',
        },
      },
      {
        id: 'shelf',
        date: 'Q4',
        tag: { zh: '书架', en: 'Library', pt: 'Estante' },
        tagType: 'notice',
        title: {
          zh: '如何把作品加入我的书架？',
          en: 'How do I add a title to My Library?',
          pt: 'Como adicionar um título à estante?',
        },
        body: {
          zh: '进入作品页点击「收藏」，即可在「书架」中查看。书架支持搜索、排序和批量删除。登录后收藏会保留在当前设备。',
          en: 'Open a title and tap Bookmark to save it to Library. You can search, sort, and batch-delete there. Bookmarks stay on this device after you sign in.',
          pt: 'Abra o título e toque em Favoritar. Na estante você pode buscar, ordenar e excluir em lote.',
        },
      },
      {
        id: 'account',
        date: 'Q5',
        tag: { zh: '账号', en: 'Account', pt: 'Conta' },
        tagType: 'notice',
        title: {
          zh: '忘记密码或无法登录怎么办？',
          en: 'What if I forgot my password or cannot sign in?',
          pt: 'E se eu esqueci a senha ou não consigo entrar?',
        },
        body: {
          zh: '在登录弹窗选择「忘记密码」，使用绑定手机号收取验证码后重置。若仍无法登录，请通过「联系客服」提交账号信息。',
          en: 'Use Forgot password on the sign-in window and reset with the SMS code sent to your phone. If it still fails, contact Support.',
          pt: 'Use Esqueci a senha na janela de login e redefina com o código SMS. Se persistir, fale com o suporte.',
        },
      },
    ],
  };

  const kind = (document.currentScript && document.currentScript.dataset.details)
    || (location.pathname.includes('faq') ? 'faq' : 'news');
  const pack = kind === 'faq' ? FAQ : NEWS;
  const shared = window.ComicsShared || {};
  if (shared.bindLocalizedDetails) {
    shared.bindLocalizedDetails(pack);
  }
})();
