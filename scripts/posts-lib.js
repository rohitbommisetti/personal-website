// Shared helpers for blog posts stored as Markdown files with a small frontmatter header.
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'public', 'posts');
const IMAGES_DIR = path.join(ROOT, 'public', 'images', 'posts');
const INDEX_FILE = path.join(POSTS_DIR, 'index.json');
const FIELDS = ['title', 'date', 'summary', 'cover', 'draft'];
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const slugify = (text) =>
  String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

const parseValue = (raw) => {
  const value = raw.trim();
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value.startsWith('"')) {
    try {
      return JSON.parse(value);
    } catch (e) {
      return value.slice(1, -1);
    }
  }
  return value;
};

const parse = (source) => {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(source);
  if (!match) return { meta: {}, body: source };
  const meta = {};
  match[1].split(/\r?\n/).forEach((line) => {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = parseValue(line.slice(i + 1));
  });
  return { meta, body: match[2].replace(/^\r?\n/, '') };
};

const serialize = (meta, body) => {
  const lines = FIELDS.filter((key) => meta[key] !== undefined && meta[key] !== '').map((key) =>
    typeof meta[key] === 'boolean' ? `${key}: ${meta[key]}` : `${key}: ${JSON.stringify(String(meta[key]))}`
  );
  return `---\n${lines.join('\n')}\n---\n\n${String(body).trim()}\n`;
};

const postPath = (slug) => {
  if (!SLUG_RE.test(slug)) throw new Error(`Invalid slug: ${slug}`);
  return path.join(POSTS_DIR, `${slug}.md`);
};

const listPosts = () => {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const { meta } = parse(fs.readFileSync(path.join(POSTS_DIR, file), 'utf8'));
      return {
        slug,
        title: meta.title || slug,
        date: meta.date || '',
        summary: meta.summary || '',
        cover: meta.cover || '',
        draft: meta.draft === true,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)));
};

const buildIndex = () => {
  fs.mkdirSync(POSTS_DIR, { recursive: true });
  const posts = listPosts();
  fs.writeFileSync(INDEX_FILE, `${JSON.stringify(posts, null, 2)}\n`);
  return posts;
};

module.exports = { ROOT, POSTS_DIR, IMAGES_DIR, SLUG_RE, slugify, parse, serialize, postPath, listPosts, buildIndex };
