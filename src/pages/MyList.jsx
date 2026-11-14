import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import EmptyState from '../components/EmptyState';
import { useLibrary } from '../context/LibraryProvider';
import { useMovies } from '../context/MoviesProvider';
import { LIBRARY_TABS } from '../data/constants';
import { IconArrowRight } from '../components/Icons';

export default function MyList() {
  const { movies } = useMovies();
  const { favorites, watchlist, watched, ratings, stats, removeFrom, clearRating } = useLibrary();
  const [tab, setTab] = useState('favorites');

  const index = useMemo(() => new Map(movies.map((movie) => [movie.id, movie])), [movies]);

  const items = useMemo(() => {
    if (tab === 'ratings') {
      return Object.entries(ratings)
        .map(([id, score]) => ({ movie: index.get(id), score }))
        .filter((item) => Boolean(item.movie))
        .sort((a, b) => b.score - a.score)
        .map((item) => item.movie);
    }
    const ids = tab === 'favorites' ? favorites : tab === 'watchlist' ? watchlist : watched;
    return [...ids].reverse().map((id) => index.get(id)).filter(Boolean);
  }, [tab, ratings, favorites, watchlist, watched, index]);

  const activeTab = LIBRARY_TABS.find((item) => item.key === tab) || LIBRARY_TABS[0];

  return (
    <div className="page my-list">
      <div className="container">
        <header className="page-head page-head--split">
          <div>
            <p className="eyebrow">My List</p>
            <h1>我的片单</h1>
            <p className="page-head__desc">
              收藏、想看、已看与评分都保存在本地浏览器里，换设备不会同步，刷新却一定还在。
            </p>
          </div>
          <Link className="btn btn--ghost" to="/discover">
            继续发现
            <IconArrowRight />
          </Link>
        </header>

        <div className="library-stats">
          {LIBRARY_TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`stat-card ${tab === item.key ? 'is-active' : ''}`}
              onClick={() => setTab(item.key)}
            >
              <span className="stat-card__value">{stats[item.key]}</span>
              <span className="stat-card__label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="library-bar">
          <p>
            {activeTab.label}
            <span className="library-bar__count">{items.length} 部</span>
          </p>
          <p className="library-bar__hint">数据保存在 localStorage · 刷新不会丢失</p>
        </div>

        {items.length ? (
          <div className="movie-grid">
            {items.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                showMyRating={tab === 'ratings'}
                onRemove={(id) => (tab === 'ratings' ? clearRating(id) : removeFrom(tab, id))}
                removeLabel={tab === 'ratings' ? '删除评分' : '从片单移除'}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title={activeTab.empty}
            description="从「发现电影」开始，把喜欢的作品一部部收进来。"
            actionLabel="去发现电影"
            to="/discover"
          />
        )}
      </div>
    </div>
  );
}
