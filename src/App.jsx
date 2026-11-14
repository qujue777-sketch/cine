import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Detail from './pages/Detail';
import Ranking from './pages/Ranking';
import MyList from './pages/MyList';
import NotFound from './pages/NotFound';

export default function App() {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      <Navbar />

      {/* key 随路径变化，触发一次轻量的页面过渡动画 */}
      <main className="app-main" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/movie/:id" element={<Detail />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}
