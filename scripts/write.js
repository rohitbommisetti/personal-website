// Local blog editor. Run `npm run write`, then write and publish posts at http://localhost:4321.
// Posts are saved as Markdown in public/posts/, images in public/images/posts/<slug>/.
// It only listens on 127.0.0.1, so nothing here is reachable from the internet.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');
const lib = require('./posts-lib');

const PORT = Number(process.env.PORT) || 4321;
const PUBLIC_DIR = path.join(lib.ROOT, 'public');
const MAX_UPLOAD = 15 * 1024 * 1024;
const IMAGE_TYPES = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.webp': 'image/webp', '.avif': 'image/avif' };
const STATIC_TYPES = { ...IMAGE_TYPES, '.md': 'text/markdown; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };

const send = (res, status, body, type = 'application/json') => {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(type === 'application/json' ? JSON.stringify(body) : body);
};

const readBody = (req, limit) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(Object.assign(new Error('Upload too large (15 MB max)'), { status: 413 }));
        req.destroy();
      } else chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });

const git = (args) =>
  new Promise((resolve) => {
    execFile('git', args, { cwd: lib.ROOT }, (error, stdout, stderr) =>
      resolve({ ok: !error, out: `${stdout}${stderr}`.trim() })
    );
  });

const readPost = (slug) => {
  const file = lib.postPath(slug);
  if (!fs.existsSync(file)) return null;
  const { meta, body } = lib.parse(fs.readFileSync(file, 'utf8'));
  return { slug, meta, body };
};

const serveStatic = (res, urlPath) => {
  const file = path.normalize(path.join(PUBLIC_DIR, decodeURIComponent(urlPath)));
  if (!file.startsWith(PUBLIC_DIR + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    return send(res, 404, { error: 'Not found' });
  }
  send(res, 200, fs.readFileSync(file), STATIC_TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream');
};

const handle = async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const parts = url.pathname.split('/').filter(Boolean);

  if (req.method === 'GET' && url.pathname === '/') {
    return send(res, 200, fs.readFileSync(path.join(__dirname, 'editor.html')), 'text/html; charset=utf-8');
  }
  if (req.method === 'GET' && url.pathname === '/marked.js') {
    const markedEsm = path.join(path.dirname(require.resolve('marked')), 'marked.esm.js');
    return send(res, 200, fs.readFileSync(markedEsm), 'text/javascript');
  }
  if (req.method === 'GET' && ['posts', 'images', 'photos'].includes(parts[0])) {
    return serveStatic(res, url.pathname);
  }

  if (parts[0] !== 'api') return send(res, 404, { error: 'Not found' });

  // Only accept API calls from the editor page itself.
  const origin = req.headers.origin;
  if (origin && origin !== `http://localhost:${PORT}` && origin !== `http://127.0.0.1:${PORT}`) {
    return send(res, 403, { error: 'Forbidden' });
  }

  if (parts[1] === 'posts' && !parts[2] && req.method === 'GET') {
    return send(res, 200, lib.listPosts());
  }

  if (parts[1] === 'posts' && parts[2]) {
    const slug = parts[2];
    if (!lib.SLUG_RE.test(slug)) return send(res, 400, { error: 'Slugs use lowercase letters, numbers and dashes.' });

    if (req.method === 'GET') {
      const post = readPost(slug);
      return post ? send(res, 200, post) : send(res, 404, { error: 'Post not found' });
    }

    if (req.method === 'PUT') {
      const data = JSON.parse((await readBody(req, 2 * 1024 * 1024)).toString('utf8'));
      if (!String(data.title || '').trim()) return send(res, 400, { error: 'Add a title first.' });
      const previous = data.previousSlug;
      if (previous && previous !== slug) {
        if (fs.existsSync(lib.postPath(slug))) return send(res, 409, { error: `A post with the slug "${slug}" already exists.` });
        if (lib.SLUG_RE.test(previous) && fs.existsSync(lib.postPath(previous))) fs.unlinkSync(lib.postPath(previous));
      } else if (!previous && fs.existsSync(lib.postPath(slug))) {
        return send(res, 409, { error: `A post with the slug "${slug}" already exists.` });
      }
      const meta = {
        title: String(data.title).trim(),
        date: String(data.date || '').trim(),
        summary: String(data.summary || '').trim(),
        cover: String(data.cover || '').trim(),
        draft: data.draft !== false,
      };
      fs.mkdirSync(lib.POSTS_DIR, { recursive: true });
      fs.writeFileSync(lib.postPath(slug), lib.serialize(meta, data.body || ''));
      lib.buildIndex();
      return send(res, 200, { ok: true, post: readPost(slug), posts: lib.listPosts() });
    }

    if (req.method === 'DELETE') {
      if (fs.existsSync(lib.postPath(slug))) fs.unlinkSync(lib.postPath(slug));
      lib.buildIndex();
      return send(res, 200, { ok: true, posts: lib.listPosts() });
    }
  }

  if (parts[1] === 'upload' && req.method === 'POST') {
    const slug = url.searchParams.get('slug') || '';
    const name = url.searchParams.get('name') || 'image';
    if (!lib.SLUG_RE.test(slug)) return send(res, 400, { error: 'Give the post a title before adding images.' });
    const ext = path.extname(name).toLowerCase();
    if (!IMAGE_TYPES[ext]) return send(res, 400, { error: 'Images must be JPG, PNG, GIF, WebP or AVIF.' });
    const dir = path.join(lib.IMAGES_DIR, slug);
    fs.mkdirSync(dir, { recursive: true });
    const base = lib.slugify(path.basename(name, ext)) || 'image';
    let file = `${base}${ext}`;
    for (let i = 2; fs.existsSync(path.join(dir, file)); i++) file = `${base}-${i}${ext}`;
    fs.writeFileSync(path.join(dir, file), await readBody(req, MAX_UPLOAD));
    return send(res, 200, { url: `/images/posts/${slug}/${file}` });
  }

  if (parts[1] === 'status' && req.method === 'GET') {
    const [branch, status] = await Promise.all([
      git(['rev-parse', '--abbrev-ref', 'HEAD']),
      git(['status', '--porcelain', '--', 'public/posts', 'public/images']),
    ]);
    const changes = status.out ? status.out.split('\n').filter((line) => !line.endsWith('index.json')) : [];
    return send(res, 200, { branch: branch.out, changes });
  }

  if (parts[1] === 'commit' && req.method === 'POST') {
    const { message } = JSON.parse((await readBody(req, 64 * 1024)).toString('utf8') || '{}');
    const add = await git(['add', '--', 'public/posts', 'public/images']);
    if (!add.ok) return send(res, 500, { error: add.out });
    const commit = await git(['commit', '-m', String(message || 'Update blog posts').slice(0, 200)]);
    return commit.ok ? send(res, 200, { ok: true, out: commit.out }) : send(res, 500, { error: commit.out });
  }

  send(res, 404, { error: 'Not found' });
};

const server = http.createServer((req, res) => {
  handle(req, res).catch((error) => send(res, error.status || 500, { error: error.message }));
});

server.listen(PORT, '127.0.0.1', () => {
  lib.buildIndex();
  const url = `http://localhost:${PORT}`;
  console.log(`\n  Blog editor running at ${url}\n  Press Ctrl+C to stop.\n`);
  if (process.platform === 'darwin' && !process.env.NO_OPEN) execFile('open', [url]);
});
