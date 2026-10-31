import React, { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Writing from './pages/Writing';
import Post from './pages/Post';
import Bookshelf from './pages/Bookshelf';
import Quotes from './pages/Quotes';
import Trails from './pages/Trails';
import Places from './pages/Places';
import Photos from './pages/Photos';
import { NavigateContext } from './components/Link';

const routes = {
  '/': { page: Home, title: 'Rohit Bommisetti' },
  '/writing': { page: Writing, title: 'Writing — Rohit Bommisetti' },
  '/bookshelf': { page: Bookshelf, title: 'Bookshelf — Rohit Bommisetti' },
  '/quotes': { page: Quotes, title: 'Quotes — Rohit Bommisetti' },
  '/trails': { page: Trails, title: 'Trails — Rohit Bommisetti' },
  '/places': { page: Places, title: 'Places — Rohit Bommisetti' },
  '/photos': { page: Photos, title: 'Photos — Rohit Bommisetti' },
};

const normalize = (path) => path.replace(/\/+$/, '') || '/';

const resolve = (path) => {
  if (routes[path]) return { ...routes[path], props: {} };
  const post = /^\/writing\/([a-z0-9-]+)$/.exec(path);
  if (post) return { page: Post, title: 'Writing — Rohit Bommisetti', props: { slug: post[1] } };
  return { ...routes['/'], props: {} };
};

function App() {
  const [path, setPath] = useState(normalize(window.location.pathname));

  useEffect(() => {
    const onPop = () => setPath(normalize(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const route = resolve(path);

  useEffect(() => {
    document.title = route.title;
  }, [route.title, path]);

  const navigate = (to) => {
    // Keep ?drafts while browsing so draft previews survive navigation.
    const keep = new URLSearchParams(window.location.search).has('drafts') && !to.includes('?') ? '?drafts' : '';
    window.history.pushState({}, '', to + keep);
    setPath(normalize(to));
    window.scrollTo(0, 0);
  };

  const Page = route.page;
  return (
    <NavigateContext.Provider value={navigate}>
      <Layout>
        <Page {...route.props} />
      </Layout>
    </NavigateContext.Provider>
  );
}

export default App;
