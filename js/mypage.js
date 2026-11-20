(function () {
  'use strict';

  const shared = window.ComicsShared || {};
  const NSFW_KEY = shared.NSFW_KEY;
  const NOTIFY_KEY = 'comicsn-notify';
  const VIP_EXPIRE_KEY = shared.VIP_EXPIRE_KEY;
  const VIP_ORDERS_KEY = 'comicsn-vip-orders';

  const VIP_TIERS = [
    { key: 'bronze', nameKey: 'tierBronze', name: '青铜', min: 8 },
    { key: 'silver', nameKey: 'tierSilver', name: '白银', min: 30 },
    { key: 'gold', nameKey: 'tierGold', name: '黄金', min: 78 },
    { key: 'platinum', nameKey: 'tierPlatinum', name: '铂金', min: 260 },
    { key: 'diamond', nameKey: 'tierDiamond', name: '钻石', min: 520 },
  ];

  function tt(key, fallback) {
    return (shared.t && shared.t(key, fallback)) || fallback;
  }

  function sumAmount(orders) {
    return orders.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }

  function getVipTier(total) {
    let current = { key: 'none', name: tt('vipNone', '未开通'), min: 0 };
    for (const tier of VIP_TIERS) {
      if (total >= tier.min) current = { ...tier, name: tt(tier.nameKey, tier.name) };
    }
    const index = VIP_TIERS.findIndex((tier) => tier.key === current.key);
    const nextTier = index === -1 ? VIP_TIERS[0] : VIP_TIERS[index + 1] || null;
    const next = nextTier ? { ...nextTier, name: tt(nextTier.nameKey, nextTier.name) } : null;
    return { current, next, total };
  }

  function vipProgressPercent(total) {
    const points = [{ min: 0, pct: 0 }].concat(
      VIP_TIERS.map((tier, index) => ({
        min: tier.min,
        pct: (index / (VIP_TIERS.length - 1)) * 100,
      }))
    );
    if (total <= 0) return 0;
    for (let i = 1; i < points.length; i += 1) {
      if (total < points[i].min) {
        const prev = points[i - 1];
        const span = points[i].min - prev.min;
        const ratio = span <= 0 ? 1 : (total - prev.min) / span;
        return Math.round((prev.pct + ratio * (points[i].pct - prev.pct)) * 10) / 10;
      }
    }
    return 100;
  }

  function updateVipLevel(orders) {
    const { current, next, total } = getVipTier(sumAmount(orders));
    const label = current.key === 'none' ? tt('vipNone', '未开通') : `VIP ${current.name}`;
    document.querySelectorAll('.js-vip-level').forEach((el) => {
      el.textContent = label;
    });

    const levelWrap = document.getElementById('mypageVipLevel');
    if (levelWrap) {
      levelWrap.className = `mypage-vip-level is-${current.key}`;
    }

    const spentEl = document.getElementById('mypageVipSpent');
    if (spentEl) spentEl.textContent = `${tt('spentPrefix', '累计充值')} ¥${total}`;

    const progressEl = document.getElementById('mypageVipProgress');
    if (progressEl) {
      if (!next) {
        progressEl.textContent = tt('progressMax', '已达最高等级');
      } else {
        progressEl.textContent = tt('progressNext', '再充 ¥{n} 升至 {name}')
          .replace('{n}', String(Math.max(next.min - total, 0)))
          .replace('{name}', next.name);
      }
    }

    const barEl = document.getElementById('mypageVipBar');
    if (barEl) barEl.style.width = vipProgressPercent(total) + '%';

    document.querySelectorAll('.mypage-vip-track li').forEach((item) => {
      item.classList.toggle('is-current', item.dataset.tier === current.key);
      const tier = VIP_TIERS.find((entry) => entry.key === item.dataset.tier);
      item.classList.toggle('is-reached', Boolean(tier && total >= tier.min));
    });

    return current;
  }
  const VIP_DAYS = { week: 7, month: 30, quarter: 90, year: 365 };
  const VIP_LABELS = {
    week: () => tt('packWeek', '一周'),
    month: () => tt('packMonth', '一月'),
    quarter: () => tt('packQuarter', '3月'),
    year: () => tt('packYear', '一年'),
  };
  const VIP_PRICES = { week: 8, month: 30, quarter: 78, year: 260 };
  const VIP_DATA_VERSION = '2';
  const VIP_DATA_VERSION_KEY = 'comicsn-vip-data-ver';

  function planKeyOf(item) {
    if (item && VIP_LABELS[item.planKey]) return item.planKey;
    const raw = String((item && item.plan) || '');
    if (VIP_LABELS[raw]) return raw;
    const byDays = Object.entries(VIP_DAYS).find(([, days]) => days === Number(item && (item.validDays || item.days)));
    if (byDays) return byDays[0];
    const aliases = {
      一周: 'week', '1 week': 'week', '1 semana': 'week',
      一月: 'month', '1 month': 'month', '1 mês': 'month',
      '3月': 'quarter', '3 months': 'quarter', '3 meses': 'quarter',
      一年: 'year', '1 year': 'year', '1 ano': 'year',
    };
    return aliases[raw] || '';
  }

  function localizedPlanLabel(item) {
    const key = planKeyOf(item);
    if (key && VIP_LABELS[key]) return VIP_LABELS[key]();
    return (item && item.plan) || '';
  }

  function showToast(message) {
    const toast = document.getElementById('mypageToast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-on');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('is-on'), 1800);
  }

  function pad(num, size) {
    return String(num).padStart(size, '0');
  }

  function formatStamp(date) {
    return `${date.getFullYear()}.${pad(date.getMonth() + 1, 2)}.${pad(date.getDate(), 2)}`;
  }

  function formatDateTime(date) {
    return `${formatStamp(date)} ${pad(date.getHours(), 2)}:${pad(date.getMinutes(), 2)}`;
  }

  function makeOrderNo(date) {
    return `CS${date.getFullYear()}${pad(date.getMonth() + 1, 2)}${pad(date.getDate(), 2)}${pad(date.getHours(), 2)}${pad(date.getMinutes(), 2)}${pad(date.getSeconds(), 2)}`;
  }

  function resetVipRecords() {
    if (localStorage.getItem(VIP_DATA_VERSION_KEY) === VIP_DATA_VERSION) return;
    localStorage.removeItem(VIP_ORDERS_KEY);
    localStorage.removeItem(VIP_EXPIRE_KEY);
    localStorage.setItem(VIP_DATA_VERSION_KEY, VIP_DATA_VERSION);
  }

  function loadOrders() {
    resetVipRecords();
    try {
      const raw = localStorage.getItem(VIP_ORDERS_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed)) return parsed;
    } catch (err) {
      /* ignore broken cache */
    }
    return [];
  }

  function saveOrders(orders) {
    localStorage.setItem(VIP_ORDERS_KEY, JSON.stringify(orders));
  }

  function renderOrders(orders) {
    const list = document.getElementById('mypageHistoryList');
    if (!list) return;
    if (!orders.length) {
      list.innerHTML = `<p class="mypage-history-empty">${tt('emptyHistory', '暂无会员开通记录')}</p>`;
      return;
    }
    const payLabel = (method) => {
      if (method === 'wechat' || method === '微信支付') return tt('wechatPay', '微信支付');
      if (method === 'alipay' || method === '支付宝') return tt('alipay', '支付宝');
      return method;
    };
    list.innerHTML = orders.map((item) => `
      <article class="mypage-order">
        <div class="mypage-order-head">
          <h3 class="mypage-order-plan">VIP ${localizedPlanLabel(item)}</h3>
          <strong class="mypage-order-amount">¥${item.amount}</strong>
        </div>
        <dl class="mypage-order-meta">
          <div><dt>${tt('orderNo', '订单号')}</dt><dd>${item.orderNo}</dd></div>
          <div><dt>${tt('validPeriod', '有效期')}</dt><dd>${tt('validDaysTo', '{n}天（至 {date}）').replace('{n}', item.validDays).replace('{date}', item.validUntil)}</dd></div>
          <div><dt>${tt('payMethod', '充值方式')}</dt><dd>${payLabel(item.payMethod)}</dd></div>
          <div><dt>${tt('openedAt', '开通时间')}</dt><dd>${item.openedAt}</dd></div>
          <div><dt>${tt('source', '开通来源')}</dt><dd>${item.source === '漫画' ? tt('navManga', '漫画') : item.source}</dd></div>
        </dl>
      </article>
    `).join('');
  }

  function setModalOpen(modal, open) {
    if (!modal) return;
    modal.classList.toggle('is-open', open);
    modal.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function initPayDialog(onConfirmPay) {
    const modal = document.getElementById('mypagePayModal');
    const planEl = document.getElementById('mypagePayPlan');
    const amountEl = document.getElementById('mypagePayAmount');
    const methods = [...(modal?.querySelectorAll('.mypage-pay-method') || [])];
    let pending = null;

    function selectedPayMethod() {
      return methods.find((item) => item.classList.contains('is-active'))?.dataset.pay || 'wechat';
    }

    function openPay(plan) {
      pending = plan;
      if (planEl) planEl.textContent = tt('payPlanLine', 'VIP {label} · {days} 天')
        .replace('{label}', plan.label)
        .replace('{days}', String(plan.days));
      if (amountEl) amountEl.textContent = `¥${plan.amount}`;
      methods.forEach((item, index) => {
        const active = index === 0;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-checked', String(active));
      });
      setModalOpen(modal, true);
    }

    function closePay() {
      setModalOpen(modal, false);
      pending = null;
    }

    methods.forEach((item) => {
      item.addEventListener('click', () => {
        methods.forEach((method) => {
          const active = method === item;
          method.classList.toggle('is-active', active);
          method.setAttribute('aria-checked', String(active));
        });
      });
    });

    document.getElementById('mypagePayCancel')?.addEventListener('click', closePay);
    document.getElementById('mypagePayConfirm')?.addEventListener('click', () => {
      if (!pending) return;
      const payMethod = selectedPayMethod();
      const plan = pending;
      closePay();
      onConfirmPay(plan, payMethod);
    });
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closePay();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.classList.contains('is-open')) closePay();
    });

    return { openPay };
  }

  function renderExpire(stamp) {
    const expireEl = document.querySelector('.mypage-vip-expire');
    if (!expireEl) return;
    expireEl.innerHTML = stamp
      ? `${tt('validUntilPrefix', '有效期至')} <strong>${stamp}</strong>`
      : tt('vipExpireNone', '暂未开通');
  }

  function initVip() {
    const vipPack = document.getElementById('mypageVipPack');
    let orders = loadOrders();
    renderExpire(orders.length ? localStorage.getItem(VIP_EXPIRE_KEY) : '');
    renderOrders(orders);
    updateVipLevel(orders);

    function completePay(plan, payMethod) {
      const now = new Date();
      const next = new Date(now);
      next.setDate(next.getDate() + plan.days);
      const stamp = formatStamp(next);
      renderExpire(stamp);
      localStorage.setItem(VIP_EXPIRE_KEY, stamp);
      vipPack?.querySelectorAll('[data-vip]').forEach((item) => {
        item.classList.toggle('is-hot', item.dataset.vip === plan.key);
      });
      orders = [{
        planKey: plan.key,
        plan: plan.label,
        amount: plan.amount,
        orderNo: makeOrderNo(now),
        validDays: plan.days,
        validUntil: stamp,
        payMethod,
        openedAt: formatDateTime(now),
        source: '漫画',
      }, ...orders];
      saveOrders(orders);
      renderOrders(orders);
      const tier = updateVipLevel(orders);
      const payName = payMethod === 'alipay' || payMethod === '支付宝' ? tt('alipay', '支付宝') : tt('wechatPay', '微信支付');
      const tierText = tier.key === 'none' ? '' : tt('currentTier', '，当前 {name}').replace('{name}', tier.name);
      showToast(tt('paidVia', '已通过{pay}开通 VIP {plan}{tier}')
        .replace('{pay}', payName)
        .replace('{plan}', plan.label)
        .replace('{tier}', tierText));
    }

    const payDialog = initPayDialog(completePay);

    vipPack?.querySelectorAll('[data-vip]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.vip;
        payDialog.openPay({
          key,
          label: (VIP_LABELS[key] && VIP_LABELS[key]()) || tt('packMonth', '一月'),
          days: VIP_DAYS[key] || 30,
          amount: Number(btn.dataset.price) || VIP_PRICES[key] || 0,
        });
      });
    });
  }

  function initPanels() {
    const tabs = [...document.querySelectorAll('.mypage-tab')];
    const panels = {
      orders: document.getElementById('mypagePanelOrders'),
      settings: document.getElementById('mypagePanelSettings'),
    };

    function showPanel(name) {
      const target = name === 'settings' ? 'settings' : 'orders';
      tabs.forEach((tab) => {
        const active = tab.dataset.panel === target;
        tab.classList.toggle('is-active', active);
        tab.setAttribute('aria-selected', String(active));
      });
      Object.entries(panels).forEach(([key, panel]) => {
        if (!panel) return;
        panel.hidden = key !== target;
      });
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => showPanel(tab.dataset.panel));
    });

    showPanel('orders');
    return { showPanel };
  }

  function initSettings() {
    const nsfwSetting = document.getElementById('mypageNsfwSetting');
    const notifySetting = document.getElementById('mypageNotifySetting');
    const headerToggle = document.getElementById('nsfwToggle');

    if (nsfwSetting) {
      nsfwSetting.checked = localStorage.getItem(NSFW_KEY) === '1';
      nsfwSetting.addEventListener('change', () => {
        const pressed = headerToggle?.getAttribute('aria-pressed') === 'true';
        if (headerToggle && pressed !== nsfwSetting.checked) {
          headerToggle.click();
        } else {
          localStorage.setItem(NSFW_KEY, nsfwSetting.checked ? '1' : '0');
        }
      });
      headerToggle?.addEventListener('click', () => {
        nsfwSetting.checked = headerToggle.getAttribute('aria-pressed') === 'true';
      });
      document.getElementById('floatingNsfw')?.addEventListener('click', () => {
        nsfwSetting.checked = headerToggle?.getAttribute('aria-pressed') === 'true';
      });
    }

    if (notifySetting) {
      const saved = localStorage.getItem(NOTIFY_KEY);
      if (saved !== null) notifySetting.checked = saved === '1';
      notifySetting.addEventListener('change', () => {
        localStorage.setItem(NOTIFY_KEY, notifySetting.checked ? '1' : '0');
        showToast(notifySetting.checked ? tt('notifyOn', '已开启更新通知') : tt('notifyOff', '已关闭更新通知'));
      });
    }
  }

  function initDialogs() {
    const modal = document.getElementById('mypageModal');
    const title = document.getElementById('mypageModalTitle');
    const cancelBtn = document.getElementById('mypageModalCancel');
    const confirmBtn = document.getElementById('mypageModalConfirm');
    let onConfirm = null;

    function openModal(message, confirmText, handler) {
      if (!modal || !title) return;
      title.textContent = message;
      confirmBtn.textContent = confirmText || tt('confirm', '确认');
      onConfirm = handler;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal?.classList.remove('is-open');
      modal?.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      onConfirm = null;
    }

    document.getElementById('mypageLogoutBtn')?.addEventListener('click', () => {
      openModal(tt('logoutConfirm', '确定退出当前账号？'), tt('logoutAction', '退出'), () => {
        window.ComicsAuth?.setLoggedIn(false);
      });
    });

    document.getElementById('mypageDeleteBtn')?.addEventListener('click', () => {
      openModal(tt('deleteConfirm', '注销后书架、VIP 与会员开通记录将无法恢复。确定注销？'), tt('deleteAction', '注销'), () => {
        localStorage.removeItem(VIP_EXPIRE_KEY);
        localStorage.removeItem(VIP_ORDERS_KEY);
        window.location.href = './';
      });
    });

    cancelBtn?.addEventListener('click', closeModal);
    confirmBtn?.addEventListener('click', () => {
      const handler = onConfirm;
      closeModal();
      handler?.();
    });
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.classList.contains('is-open')) closeModal();
    });
  }

  function applyHash(showPanel) {
    const hash = (window.location.hash || '').replace('#', '');
    if (hash === 'settings') {
      showPanel?.('settings');
      document.getElementById('mypagePanelSettings')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    if (hash === 'vip') {
      showPanel?.('orders');
      document.getElementById('mypageVipCard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  const panels = initPanels();
  initVip();
  initSettings();
  initDialogs();
  applyHash(panels.showPanel);
  window.addEventListener('hashchange', () => applyHash(panels.showPanel));
  window.addEventListener('comicsn:langchange', () => {
    const orders = JSON.parse(localStorage.getItem(VIP_ORDERS_KEY) || '[]');
    if (Array.isArray(orders)) {
      updateVipLevel(orders);
      renderOrders(orders);
      renderExpire(orders.length ? localStorage.getItem(VIP_EXPIRE_KEY) : '');
    }
  });
})();
