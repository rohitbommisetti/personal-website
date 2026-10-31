// Regenerates public/posts/index.json from the Markdown files. Runs before `npm start` and `npm run build`.
const { buildIndex } = require('./posts-lib');

const posts = buildIndex();
console.log(`Indexed ${posts.length} post${posts.length === 1 ? '' : 's'} (${posts.filter((p) => p.draft).length} draft).`);
