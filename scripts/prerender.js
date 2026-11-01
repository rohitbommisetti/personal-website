// Runs after `npm run build`. Writes a real HTML file for every page and published post, each with
// its own title, description, canonical URL, social tags, structured data and readable content,
// plus sitemap.xml and robots.txt. Search engines and link previews get full pages without running
// JavaScript; visitors still get the React app, which replaces the static content on load.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');
const { marked } = require('marked');
const lib = require('./posts-lib');

const SITE = 'https://bommisetti.org';
const BUILD = path.join(lib.ROOT, 'build');
const SRC_DATA = path.join(lib.ROOT, 'src', 'data');
const DEFAULT_IMAGE = `${SITE}/og-image.jpg?v=1`;
const PREVIEW_TEXT = 'Renovus Capital'; // what link previews show under the title

// The data files are ES modules; load them without a bundler.
const loadData = (name) => {
  const code = fs
    .readFileSync(path.join(SRC_DATA, `${name}.js`), 'utf8')
    .replace(/export const (\w+) =/g, 'const $1 = exports.$1 =')
    .replace(/export default (\w+);/, 'exports.default = $1;');
  const exports = {};
  vm.runInNewContext(code, { exports });
  return exports;
};

const esc = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const absolute = (url) => (!url ? '' : url.startsWith('http') ? url : `${SITE}${url.startsWith('/') ? '' : '/'}${url}`);
const listOf = (items, n = 3) => {
  const names = items.slice(0, n);
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0] || '';
};
// Last commit date of a file, so sitemap dates only change when the content does.
const gitDate = (file) => {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { cwd: lib.ROOT }).toString().trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : undefined;
  } catch (e) {
    return undefined;
  }
};
const dataDate = (name) => gitDate(path.join('src', 'data', `${name}.js`));
const isoDate = (value) => (/^\d{4}-\d{2}-\d{2}$/.test(value) ? value : new Date().toISOString().slice(0, 10));
const fromUsDate = (value) => {
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value || '');
  return m ? `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}` : isoDate();
};

const profile = loadData('profile').default;
const { default: books, lastUpdated: booksUpdated } = loadData('books');
const quotes = loadData('quotes').default;
const trails = loadData('trails').default;
const places = loadData('places').default;
const photos = loadData('photos').default;
const posts = lib.listPosts().filter((post) => !post.draft);

const person = {
  '@type': 'Person',
  '@id': `${SITE}/#person`,
  name: profile.name,
  url: SITE,
  image: DEFAULT_IMAGE,
  description: profile.description,
  worksFor: { '@type': 'Organization', name: profile.employer.name, url: profile.employer.url },
  alumniOf: profile.alumniOf.map((name) => ({ '@type': 'CollegeOrUniversity', name })),
  homeLocation: { '@type': 'Place', name: `${profile.location}, Pennsylvania` },
  sameAs: profile.sameAs,
};
const website = { '@type': 'WebSite', '@id': `${SITE}/#website`, url: SITE, name: profile.name, publisher: { '@id': `${SITE}/#person` } };
const breadcrumbs = (name, url) => ({
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: profile.name, item: SITE },
    { '@type': 'ListItem', position: 2, name, item: url },
  ],
});

// ---- Static HTML content for each page -------------------------------------------------------

const bioHtml = profile.bio
  .map((paragraph) =>
    `<p>${paragraph.map((piece) => (typeof piece === 'string' ? esc(piece) : `<a href="${esc(piece.href)}">${esc(piece.text)}</a>`)).join('')}</p>`
  )
  .join('\n');
const nav = ['Writing', 'Bookshelf', 'Quotes', 'Trails', 'Places', 'Photos'];
const back = (href = '/', label = '← Back') => `<p class="pre-muted"><a href="${href}">${label}</a></p>`;

const pages = [
  {
    route: '/',
    title: profile.name,
    description: profile.description,
    previewText: PREVIEW_TEXT,
    lastmod: dataDate('profile'),
    schema: [person, website, { '@type': 'ProfilePage', url: SITE, name: profile.name, mainEntity: { '@id': `${SITE}/#person` } }],
    body: `${bioHtml}\n<nav aria-label="Sections"><ul>${nav.map((n) => `<li><a href="/${n.toLowerCase()}">${n}</a></li>`).join('')}</ul></nav>`,
    priority: '1.0',
  },
  {
    route: '/writing',
    title: `Writing — ${profile.name}`,
    description: `Essays and notes by ${profile.name} on AI, the service economy, private equity, books and the outdoors.`,
    lastmod: posts.length ? isoDate(posts[0].date) : undefined,
    body: `<h1>Writing</h1>\n${
      posts.length
        ? `<ul>${posts.map((p) => `<li><a href="/writing/${p.slug}">${esc(p.title)}</a> <time datetime="${esc(p.date)}">${esc(p.date)}</time></li>`).join('')}</ul>`
        : '<p>New writing is on the way.</p>'
    }\n${back()}`,
    priority: '0.9',
  },
  {
    route: '/bookshelf',
    title: `Bookshelf — ${profile.name}`,
    description: `Books ${profile.name} has read and recommends, including ${listOf(books.map((b) => b.title))}.`,
    lastmod: fromUsDate(booksUpdated),
    body: `<h1>Bookshelf</h1>\n<ul>${books.map((b) => `<li>${esc(b.title)} — ${esc(b.author)}</li>`).join('')}</ul>\n<p>Last updated ${esc(booksUpdated)}</p>\n${back()}`,
    priority: '0.8',
  },
  {
    route: '/quotes',
    title: `Quotes — ${profile.name}`,
    lastmod: dataDate('quotes'),
    description: `Quotes ${profile.name} returns to, from ${listOf(quotes.map((q) => q.author))} and others.`,
    body: `<h1>Quotes</h1>\n${quotes
      .map((q) => `<blockquote><p>“${esc(q.text)}”</p><footer>${esc(q.author)}${q.source ? `, <cite>${esc(q.source)}</cite>` : ''}</footer></blockquote>`)
      .join('\n')}\n${back()}`,
    priority: '0.7',
  },
  {
    route: '/trails',
    title: `Trails — ${profile.name}`,
    lastmod: dataDate('trails'),
    description: `Runs, hikes and ocean swims by ${profile.name}, including ${listOf(trails.map((t) => t.name))}.`,
    body: `<h1>Trails</h1>\n<ul>${trails
      .map((t) => `<li><strong>${esc(t.name)}</strong> (${esc(t.type)}) — ${esc(t.place)}, ${esc(t.distance)}.${t.note ? ` ${esc(t.note)}` : ''}</li>`)
      .join('')}</ul>\n${back()}`,
    priority: '0.7',
  },
  {
    route: '/places',
    title: `Places in Philadelphia — ${profile.name}`,
    lastmod: dataDate('places'),
    description: `${profile.name}’s favorite places in Philadelphia, including ${listOf(places.flatMap((g) => g.items.map((i) => i.name)))}.`,
    body: `<h1>Places in Philadelphia</h1>\n${places
      .map((g) => `<h2>${esc(g.category)}</h2><ul>${g.items.map((i) => `<li><strong>${esc(i.name)}</strong> — ${esc(i.area)}. ${esc(i.note)}</li>`).join('')}</ul>`)
      .join('\n')}\n${back()}`,
    priority: '0.7',
  },
  {
    route: '/photos',
    title: `Photos — ${profile.name}`,
    lastmod: dataDate('photos'),
    description: `Photos by ${profile.name}: trails, coastlines and places along the way.`,
    images: photos.map((p) => ({ src: p.src, caption: p.caption })),
    body: `<h1>Photos</h1>\n${photos
      .map((p) => `<figure><img src="${esc(p.src)}" alt="${esc(p.caption)}" loading="lazy" width="1200" height="800"><figcaption>${esc(p.caption)}</figcaption></figure>`)
      .join('\n')}\n${back()}`,
    priority: '0.6',
  },
];

posts.forEach((meta) => {
  const { body } = lib.parse(fs.readFileSync(lib.postPath(meta.slug), 'utf8'));
  const html = marked.parse(body);
  const url = `${SITE}/writing/${meta.slug}`;
  const image = meta.cover ? absolute(meta.cover) : DEFAULT_IMAGE;
  const inlineImages = [...html.matchAll(/<img[^>]+src="([^"]+)"[^>]*?(?:alt="([^"]*)")?/g)].map((m) => ({ src: m[1], caption: m[2] || meta.title }));
  pages.push({
    route: `/writing/${meta.slug}`,
    title: `${meta.title} — ${profile.name}`,
    description: meta.summary || `${meta.title}, by ${profile.name}.`,
    type: 'article',
    image,
    published: meta.date,
    lastmod: isoDate(meta.date),
    images: [...(meta.cover ? [{ src: meta.cover, caption: meta.title }] : []), ...inlineImages],
    schema: [
      {
        '@type': 'BlogPosting',
        headline: meta.title,
        description: meta.summary || undefined,
        datePublished: meta.date,
        dateModified: meta.date,
        url,
        mainEntityOfPage: url,
        image,
        author: { '@id': `${SITE}/#person`, '@type': 'Person', name: profile.name, url: SITE },
        publisher: { '@id': `${SITE}/#person` },
      },
      breadcrumbs('Writing', `${SITE}/writing`),
    ],
    body: `<article><h1>${esc(meta.title)}</h1>\n<p class="pre-muted"><time datetime="${esc(meta.date)}">${esc(meta.date)}</time> · ${esc(profile.name)}</p>\n${
      meta.cover ? `<img src="${esc(meta.cover)}" alt="" width="1200" height="600">\n` : ''
    }${html}</article>\n${back('/writing', '← Writing')}`,
    priority: '0.8',
  });
});

// ---- Write the HTML files ----------------------------------------------------------------------

// Keep the untouched app shell as 200.html so re-running this script never templates from a page
// it already rendered. `react-scripts build` empties build/, so a fresh build always starts clean.
const SHELL = path.join(BUILD, '200.html');
if (!fs.existsSync(SHELL)) fs.copyFileSync(path.join(BUILD, 'index.html'), SHELL);
const template = fs.readFileSync(SHELL, 'utf8');
if (!template.includes('<div id="root"></div>')) throw new Error('build/200.html is not the empty app shell; run npm run build.');

const PRE_STYLE = `<style id="prerender-style">
.pre{max-width:800px;margin:0 auto;box-sizing:border-box;padding:112px 64px 64px;font:14px/1.6 system-ui,Avenir,Helvetica,Arial,sans-serif;color:var(--ink);background:var(--bg)}
.pre a{color:var(--ink);text-decoration:none;border-bottom:1px solid var(--line)}.pre header{display:flex;justify-content:space-between;margin-bottom:32px}
.pre header a{font-weight:600;font-size:16px;border:0}.pre h1{font-size:14px;font-weight:400;color:var(--muted)}.pre ul{padding:0;list-style:none}
.pre img{max-width:100%;height:auto;border-radius:4px}.pre-muted,.pre time{color:var(--muted);font-size:12px}
@media (max-width:768px){.pre{padding:64px 24px 48px}}</style>`;

const headFor = (page) => {
  const url = page.route === '/' ? `${SITE}/` : `${SITE}${page.route}`;
  const image = page.image || DEFAULT_IMAGE;
  const preview = page.previewText || (page.type === 'article' ? page.description : PREVIEW_TEXT);
  const graph = { '@context': 'https://schema.org', '@graph': page.schema || [person, breadcrumbs(page.title.split(' — ')[0], url)] };
  const tags = [
    `<title>${esc(page.title)}</title>`,
    `<meta name="description" content="${esc(page.description)}">`,
    `<link rel="canonical" href="${url}">`,
    `<meta name="robots" content="index,follow,max-image-preview:large">`,
    `<meta name="author" content="${esc(profile.name)}">`,
    `<meta property="og:type" content="${page.type || 'website'}">`,
    `<meta property="og:site_name" content="${esc(profile.name)}">`,
    `<meta property="og:title" content="${esc(page.title)}">`,
    `<meta property="og:description" content="${esc(preview)}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${esc(image)}">`,
    image === DEFAULT_IMAGE ? '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="1200">' : '',
    `<meta property="og:image:alt" content="${esc(image === DEFAULT_IMAGE ? `${profile.name} as a kid` : page.title)}">`,
    page.published ? `<meta property="article:published_time" content="${esc(page.published)}"><meta property="article:author" content="${SITE}/">` : '',
    `<meta name="twitter:card" content="${image === DEFAULT_IMAGE ? 'summary' : 'summary_large_image'}">`,
    `<meta name="twitter:title" content="${esc(page.title)}">`,
    `<meta name="twitter:description" content="${esc(preview)}">`,
    `<meta name="twitter:image" content="${esc(image)}">`,
    `<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, '\\u003c')}</script>`,
    PRE_STYLE,
  ];
  return tags.filter(Boolean).join('');
};

const render = (page) => {
  const head = template
    .replace(/<title>[\s\S]*?<\/title>/, '')
    .replace(/<meta name="description"[^>]*>/g, '')
    .replace(/<meta property="og:[^"]+"[^>]*>/g, '')
    .replace(/<meta name="twitter:[^"]+"[^>]*>/g, '')
    .replace('</head>', `${headFor(page)}</head>`);
  const content = `<div class="pre"><header><a href="/">${esc(profile.name)}</a><nav><a href="${profile.sameAs[0]}">X</a> <a href="${profile.sameAs[1]}">LinkedIn</a></nav></header>
<main>${page.body}</main>
<footer class="pre-muted">${esc(profile.location)}</footer></div>`;
  return head.replace(/<div id="root"><\/div>/, `<div id="root">${content}</div>`);
};

pages.forEach((page) => {
  // With cleanUrls on Vercel, /bookshelf serves bookshelf.html and /writing/x serves writing/x.html.
  const file = page.route === '/' ? 'index.html' : `${page.route.slice(1)}.html`;
  fs.mkdirSync(path.dirname(path.join(BUILD, file)), { recursive: true });
  fs.writeFileSync(path.join(BUILD, file), render(page));
});

// ---- sitemap.xml and robots.txt --------------------------------------------------------------

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${pages
  .map((page) => {
    const loc = page.route === '/' ? `${SITE}/` : `${SITE}${page.route}`;
    const images = [...(page.route === '/' ? [{ src: DEFAULT_IMAGE, caption: profile.name }] : []), ...(page.images || [])]
      .map((img) => `    <image:image><image:loc>${esc(absolute(img.src))}</image:loc><image:caption>${esc(img.caption)}</image:caption></image:image>`)
      .join('\n');
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${page.lastmod || today}</lastmod>\n    <priority>${page.priority}</priority>\n${images ? `${images}\n` : ''}  </url>`;
  })
  .join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(BUILD, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(BUILD, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

console.log(`Prerendered ${pages.length} pages (${posts.length} post${posts.length === 1 ? '' : 's'}) and wrote sitemap.xml.`);
