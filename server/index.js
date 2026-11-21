'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

loadEnvFile(path.resolve(__dirname, '..', '.env'));

const catalog = require('./catalog');
const db = require('./db');

const ROOT = db.ROOT;
const hits = new Map();

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  const text = fs.readFileSync(file, 'utf8');
  text.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const index = trimmed.indexOf('=');
    if (index < 1) return;
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (process.env[key] == null || process.env[key] === '') process.env[key] = value;
  });
}

function bumpLimit(key, limit, windowMs) {
  const now = Date.now();
  const row = hits.get(key) || { n: 0, reset: now + windowMs };
  if (now > row.reset) {
    row.n = 0;
    row.reset = now + windowMs;
  }
  row.n += 1;
  hits.set(key, row);
  return row.n <= limit;
}

function isLimited(key, limit) {
  const row = hits.get(key);
  return !!(row && Date.now() <= row.reset && row.n >= limit);
}

function sendJson(res, status, body) {
  const buf = Buffer.from(JSON.stringify(body));
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': buf.length,
  });
  res.end(buf);
}

function sendText(res, status, message) {
  const buf = Buffer.from(String(message || ''));
  res.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': buf.length,
  });
  res.end(buf);
}

function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        const error = new Error('请求体过大');
        error.status = 413;
        reject(error);
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function readJson(req, limit) {
  return readBody(req, limit || 32 * 1024 * 1024).then((buf) => {
    if (!buf.length) return {};
    try {
      return JSON.parse(buf.toString('utf8'));
    } catch (err) {
      const error = new Error('JSON 无法解析');
      error.status = 400;
      throw error;
    }
  });
}

function bearer(req) {
  const header = req.headers.authorization || '';
  const match = /^Bearer\s+(.+)$/i.exec(header);
  return match ? match[1].trim() : '';
}

function clientIp(req) {
  return (req.socket && req.socket.remoteAddress) || '';
}

function requireAdmin(req, res) {
  const admin = db.adminFromToken(bearer(req));
  if (!admin) {
    sendJson(res, 401, { ok: false, error: '登录已失效，请重新登录' });
    return null;
  }
  return admin;
}

function requireUser(req, res) {
  const user = db.userFromToken(bearer(req));
  if (!user) {
    sendJson(res, 401, { ok: false, error: '请先登录' });
    return null;
  }
  return user;
}

function usernameOk(value) {
  return /^[a-zA-Z][a-zA-Z0-9_]{3,19}$/.test(String(value || ''));
}

function phoneOk(value) {
  return /^1[3-9]\d{9}$/.test(String(value || ''));
}

function userPayload(row, token) {
  const membership = db.membershipFor(row);
  return {
    ok: true,
    token,
    user: db.publicUserView(row),
    membership,
  };
}

function registerUser(body) {
  const username = String(body.username || '').trim();
  const phone = String(body.phone || '').trim();
  const password = String(body.password || '');
  if (!username && !phone) {
    const error = new Error('请填写账号或手机号');
    error.status = 400;
    throw error;
  }
  if (username && !usernameOk(username)) {
    const error = new Error('账号需为4-20位字母开头');
    error.status = 400;
    throw error;
  }
  if (phone && !phoneOk(phone)) {
    const error = new Error('请输入正确的手机号');
    error.status = 400;
    throw error;
  }
  if (password && password.length < 6) {
    const error = new Error('密码至少6位');
    error.status = 400;
    throw error;
  }
  if (username) {
    const existing = db.findUserByUsername(username);
    if (existing) {
      const error = new Error('账号已存在');
      error.status = 409;
      throw error;
    }
  }
  if (phone) {
    const existing = db.findUserByPhone(phone);
    if (existing) {
      if (password) db.setUserPassword(existing.id, password);
      db.touchUserLogin(existing.id);
      const fresh = db.findUserByPhone(phone);
      return userPayload(fresh, db.createUserSession(fresh.id));
    }
  }
  const created = db.insertPublicUser({
    username,
    phone,
    password,
    nickname: username || phone,
  });
  return userPayload(created, db.createUserSession(created.id));
}

function loginUser(body) {
  const username = String(body.username || '').trim();
  const phone = String(body.phone || '').trim();
  const password = String(body.password || '');
  if (phone) {
    if (!phoneOk(phone)) {
      const error = new Error('请输入正确的手机号');
      error.status = 400;
      throw error;
    }
    let row = db.findUserByPhone(phone);
    if (!row) row = db.insertPublicUser({ phone, nickname: phone });
    db.touchUserLogin(row.id);
    const fresh = db.findUserByPhone(phone);
    return userPayload(fresh, db.createUserSession(fresh.id));
  }
  const row = db.findUserByUsername(username);
  if (!row || !row.password_hash || !db.verifyPassword(password, row.password_hash)) {
    const error = new Error('账号或密码错误');
    error.status = 401;
    throw error;
  }
  db.touchUserLogin(row.id);
  const fresh = db.findUserByUsername(username);
  return userPayload(fresh, db.createUserSession(fresh.id));
}

function resetPassword(body) {
  const phone = String(body.phone || '').trim();
  const password = String(body.password || '');
  if (!phoneOk(phone) || password.length < 6) {
    const error = new Error('手机号或密码无效');
    error.status = 400;
    throw error;
  }
  const row = db.findUserByPhone(phone);
  if (row) db.setUserPassword(row.id, password);
  return { ok: true };
}

function blockedStatic(rel) {
  if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return true;
  const parts = rel.split(path.sep).filter(Boolean);
  if (!parts.length) return false;
  if (parts.some((part) => part.startsWith('.'))) return true;
  const head = parts[0].toLowerCase();
  return head === 'data' || head === 'server' || head === 'node_modules';
}

function serveStatic(req, res, pathname) {
  let rel = decodeURIComponent(pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  rel = rel.replace(/^[/\\]+/, '');
  if (!rel) rel = 'index.html';
  if (blockedStatic(rel)) {
    sendText(res, 404, 'Not found');
    return;
  }
  const target = path.resolve(ROOT, rel);
  if (target !== ROOT && !target.startsWith(ROOT + path.sep)) {
    sendText(res, 404, 'Not found');
    return;
  }
  let stat;
  try {
    stat = fs.statSync(target);
  } catch (err) {
    sendText(res, 404, 'Not found');
    return;
  }
  if (stat.isDirectory()) {
    serveStatic(req, res, `/${rel.replace(/[/\\]+$/, '')}/index.html`);
    return;
  }
  const type = MIME[path.extname(target).toLowerCase()] || 'application/octet-stream';
  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': stat.size,
    'Cache-Control': 'no-cache',
  });
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  fs.createReadStream(target).pipe(res);
}

function serveAsset(req, res, key) {
  if (!/^[a-z0-9_]+$/i.test(key)) {
    sendText(res, 404, 'Not found');
    return;
  }
  const row = db.getAsset(key);
  const file = db.assetPath(key);
  if (!row || !fs.existsSync(file)) {
    sendText(res, 404, 'Not found');
    return;
  }
  const stat = fs.statSync(file);
  const mime = row.mime || 'application/octet-stream';
  const range = req.headers.range;
  if (range) {
    const match = /^bytes=(\d+)-(\d*)$/.exec(range);
    if (!match) {
      sendText(res, 416, 'Range not satisfiable');
      return;
    }
    const start = Number(match[1]);
    const end = match[2] ? Number(match[2]) : stat.size - 1;
    if (start >= stat.size || end >= stat.size || start > end) {
      res.writeHead(416, { 'Content-Range': `bytes */${stat.size}` });
      res.end();
      return;
    }
    res.writeHead(206, {
      'Content-Type': mime,
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      'Cache-Control': 'public, max-age=86400',
    });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    fs.createReadStream(file, { start, end }).pipe(res);
    return;
  }
  res.writeHead(200, {
    'Content-Type': mime,
    'Content-Length': stat.size,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=86400',
  });
  if (req.method === 'HEAD') {
    res.end();
    return;
  }
  fs.createReadStream(file).pipe(res);
}

function saveUpload(req, res, admin) {
  const kind = String(req.headers['x-asset-kind'] || 'file');
  const settings = db.settingsOf();
  const maxMb = kind === 'video' ? settings.videoMaxMb : settings.fileMaxMb;
  const limit = maxMb * 1024 * 1024;
  const key = db.randomId(kind === 'video' ? 'vid' : 'as');
  const file = db.assetPath(key);
  const mime = String(req.headers['content-type'] || 'application/octet-stream').split(';')[0];
  let name = 'upload';
  try {
    name = decodeURIComponent(String(req.headers['x-file-name'] || 'upload'));
  } catch (err) {
    name = 'upload';
  }
  return new Promise((resolve, reject) => {
    let size = 0;
    let failed = false;
    const out = fs.createWriteStream(file);
    function fail(error) {
      if (failed) return;
      failed = true;
      req.destroy();
      out.destroy();
      fs.rm(file, { force: true }, () => {});
      reject(error);
    }
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        const error = new Error(`文件超过 ${maxMb}MB 上限`);
        error.status = 413;
        fail(error);
      }
    });
    req.on('error', fail);
    out.on('error', fail);
    out.on('finish', () => {
      if (failed) return;
      db.saveAsset(key, mime, name.slice(0, 180), size);
      resolve({ ok: true, url: `/api/assets/${key}`, bytes: size, by: admin.username });
    });
    req.pipe(out);
  }).then((body) => sendJson(res, 201, body));
}

async function handleApi(req, res, url) {
  const pathname = url.pathname;
  if (req.method === 'GET' && pathname === '/api/health') {
    sendJson(res, 200, { ok: true });
    return;
  }
  if (req.method === 'GET' && pathname === '/api/public/catalog') {
    sendJson(res, 200, catalog.publicCatalog());
    return;
  }
  const assetMatch = pathname.match(/^\/api\/assets\/([a-z0-9_]+)$/i);
  if (assetMatch && (req.method === 'GET' || req.method === 'HEAD')) {
    serveAsset(req, res, assetMatch[1]);
    return;
  }
  if (req.method === 'POST' && pathname === '/api/admin/login') {
    const ip = clientIp(req);
    const body = await readJson(req, 64 * 1024);
    const limitKey = `admin:${ip}:${String(body.username || '').trim()}`;
    if (isLimited(limitKey, 8)) {
      sendJson(res, 429, { ok: false, error: '尝试过多，请稍后再试' });
      return;
    }
    const session = db.loginAdmin(body.username, body.password, ip);
    if (!session) {
      bumpLimit(limitKey, 8, 30000);
      sendJson(res, 401, { ok: false, error: '账号或密码错误' });
      return;
    }
    sendJson(res, 200, { ok: true, session, state: db.loadState() });
    return;
  }
  if (req.method === 'POST' && pathname === '/api/admin/logout') {
    db.destroyAdminToken(bearer(req));
    sendJson(res, 200, { ok: true });
    return;
  }
  if (req.method === 'GET' && pathname === '/api/admin/state') {
    if (!requireAdmin(req, res)) return;
    sendJson(res, 200, db.loadState());
    return;
  }
  if (req.method === 'PUT' && pathname === '/api/admin/state') {
    if (!requireAdmin(req, res)) return;
    const body = await readJson(req);
    db.saveAdminState(body);
    sendJson(res, 200, { ok: true });
    return;
  }
  if (req.method === 'POST' && pathname === '/api/admin/reset') {
    const admin = requireAdmin(req, res);
    if (!admin) return;
    const state = db.resetContent();
    sendJson(res, 200, { ok: true, state });
    return;
  }
  if (req.method === 'POST' && pathname === '/api/admin/assets') {
    const admin = requireAdmin(req, res);
    if (!admin) return;
    await saveUpload(req, res, admin);
    return;
  }
  if (req.method === 'POST' && pathname === '/api/auth/register') {
    if (!bumpLimit(`reg:${clientIp(req)}`, 30, 10 * 60 * 1000)) {
      sendJson(res, 429, { ok: false, error: '尝试过多，请稍后再试' });
      return;
    }
    const body = await readJson(req, 64 * 1024);
    sendJson(res, 200, registerUser(body));
    return;
  }
  if (req.method === 'POST' && pathname === '/api/auth/login') {
    if (!bumpLimit(`user:${clientIp(req)}`, 30, 10 * 60 * 1000)) {
      sendJson(res, 429, { ok: false, error: '尝试过多，请稍后再试' });
      return;
    }
    const body = await readJson(req, 64 * 1024);
    sendJson(res, 200, loginUser(body));
    return;
  }
  if (req.method === 'POST' && pathname === '/api/auth/reset') {
    const body = await readJson(req, 64 * 1024);
    sendJson(res, 200, resetPassword(body));
    return;
  }
  if (req.method === 'POST' && pathname === '/api/auth/logout') {
    db.destroyUserToken(bearer(req));
    sendJson(res, 200, { ok: true });
    return;
  }
  if (req.method === 'GET' && pathname === '/api/me/membership') {
    const user = requireUser(req, res);
    if (!user) return;
    sendJson(res, 200, Object.assign({ ok: true }, db.membershipFor(user)));
    return;
  }
  if (req.method === 'POST' && pathname === '/api/me/vip') {
    const user = requireUser(req, res);
    if (!user) return;
    const body = await readJson(req, 64 * 1024);
    const result = db.addVipOrder(user, body || {});
    sendJson(res, 200, { ok: true, order: result.order, expireStamp: result.membership.expireStamp, membership: result.membership });
    return;
  }
  if (req.method === 'DELETE' && pathname === '/api/me') {
    const user = requireUser(req, res);
    if (!user) return;
    db.deleteUser(user);
    sendJson(res, 200, { ok: true });
    return;
  }
  sendJson(res, 404, { ok: false, error: '接口不存在' });
}

function createHandler() {
  db.init();
  return function handler(req, res) {
    const url = new URL(req.url, 'http://127.0.0.1');
    const task = url.pathname.startsWith('/api/')
      ? handleApi(req, res, url)
      : Promise.resolve().then(() => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          sendText(res, 405, 'Method not allowed');
          return;
        }
        serveStatic(req, res, url.pathname);
      });
    Promise.resolve(task).catch((err) => {
      if (res.headersSent) return;
      const status = err && err.status ? err.status : 500;
      sendJson(res, status, { ok: false, error: status >= 500 ? '服务器错误' : (err.message || '请求失败') });
      if (status >= 500) console.error(err);
    });
  };
}

function start(options) {
  options = options || {};
  if (options.dataDir) process.env.DATA_DIR = options.dataDir;
  if (options.databasePath) process.env.DATABASE_PATH = options.databasePath;
  if (options.adminPassword) process.env.ADMIN_PASSWORD = options.adminPassword;
  if (options.adminUsername) process.env.ADMIN_USERNAME = options.adminUsername;
  const server = http.createServer(createHandler());
  const host = options.host || '127.0.0.1';
  const port = options.port == null ? 0 : options.port;
  return new Promise((resolve) => {
    server.listen(port, host, () => {
      const address = server.address();
      resolve({
        url: `http://${host === '0.0.0.0' ? '127.0.0.1' : host}:${address.port}`,
        port: address.port,
        close() {
          return new Promise((done, reject) => {
            server.close((err) => {
              try { db.close(); } catch (closeErr) { /* ignore */ }
              if (err) reject(err);
              else done();
            });
          });
        },
      });
    });
  });
}

if (require.main === module) {
  const host = process.env.HOST || '0.0.0.0';
  const port = Number(process.env.PORT || 3000);
  start({ host, port }).then((server) => {
    console.log(`COMICSN is running at http://${host === '0.0.0.0' ? 'localhost' : host}:${server.port}`);
    console.log('Admin console: /admin/');
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { start, loadEnvFile };
