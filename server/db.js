'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

if (!global.__comicsnSqliteWarningHook) {
  global.__comicsnSqliteWarningHook = true;
  const emit = process.emit;
  process.emit = function (event, warning) {
    if (event === 'warning' && warning && warning.name === 'ExperimentalWarning' && /sqlite/i.test(String(warning.message || ''))) {
      return false;
    }
    return emit.apply(process, arguments);
  };
}

const { DatabaseSync } = require('node:sqlite');

const ROOT = path.resolve(__dirname, '..');
const SKIP_KEYS = new Set([
  'comics', 'novels', 'anime', 'chapters', 'novelChapters', 'episodes',
  'users', 'orders', 'plans', 'products', 'version',
]);

const PUBLIC_PLANS = {
  week: { amount: 8, days: 7, label: '一周' },
  month: { amount: 30, days: 30, label: '一月' },
  quarter: { amount: 78, days: 90, label: '3月' },
  year: { amount: 260, days: 365, label: '一年' },
};

function dataDir() {
  return path.resolve(ROOT, process.env.DATA_DIR || 'data');
}

function dbFile() {
  return process.env.DATABASE_PATH
    ? path.resolve(process.env.DATABASE_PATH)
    : path.join(dataDir(), 'comicsn.sqlite');
}

function assetDir() {
  return path.join(dataDir(), 'assets');
}

function nowStamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), salt, 32).toString('hex');
  return `scrypt:${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored || !String(stored).startsWith('scrypt:')) return false;
  const parts = String(stored).split(':');
  if (parts.length !== 3) return false;
  const salt = parts[1];
  const hash = parts[2];
  const next = crypto.scryptSync(String(password), salt, 32);
  const prev = Buffer.from(hash, 'hex');
  if (prev.length !== next.length) return false;
  return crypto.timingSafeEqual(prev, next);
}

function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function randomId(prefix) {
  return `${prefix}_${crypto.randomBytes(8).toString('hex')}`;
}

function parseJson(text, fallback) {
  try {
    return JSON.parse(text);
  } catch (err) {
    return fallback;
  }
}

function loadClientSeed() {
  const code = fs.readFileSync(path.join(ROOT, 'admin', 'js', 'store.js'), 'utf8');
  const sandbox = { console, URL, setTimeout, clearTimeout };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: 'admin/js/store.js' });
  if (!sandbox.AdminStore || typeof sandbox.AdminStore.createSeed !== 'function') {
    throw new Error('后台种子数据不可用');
  }
  const data = sandbox.AdminStore.createSeed();
  if (Array.isArray(data.admins)) {
    data.admins = data.admins.map((row) => {
      const copy = Object.assign({}, row);
      delete copy.password;
      delete copy.password_hash;
      return copy;
    });
  }
  return data;
}

function openDatabase() {
  fs.mkdirSync(dataDir(), { recursive: true });
  fs.mkdirSync(assetDir(), { recursive: true });
  const db = new DatabaseSync(dbFile());
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    PRAGMA busy_timeout = 5000;

    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_accounts (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      status TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      token_hash TEXT PRIMARY KEY,
      admin_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user_sessions (
      token_hash TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS works (
      kind TEXT NOT NULL,
      id TEXT NOT NULL,
      publish_status TEXT,
      data TEXT NOT NULL,
      PRIMARY KEY (kind, id)
    );

    CREATE TABLE IF NOT EXISTS work_seeds (
      kind TEXT NOT NULL,
      id TEXT NOT NULL,
      data TEXT NOT NULL,
      PRIMARY KEY (kind, id)
    );

    CREATE TABLE IF NOT EXISTS units (
      kind TEXT NOT NULL,
      id TEXT NOT NULL,
      work_id TEXT,
      no INTEGER,
      data TEXT NOT NULL,
      PRIMARY KEY (kind, id)
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE,
      phone TEXT UNIQUE,
      email TEXT,
      password_hash TEXT,
      vip INTEGER NOT NULL DEFAULT 0,
      vip_until TEXT,
      status TEXT,
      origin TEXT,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      status TEXT,
      amount REAL,
      origin TEXT,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS plans (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS documents (
      name TEXT PRIMARY KEY,
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS assets (
      key TEXT PRIMARY KEY,
      mime TEXT,
      name TEXT,
      bytes INTEGER,
      created_at TEXT
    );
  `);
  return db;
}

let db;

function database() {
  if (!db) db = openDatabase();
  return db;
}

function transaction(fn) {
  const handle = database();
  handle.exec('BEGIN IMMEDIATE');
  try {
    const result = fn();
    handle.exec('COMMIT');
    return result;
  } catch (err) {
    try { handle.exec('ROLLBACK'); } catch (rollbackErr) { /* already closed */ }
    throw err;
  }
}

function getMeta(key) {
  const row = database().prepare('SELECT value FROM meta WHERE key = ?').get(key);
  return row ? row.value : '';
}

function setMeta(key, value) {
  database().prepare(`
    INSERT INTO meta (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value
  `).run(key, String(value));
}

function saveDocument(name, value) {
  database().prepare(`
    INSERT INTO documents (name, data) VALUES (?, ?)
    ON CONFLICT(name) DO UPDATE SET data = excluded.data
  `).run(name, JSON.stringify(value));
}

function loadDocument(name) {
  const row = database().prepare('SELECT data FROM documents WHERE name = ?').get(name);
  return row ? parseJson(row.data, null) : null;
}

function replaceWorks(kind, list, seeding) {
  const handle = database();
  handle.prepare('DELETE FROM works WHERE kind = ?').run(kind);
  const insert = handle.prepare('INSERT INTO works (kind, id, publish_status, data) VALUES (?, ?, ?, ?)');
  const seedInsert = handle.prepare(`
    INSERT INTO work_seeds (kind, id, data) VALUES (?, ?, ?)
    ON CONFLICT(kind, id) DO UPDATE SET data = excluded.data
  `);
  (list || []).forEach((item) => {
    const copy = Object.assign({}, item);
    delete copy.password;
    delete copy.password_hash;
    insert.run(kind, copy.id, copy.publishStatus || 'published', JSON.stringify(copy));
    if (seeding) seedInsert.run(kind, copy.id, JSON.stringify(copy));
  });
}

function replaceUnits(kind, list) {
  const handle = database();
  handle.prepare('DELETE FROM units WHERE kind = ?').run(kind);
  const insert = handle.prepare('INSERT INTO units (kind, id, work_id, no, data) VALUES (?, ?, ?, ?, ?)');
  (list || []).forEach((item) => {
    insert.run(kind, item.id, item.comicId || '', Number(item.no) || 0, JSON.stringify(item));
  });
}

function replaceSimple(table, list) {
  const handle = database();
  handle.prepare(`DELETE FROM ${table}`).run();
  const insert = handle.prepare(`INSERT INTO ${table} (id, data) VALUES (?, ?)`);
  (list || []).forEach((item) => {
    if (!item || !item.id) return;
    insert.run(item.id, JSON.stringify(item));
  });
}

function nullable(value) {
  const text = String(value || '').trim();
  return text || null;
}

function upsertUsers(list, replaceAll) {
  const handle = database();
  if (replaceAll) handle.prepare('DELETE FROM users').run();
  const read = handle.prepare('SELECT password_hash, origin FROM users WHERE id = ?');
  const write = handle.prepare(`
    INSERT INTO users (id, username, phone, email, password_hash, vip, vip_until, status, origin, data)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      username = excluded.username,
      phone = excluded.phone,
      email = excluded.email,
      password_hash = excluded.password_hash,
      vip = excluded.vip,
      vip_until = excluded.vip_until,
      status = excluded.status,
      origin = excluded.origin,
      data = excluded.data
  `);
  (list || []).forEach((user) => {
    if (!user || !user.id) return;
    const prev = read.get(user.id);
    const data = Object.assign({}, user);
    delete data.password;
    delete data.password_hash;
    const origin = prev && prev.origin === 'public' ? 'public' : (replaceAll ? 'seed' : (prev && prev.origin) || 'seed');
    write.run(
      user.id,
      nullable(user.username),
      nullable(user.phone),
      user.email || '',
      prev ? prev.password_hash : null,
      user.vip ? 1 : 0,
      user.vipUntil || '',
      user.status || 'active',
      origin,
      JSON.stringify(data)
    );
  });
}

function upsertOrders(list, replaceAll) {
  const handle = database();
  if (replaceAll) handle.prepare('DELETE FROM orders').run();
  const read = handle.prepare('SELECT origin FROM orders WHERE id = ?');
  const write = handle.prepare(`
    INSERT INTO orders (id, user_id, status, amount, origin, data)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      user_id = excluded.user_id,
      status = excluded.status,
      amount = excluded.amount,
      origin = excluded.origin,
      data = excluded.data
  `);
  (list || []).forEach((order) => {
    if (!order || !order.id) return;
    const prev = read.get(order.id);
    const origin = prev && prev.origin === 'public' ? 'public' : (replaceAll ? 'seed' : (prev && prev.origin) || 'seed');
    write.run(order.id, order.userId || '', order.status || '', Number(order.amount) || 0, origin, JSON.stringify(order));
  });
}

function writeDocuments(doc) {
  Object.keys(doc || {}).forEach((key) => {
    if (SKIP_KEYS.has(key)) return;
    saveDocument(key, doc[key]);
  });
}

function writeState(doc, options) {
  const seeding = !!(options && options.seeding);
  replaceWorks('comic', doc.comics || [], seeding);
  replaceWorks('novel', doc.novels || [], seeding);
  replaceWorks('anime', doc.anime || [], seeding);
  replaceUnits('chapter', doc.chapters || []);
  replaceUnits('novelChapter', doc.novelChapters || []);
  replaceUnits('episode', doc.episodes || []);
  upsertUsers(doc.users || [], seeding);
  upsertOrders(doc.orders || [], seeding);
  replaceSimple('plans', doc.plans || []);
  replaceSimple('products', doc.products || []);
  writeDocuments(doc);
  setMeta('version', doc.version || 4);
}

function loadWorks(kind) {
  return database().prepare('SELECT data FROM works WHERE kind = ? ORDER BY rowid').all(kind)
    .map((row) => parseJson(row.data, null))
    .filter(Boolean);
}

function loadUnits(kind) {
  return database().prepare('SELECT data FROM units WHERE kind = ? ORDER BY work_id, no, rowid').all(kind)
    .map((row) => parseJson(row.data, null))
    .filter(Boolean);
}

function loadSimple(table) {
  return database().prepare(`SELECT data FROM ${table} ORDER BY rowid`).all()
    .map((row) => parseJson(row.data, null))
    .filter(Boolean);
}

function userFromRow(row) {
  const data = parseJson(row.data, {});
  data.vip = !!row.vip;
  data.vipUntil = row.vip_until || '';
  data.status = row.status || data.status || 'active';
  delete data.password;
  delete data.password_hash;
  return data;
}

function loadUsers() {
  return database().prepare('SELECT * FROM users ORDER BY rowid').all().map(userFromRow);
}

function loadOrders() {
  return database().prepare('SELECT data FROM orders ORDER BY rowid').all()
    .map((row) => parseJson(row.data, null))
    .filter(Boolean);
}

function loadSeedMap(kind) {
  const map = new Map();
  database().prepare('SELECT id, data FROM work_seeds WHERE kind = ?').all(kind).forEach((row) => {
    map.set(row.id, parseJson(row.data, null));
  });
  return map;
}

function loadState() {
  const doc = { version: Number(getMeta('version') || 4) };
  database().prepare('SELECT name, data FROM documents').all().forEach((row) => {
    doc[row.name] = parseJson(row.data, null);
  });
  doc.comics = loadWorks('comic');
  doc.novels = loadWorks('novel');
  doc.anime = loadWorks('anime');
  doc.chapters = loadUnits('chapter');
  doc.novelChapters = loadUnits('novelChapter');
  doc.episodes = loadUnits('episode');
  doc.users = loadUsers();
  doc.orders = loadOrders();
  doc.plans = loadSimple('plans');
  doc.products = loadSimple('products');
  if (!doc.settings || typeof doc.settings !== 'object') doc.settings = {};
  ['logs', 'loginLogs', 'alerts', 'admins'].forEach((key) => {
    if (!Array.isArray(doc[key])) doc[key] = [];
  });
  return doc;
}

function ensureAdminAccount() {
  const username = String(process.env.ADMIN_USERNAME || 'admin').trim() || 'admin';
  const existing = database().prepare('SELECT id FROM admin_accounts WHERE username = ?').get(username);
  if (existing) return;
  let password = process.env.ADMIN_PASSWORD;
  let generated = false;
  if (!password) {
    password = crypto.randomBytes(18).toString('base64url');
    generated = true;
  }
  const staff = loadState().admins || [];
  const match = staff.find((row) => row.username === username) || {
    id: 'au_admin',
    username,
    name: '总部超管',
    role: 'super',
    status: 'active',
  };
  database().prepare(`
    INSERT INTO admin_accounts (id, username, password_hash, name, role, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(match.id || 'au_admin', username, hashPassword(password), match.name || '总部超管', match.role || 'super', match.status || 'active');
  if (generated) {
    const file = path.join(dataDir(), 'initial-admin-password.txt');
    fs.writeFileSync(file, `${password}\n`, { mode: 0o600 });
    console.log(`Created admin user "${username}". Password written to ${file}`);
  } else {
    console.log(`Created admin user "${username}" from ADMIN_PASSWORD.`);
  }
}

function seedIfEmpty() {
  const row = database().prepare('SELECT COUNT(*) AS n FROM works').get();
  if (row && row.n > 0) return;
  const seed = loadClientSeed();
  transaction(() => {
    writeState(seed, { seeding: true });
  });
}

function init() {
  database();
  seedIfEmpty();
  ensureAdminAccount();
}

function saveAdminState(doc) {
  if (!doc || typeof doc !== 'object') {
    const error = new Error('数据格式不正确');
    error.status = 400;
    throw error;
  }
  transaction(() => {
    writeState(doc, { seeding: false });
  });
  return loadState();
}

function resetContent() {
  const seed = loadClientSeed();
  transaction(() => {
    const handle = database();
    handle.exec(`
      DELETE FROM works;
      DELETE FROM work_seeds;
      DELETE FROM units;
      DELETE FROM users;
      DELETE FROM orders;
      DELETE FROM plans;
      DELETE FROM products;
      DELETE FROM documents;
      DELETE FROM user_sessions;
    `);
    writeState(seed, { seeding: true });
  });
  clearAssets();
  return loadState();
}

function appendLog(listName, entry) {
  const list = loadDocument(listName);
  const next = Array.isArray(list) ? list.slice() : [];
  next.unshift(entry);
  saveDocument(listName, next.slice(0, 500));
}

function createAdminSession(account) {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
  database().prepare('INSERT INTO admin_sessions (token_hash, admin_id, expires_at) VALUES (?, ?, ?)')
    .run(sha256(token), account.id, expires);
  return {
    token,
    userId: account.id,
    username: account.username,
    name: account.name,
    role: account.role,
  };
}

function adminFromToken(token) {
  if (!token) return null;
  const row = database().prepare(`
    SELECT a.id, a.username, a.name, a.role, a.status
    FROM admin_sessions s
    JOIN admin_accounts a ON a.id = s.admin_id
    WHERE s.token_hash = ? AND s.expires_at > ? AND a.status = 'active'
  `).get(sha256(token), Date.now());
  return row || null;
}

function destroyAdminToken(token) {
  if (!token) return;
  database().prepare('DELETE FROM admin_sessions WHERE token_hash = ?').run(sha256(token));
}

function loginAdmin(username, password, ip) {
  const name = String(username || '').trim();
  const account = name
    ? database().prepare('SELECT * FROM admin_accounts WHERE username = ?').get(name)
    : null;
  if (!account || account.status !== 'active' || !verifyPassword(password, account.password_hash)) {
    appendLog('loginLogs', {
      id: randomId('ll'),
      username: name || '',
      ip: ip || '',
      result: '失败',
      createdAt: nowStamp(),
    });
    return null;
  }
  const session = createAdminSession(account);
  appendLog('loginLogs', {
    id: randomId('ll'),
    username: account.username,
    ip: ip || '',
    result: '成功',
    createdAt: nowStamp(),
  });
  appendLog('logs', {
    id: randomId('lg'),
    actor: account.name,
    role: account.role,
    module: '认证',
    action: '登录',
    detail: account.username,
    createdAt: nowStamp(),
  });
  return session;
}

function findUserByUsername(username) {
  const name = nullable(username);
  if (!name) return null;
  return database().prepare('SELECT * FROM users WHERE username = ?').get(name) || null;
}

function findUserByPhone(phone) {
  const value = nullable(phone);
  if (!value) return null;
  return database().prepare('SELECT * FROM users WHERE phone = ?').get(value) || null;
}

function insertPublicUser({ username, phone, password, nickname }) {
  const id = randomId('u');
  const stamp = nowStamp();
  const data = {
    id,
    nickname: nickname || username || phone || '用户',
    email: '',
    phone: phone || '',
    username: username || '',
    channel: phone ? 'phone' : 'account',
    vip: false,
    vipUntil: '',
    recharge: 0,
    status: 'active',
    registeredAt: stamp,
    lastLogin: stamp,
    country: '',
    device: '',
  };
  database().prepare(`
    INSERT INTO users (id, username, phone, email, password_hash, vip, vip_until, status, origin, data)
    VALUES (?, ?, ?, ?, ?, 0, '', 'active', 'public', ?)
  `).run(id, nullable(username), nullable(phone), '', password ? hashPassword(password) : null, JSON.stringify(data));
  return database().prepare('SELECT * FROM users WHERE id = ?').get(id);
}

function setUserPassword(id, password) {
  database().prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(password), id);
}

function touchUserLogin(id) {
  const row = database().prepare('SELECT data FROM users WHERE id = ?').get(id);
  if (!row) return;
  const data = parseJson(row.data, {});
  data.lastLogin = nowStamp();
  database().prepare('UPDATE users SET data = ? WHERE id = ?').run(JSON.stringify(data), id);
}

function createUserSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + 30 * 24 * 60 * 60 * 1000;
  database().prepare('INSERT INTO user_sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)')
    .run(sha256(token), userId, expires);
  return token;
}

function userFromToken(token) {
  if (!token) return null;
  const row = database().prepare(`
    SELECT u.*
    FROM user_sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token_hash = ? AND s.expires_at > ? AND u.status = 'active'
  `).get(sha256(token), Date.now());
  return row || null;
}

function destroyUserToken(token) {
  if (!token) return;
  database().prepare('DELETE FROM user_sessions WHERE token_hash = ?').run(sha256(token));
}

function publicUserView(row) {
  const data = userFromRow(row);
  return {
    id: data.id,
    nickname: data.nickname || '',
    username: data.username || '',
    phone: data.phone || '',
  };
}

function isoToStamp(value) {
  const match = String(value || '').match(/^(\d{4})[-.](\d{2})[-.](\d{2})/);
  if (!match) return '';
  return `${match[1]}.${match[2]}.${match[3]}`;
}

function stampToIso(value) {
  const match = String(value || '').match(/^(\d{4})[.-](\d{2})[.-](\d{2})/);
  if (!match) return '';
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function membershipFor(row) {
  const data = userFromRow(row);
  const orders = database().prepare('SELECT data FROM orders WHERE user_id = ? ORDER BY rowid DESC').all(row.id)
    .map((item) => parseJson(item.data, null))
    .filter(Boolean)
    .map((order) => ({
      planKey: order.planKey || '',
      plan: order.plan || order.planId || '',
      amount: Number(order.amount) || 0,
      orderNo: order.orderNo || order.id,
      validDays: order.validDays || '',
      validUntil: order.validUntil || isoToStamp(order.vipUntil || ''),
      payMethod: order.payMethod || order.channel || '',
      openedAt: order.openedAt || order.createdAt || '',
      source: order.source || '漫画',
    }));
  const expireStamp = data.vip ? (isoToStamp(data.vipUntil) || (orders[0] && orders[0].validUntil) || '') : '';
  return {
    vip: !!data.vip && !!expireStamp,
    vipUntil: data.vipUntil || '',
    expireStamp: data.vip ? expireStamp : '',
    orders,
  };
}

function addVipOrder(row, input) {
  const plan = PUBLIC_PLANS[input.planKey];
  if (!plan) {
    const error = new Error('套餐无效');
    error.status = 400;
    throw error;
  }
  const orderNo = String(input.orderNo || '').trim() || randomId('CS');
  const validUntil = String(input.validUntil || '').trim();
  const openedAt = String(input.openedAt || '').trim() || nowStamp();
  const payMethod = String(input.payMethod || '').trim() || 'wechat';
  const source = String(input.source || '漫画').trim() || '漫画';
  const order = {
    id: orderNo,
    orderNo,
    userId: row.id,
    planKey: input.planKey,
    plan: input.plan || plan.label,
    planId: input.planKey,
    productId: `public:${input.planKey}`,
    amount: plan.amount,
    validDays: plan.days,
    validUntil,
    payMethod,
    channel: payMethod,
    channelNo: '',
    status: 'success',
    openedAt,
    createdAt: openedAt,
    paidAt: openedAt,
    source,
    agentId: '',
  };
  const user = userFromRow(row);
  const until = stampToIso(validUntil);
  user.vip = true;
  user.vipUntil = until;
  user.recharge = (Number(user.recharge) || 0) + plan.amount;
  transaction(() => {
    database().prepare(`
      INSERT INTO orders (id, user_id, status, amount, origin, data)
      VALUES (?, ?, 'success', ?, 'public', ?)
      ON CONFLICT(id) DO UPDATE SET
        user_id = excluded.user_id,
        status = excluded.status,
        amount = excluded.amount,
        origin = 'public',
        data = excluded.data
    `).run(orderNo, row.id, plan.amount, JSON.stringify(order));
    database().prepare(`
      UPDATE users SET vip = 1, vip_until = ?, data = ? WHERE id = ?
    `).run(until, JSON.stringify(user), row.id);
  });
  const fresh = database().prepare('SELECT * FROM users WHERE id = ?').get(row.id);
  return { order: membershipFor(fresh).orders.find((item) => item.orderNo === orderNo) || order, membership: membershipFor(fresh) };
}

function deleteUser(row) {
  transaction(() => {
    database().prepare('DELETE FROM orders WHERE user_id = ?').run(row.id);
    database().prepare('DELETE FROM user_sessions WHERE user_id = ?').run(row.id);
    database().prepare('DELETE FROM users WHERE id = ?').run(row.id);
  });
}

function settingsOf() {
  const settings = loadDocument('settings') || {};
  return {
    fileMaxMb: Number(settings.fileMaxMb) || 20,
    videoMaxMb: Number(settings.videoMaxMb) || 300,
  };
}

function saveAsset(key, mime, name, bytes) {
  database().prepare(`
    INSERT INTO assets (key, mime, name, bytes, created_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET mime = excluded.mime, name = excluded.name, bytes = excluded.bytes
  `).run(key, mime, name, bytes, nowStamp());
}

function getAsset(key) {
  return database().prepare('SELECT * FROM assets WHERE key = ?').get(key) || null;
}

function assetPath(key) {
  return path.join(assetDir(), key);
}

function clearAssets() {
  const dir = assetDir();
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach((name) => {
    if (!/^[a-z0-9_]+$/i.test(name)) return;
    fs.rmSync(path.join(dir, name), { force: true });
  });
  database().prepare('DELETE FROM assets').run();
}

function close() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = {
  PUBLIC_PLANS,
  ROOT,
  dataDir,
  assetDir,
  init,
  loadState,
  saveAdminState,
  resetContent,
  loadWorks,
  loadUnits,
  loadSeedMap,
  loginAdmin,
  adminFromToken,
  destroyAdminToken,
  findUserByUsername,
  findUserByPhone,
  insertPublicUser,
  setUserPassword,
  touchUserLogin,
  createUserSession,
  userFromToken,
  destroyUserToken,
  publicUserView,
  membershipFor,
  addVipOrder,
  deleteUser,
  verifyPassword,
  settingsOf,
  saveAsset,
  getAsset,
  assetPath,
  close,
  nowStamp,
  randomId,
};
