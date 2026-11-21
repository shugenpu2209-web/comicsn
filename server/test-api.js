'use strict';

const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const { start } = require('./index');

const adminPassword = crypto.randomBytes(18).toString('base64url');
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'comicsn-'));
const databasePath = path.join(dataDir, 'comicsn.sqlite');

function assert(cond, message) {
  if (!cond) throw new Error(message || 'assertion failed');
}

async function json(url, options) {
  const res = await fetch(url, options);
  const text = await res.text();
  let body = null;
  try { body = text ? JSON.parse(text) : null; } catch (err) { body = text; }
  return { status: res.status, body, text, headers: res.headers };
}

async function main() {
  const banned = ['admin123', 'content123', 'review123', 'ops123', 'cs123', 'finance123', 'data123', 'agent123'];
  ['admin/js/store.js', 'admin/js/app.js', 'admin/index.html', 'README.md', '.env.example'].forEach((file) => {
    const text = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
    banned.forEach((secret) => {
      assert(!text.includes(secret), `${file} still contains ${secret}`);
    });
  });

  const server = await start({
    host: '127.0.0.1',
    port: 0,
    dataDir,
    databasePath,
    adminPassword,
    adminUsername: 'admin',
  });
  const base = server.url;

  try {
    const home = await fetch(base + '/');
    assert(home.status === 200, 'home status');
    const homeHtml = await home.text();
    assert(homeHtml.includes('banner-section'), 'home markup');

    const adminPage = await fetch(base + '/admin/');
    assert(adminPage.status === 200, 'admin page');
    assert((await adminPage.text()).includes('AdminStore'), 'admin script');

    const hidden = await fetch(base + '/server/index.js');
    assert(hidden.status === 404, 'server source hidden');
    const dataFile = await fetch(base + '/data/comicsn.sqlite');
    assert(dataFile.status === 404, 'database hidden');

    const denied = await json(base + '/api/admin/state');
    assert(denied.status === 401, 'admin state requires auth');

    const badLogin = await json(base + '/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: adminPassword + '-no' }),
    });
    assert(badLogin.status === 401, 'bad admin password');

    const login = await json(base + '/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: adminPassword }),
    });
    assert(login.status === 200 && login.body.ok, 'admin login');
    assert(login.body.session && login.body.session.token, 'admin token');
    assert(login.body.state && login.body.state.comics.length > 10, 'seeded comics');
    const stateText = JSON.stringify(login.body.state);
    assert(!stateText.includes('password_hash'), 'state leaks password hash');
    assert(!stateText.includes(adminPassword), 'state leaks admin password');

    const auth = { Authorization: 'Bearer ' + login.body.session.token, 'Content-Type': 'application/json' };
    const freshCatalog = await json(base + '/api/public/catalog');
    assert(freshCatalog.status === 200, 'catalog');
    const evolution = freshCatalog.body.comics.find((row) => row.id === 'evolution');
    const draft = freshCatalog.body.comics.find((row) => row.id === 'draft-new');
    assert(evolution && !evolution.hidden && !evolution.patch && !evolution.item, 'unchanged comic has no public patch');
    assert(draft && draft.hidden, 'draft stays off the public catalog');
    assert(freshCatalog.body.episodes.length > 0, 'episodes');

    const state = login.body.state;
    const work = state.comics.find((item) => item.id === 'evolution');
    work.title = '进化测试改名';
    work.vip = 'free';
    state.comics.unshift({
      id: 'server-only-comic',
      kind: 'comic',
      title: '服务器新漫画',
      titleEn: 'Server Comic',
      titlePt: 'HQ do servidor',
      authorId: '测试作者',
      categories: ['comedy'],
      tags: ['日常'],
      origin: 'korean',
      progress: 'updating',
      vip: 'partial',
      recommend: true,
      exclusive: false,
      cover: '../assets/comics/thumb-1.webp',
      thumb: '../assets/comics/thumb-1.webp',
      views: 1200,
      likes: 80,
      chapterCount: 4,
      publishStatus: 'published',
      blurb: '来自服务器的新作品。',
      createdAt: '2026-01-01 00:00:00',
      updatedAt: '2026-01-01 00:00:00',
    });
    const saved = await json(base + '/api/admin/state', { method: 'PUT', headers: auth, body: JSON.stringify(state) });
    assert(saved.status === 200 && saved.body.ok, 'save state');

    const patched = await json(base + '/api/public/catalog');
    const evolved = patched.body.comics.find((row) => row.id === 'evolution');
    const created = patched.body.comics.find((row) => row.id === 'server-only-comic');
    assert(evolved && evolved.patch && evolved.patch.title === '进化测试改名' && evolved.patch.free === true, 'public patch');
    assert(created && created.item && created.item.title === '服务器新漫画' && created.item.views === '1.2K', 'new public comic');

    const asset = await fetch(base + '/api/admin/assets', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + login.body.session.token,
        'Content-Type': 'image/jpeg',
        'X-File-Name': encodeURIComponent('cover.jpg'),
        'X-Asset-Kind': 'image',
      },
      body: Buffer.from('not-a-real-jpeg'),
    });
    const assetBody = await asset.json();
    assert(asset.status === 201 && assetBody.url, 'upload');
    const downloaded = await fetch(base + assetBody.url);
    assert(downloaded.status === 200, 'download asset');
    assert(Buffer.from(await downloaded.arrayBuffer()).toString() === 'not-a-real-jpeg', 'asset bytes');

    const username = 'reader' + crypto.randomBytes(3).toString('hex');
    const userPassword = crypto.randomBytes(9).toString('base64url');
    const registered = await json(base + '/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password: userPassword }),
    });
    assert(registered.status === 200 && registered.body.token, 'register');
    const wrong = await json(base + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password: userPassword + 'x' }),
    });
    assert(wrong.status === 401, 'user bad password');
    const userLogin = await json(base + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password: userPassword }),
    });
    assert(userLogin.status === 200 && userLogin.body.token, 'user login');

    const userAuth = { Authorization: 'Bearer ' + userLogin.body.token, 'Content-Type': 'application/json' };
    const bought = await json(base + '/api/me/vip', {
      method: 'POST',
      headers: userAuth,
      body: JSON.stringify({
        planKey: 'month',
        plan: '一月',
        amount: 1,
        validDays: 1,
        validUntil: '2026.12.31',
        payMethod: 'wechat',
        openedAt: '2026.11.21 10:00',
        orderNo: 'CS-TEST-1',
        source: '漫画',
      }),
    });
    assert(bought.status === 200 && bought.body.membership.vip, 'vip purchase');
    assert(bought.body.order.amount === 30, 'server price');
    assert(bought.body.expireStamp === '2026.12.31', 'expire stamp');

    await server.close();
    const restarted = await start({
      host: '127.0.0.1',
      port: 0,
      dataDir,
      databasePath,
      adminPassword,
      adminUsername: 'admin',
    });
    try {
      const again = await json(restarted.url + '/api/public/catalog');
      const still = again.body.comics.find((row) => row.id === 'evolution');
      assert(still && still.patch && still.patch.title === '进化测试改名', 'catalog survives restart');

      const relogin = await json(restarted.url + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: userPassword }),
      });
      assert(relogin.status === 200, 'user survives restart');
      const membership = await json(restarted.url + '/api/me/membership', {
        headers: { Authorization: 'Bearer ' + relogin.body.token },
      });
      assert(membership.body.vip && membership.body.orders.some((order) => order.orderNo === 'CS-TEST-1'), 'vip survives restart');

      const adminAgain = await json(restarted.url + '/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: adminPassword }),
      });
      assert(adminAgain.body.state.users.some((user) => user.username === username), 'admin sees public user');
      const withoutUser = JSON.parse(JSON.stringify(adminAgain.body.state));
      withoutUser.users = withoutUser.users.filter((user) => user.username !== username);
      const keep = await json(restarted.url + '/api/admin/state', {
        method: 'PUT',
        headers: {
          Authorization: 'Bearer ' + adminAgain.body.session.token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(withoutUser),
      });
      assert(keep.status === 200, 'admin save');
      const after = await json(restarted.url + '/api/admin/state', {
        headers: { Authorization: 'Bearer ' + adminAgain.body.session.token },
      });
      assert(after.body.users.some((user) => user.username === username && user.vip), 'public user not dropped by stale save');

      const removed = await json(restarted.url + '/api/me', {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + relogin.body.token },
      });
      assert(removed.status === 200, 'delete account');
      const gone = await json(restarted.url + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: userPassword }),
      });
      assert(gone.status === 401, 'deleted user cannot log in');
    } finally {
      await restarted.close();
    }
  } finally {
    try { await server.close(); } catch (err) { /* already closed */ }
    fs.rmSync(dataDir, { recursive: true, force: true });
  }
  console.log('api tests passed');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
