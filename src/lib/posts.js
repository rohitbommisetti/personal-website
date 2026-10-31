import { marked } from 'marked';

// Drafts are hidden on the live site; add ?drafts to any URL (or run `npm start`) to see them.
export const showDrafts = () =>
  process.env.NODE_ENV === 'development' || new URLSearchParams(window.location.search).has('drafts');

export const formatDate = (iso) => {
  if (!iso) return '';
  const date = new Date(`${iso}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

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
  return { meta, body: match[2] };
};

export const fetchPosts = async () => {
  const res = await fetch('/posts/index.json', { cache: 'no-cache' });
  if (!res.ok) return [];
  const posts = await res.json();
  return showDrafts() ? posts : posts.filter((post) => !post.draft);
};

export const fetchPost = async (slug) => {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const res = await fetch(`/posts/${slug}.md`, { cache: 'no-cache' });
  const type = res.headers.get('content-type') || '';
  // Unknown paths fall through to index.html on Vercel, so check we really got Markdown back.
  if (!res.ok || type.includes('text/html')) return null;
  const { meta, body } = parse(await res.text());
  if (meta.draft === true && !showDrafts()) return null;
  return { slug, ...meta, html: marked.parse(body) };
};
