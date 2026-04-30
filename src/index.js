// D1 database is accessed via env.DB

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === '/api/login') {
      return handleLogin(request, env);
    }
    if (url.pathname === '/api/upload') {
      return handleUpload(request, env, ctx);
    }
    if (url.pathname.startsWith('/api/images')) {
      return handleImages(request, env, url);
    }
    if (url.pathname.startsWith('/api/settings')) {
      return handleSettings(request, env);
    }
    if (url.pathname === '/api/stats') {
      return handleStats(request, env);
    }

    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
};

async function initDB(env) {
  // D1 database accessed directly via env.DB
  await env.DB.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);
  await env.DB.exec(`
    CREATE TABLE IF NOT EXISTS config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);
  await env.DB.exec(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      size INTEGER,
      upload_date DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  const stmt = env.DB.prepare("INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)");
  await stmt.bind(ADMIN_USER, ADMIN_PASS).run();
  const configStmt = env.DB.prepare("INSERT OR IGNORE INTO config (key, value) VALUES (?, ?)");
  await configStmt.bind("r2_bucket", "default-bucket").run();
  await configStmt.bind("r2_access_key_id", "").run();
  await configStmt.bind("r2_access_key", "").run();
  await configStmt.bind("site_name", "Cloud Storage").run();
  await configStmt.bind("site_email", "").run();
}

async function handleLogin(request, env) {
  await initDB(env);
  const { username, password } = await request.json();
  // D1 database accessed directly via env.DB
  const stmt = env.DB.prepare("SELECT * FROM users WHERE username = ? AND password = ?");
  const result = await stmt.bind(username, password).first();
  if (result) {
    return new Response(JSON.stringify({ success: true, token: 'fake-jwt-token-' + Date.now() }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return new Response(JSON.stringify({ success: false, message: 'Invalid credentials' }), {
    status: 401, headers: { 'Content-Type': 'application/json' }
  });
}

async function handleUpload(request, env, ctx) {
  const formData = await request.formData();
  const file = formData.get('file');
  const bucketName = formData.get('bucket') || 'default-bucket';
  if (!file) return new Response(JSON.stringify({ error: 'No file' }), { status: 400 });
  const arrayBuffer = await file.arrayBuffer();
  const blob = new Blob([arrayBuffer]);
  const key = `uploads/${Date.now()}-${file.name}`;
  await env.R2.put(key, blob);
  const url = `https://${bucketName}.r2.cloudflarestorage.com/${key}`;
  // D1 database accessed directly via env.DB
  const stmt = env.DB.prepare("INSERT INTO images (name, url, size) VALUES (?, ?, ?)");
  await stmt.bind(file.name, url, file.size).run();
  return new Response(JSON.stringify({ success: true, url }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleImages(request, env, url) {
  // D1 database accessed directly via env.DB
  if (url.pathname === '/api/images') {
    const stmt = env.DB.prepare("SELECT * FROM images ORDER BY upload_date DESC");
    const images = await stmt.all();
    return new Response(JSON.stringify(images), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    const id = url.pathname.split('/').pop();
    const stmt = env.DB.prepare("DELETE FROM images WHERE id = ?");
    await stmt.bind(id).run();
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleSettings(request, env) {
  // D1 database accessed directly via env.DB
  if (request.method === 'GET') {
    const configStmt = env.DB.prepare("SELECT * FROM config");
    const configs = await configStmt.all();
    const settings = {};
    configs.forEach(row => settings[row.key] = row.value);
    return new Response(JSON.stringify(settings), {
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    const data = await request.json();
    for (const [key, value] of Object.entries(data)) {
      const stmt = env.DB.prepare("INSERT OR REPLACE INTO config (key, value) VALUES (?, ?)");
      await stmt.bind(key, value).run();
    }
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleStats(request, env) {
  // D1 database accessed directly via env.DB
  const totalStmt = env.DB.prepare("SELECT COUNT(*) as count FROM images");
  const total = await totalStmt.first();
  const sizeStmt = env.DB.prepare("SELECT SUM(size) as total FROM images");
  const size = await sizeStmt.first();
  const todayStmt = env.DB.prepare("SELECT COUNT(*) as count FROM images WHERE DATE(upload_date) = DATE('now')");
  const today = await todayStmt.first();
  return new Response(JSON.stringify({
    total: total.count,
    size: (size.total / (1024 * 1024)).toFixed(2) + ' MB',
    today: today.count,
    traffic: '0 MB'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
