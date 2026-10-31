import React, { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Writing from './pages/Writing';
import Bookshelf from './pages/Bookshelf';
import { NavigateContext } from './components/Link';

const routes = {
  '/': { page: Home, title: 'Rohit Bommisetti' },
  '/writing': { page: Writing, title: 'Writing — Rohit Bommisetti' },
  '/bookshelf': { page: Bookshelf, title: 'Bookshelf — Rohit Bommisetti' },
};

const normalize = (path) => path.replace(/\/+$/, '') || '/';

function App() {
  const [path, setPath] = useState(normalize(window.location.pathname));

  useEffect(() => {
    const onPop = () => setPath(normalize(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const route = routes[path] || routes['/'];

  useEffect(() => {
    document.title = route.title;
  }, [route]);

  const navigate = (to) => {
    window.history.pushState({}, '', to);
    setPath(normalize(to));
    window.scrollTo(0, 0);
  };

  const Page = route.page;
  return (
    <NavigateContext.Provider value={navigate}>
      <Layout>
        <Page />
      </Layout>
    </NavigateContext.Provider>
  );
}

export default App;
