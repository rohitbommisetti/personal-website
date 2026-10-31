# bommisetti.org

Personal site. React (Create React App), deployed on Vercel from `main`.

## Writing and publishing a blog post

```bash
npm run write
```

This opens a local editor at http://localhost:4321.

1. Click **New post**, add a title, and write in Markdown. The preview updates as you type.
2. Drag, drop or paste images into the editor (or use **Image** / cover **Upload**). They're saved to `public/images/posts/<slug>/`.
3. **Save draft** keeps it hidden on the live site. **Publish** makes it visible.
4. Click **Commit changes**, then open GitHub Desktop and **Push origin**. Vercel deploys within a minute or two.

Posts are plain Markdown files in `public/posts/`, so you can also edit them by hand. Drafts are hidden on the live site; add `?drafts` to any URL to preview them (works on Vercel previews too).

## Editing the other pages

Each page reads from a simple list you can edit directly:

| Page | File |
| --- | --- |
| Bookshelf | `src/data/books.js` |
| Quotes | `src/data/quotes.js` |
| Trails | `src/data/trails.js` |
| Places | `src/data/places.js` |
| Photos | `src/data/photos.js` (put images in `public/photos/`) |

## Running the site locally

```bash
npm install
npm start
```

`npm start` (and `npm run build`) regenerate `public/posts/index.json` from the Markdown files first.
