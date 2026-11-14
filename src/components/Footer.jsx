import { Link } from 'react-router-dom';
import { tmdbEnabled } from '../lib/tmdb';
import { useMovies } from '../context/MoviesProvider';
import { MOVIES } from '../data/movies';

export default function Footer() {
  const { source } = useMovies();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Link className="brand" to="/">
            <span className="brand__mark">CINÉ</span>
            <span className="brand__dot" aria-hidden="true" />
          </Link>
          <p className="footer__tagline">Discover your next favorite film.</p>
          <p className="footer__desc">
            一个用杂志式排版做的电影发现与收藏平台：不做播放，只做挑选与记录。
          </p>
        </div>

        <nav className="footer__col" aria-label="站点导航">
          <h3>探索</h3>
          <Link to="/">首页</Link>
          <Link to="/discover">发现电影</Link>
          <Link to="/ranking">排行榜</Link>
          <Link to="/my-list">我的片单</Link>
        </nav>

        <nav className="footer__col" aria-label="专题导航">
          <h3>专题</h3>
          <Link to="/discover?genre=科幻">科幻电影</Link>
          <Link to="/discover?genre=悬疑">悬疑推理</Link>
          <Link to="/discover?genre=爱情">浪漫爱情</Link>
          <Link to="/discover?collection=classic">经典电影</Link>
        </nav>

        <div className="footer__col footer__col--meta">
          <h3>关于</h3>
          <p>共收录 {MOVIES.length} 部影片，支持收藏、想看、已看与个人评分。</p>
          <p>个人数据仅保存在浏览器本地（localStorage），不会上传。</p>
        </div>
      </div>

      <div className="container footer__legal">
        <p>
          海报与剧照版权归各电影公司所有，本站仅作学习与非商业作品展示之用。评分均为 CINÉ
          编辑评分，不代表任何平台的官方数据。
        </p>
        {tmdbEnabled && source === 'tmdb' ? (
          <p className="footer__tmdb">
            本产品使用 TMDB API 提供部分影片数据，但未获 TMDB 认可或认证。
          </p>
        ) : null}
        <p className="footer__copy">© 2026 CINÉ 电影宇宙 · Designed &amp; built as a front-end portfolio piece.</p>
      </div>
    </footer>
  );
}
