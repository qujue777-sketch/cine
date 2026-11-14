import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieFilter from '../components/MovieFilter';
import MovieGrid from '../components/MovieGrid';
import EmptyState from '../components/EmptyState';
import { useMovies } from '../context/MoviesProvider';
import { filterMovies } from '../lib/movies';
import { MOVIES } from '../data/movies';

const PAGE_SIZE = 12;
const HEALING_IDS = ['heidi', 'little-forest', 'soul', 'walter-mitty', 'before-sunrise', 'your-name', 'into-the-wild'];

export default function Discover() {
  const { movies } = useMovies();
  const [params, setParams] = useSearchParams();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [pending, setPending] = useState(true);

  const filters = useMemo(
    () => ({
      query: params.get('q') || '',
      genre: params.get('genre') || 'all',
      decade: params.get('decade') || 'all',
      minRating: params.get('minRating') || 'all',
      sort: params.get('sort') || 'recommended',
      collection: params.get('collection') || null,
    }),
    [params]
  );

  const signature = `${filters.query}|${filters.genre}|${filters.decade}|${filters.minRating}|${filters.sort}|${filters.collection}`;

  // 条件变化时给出短暂的骨架屏过渡，避免列表「闪现」
  useEffect(() => {
    setVisible(PAGE_SIZE);
    setPending(true);
    const timer = window.setTimeout(() => setPending(false), 240);
    return () => window.clearTimeout(timer);
  }, [signature]);

  const base = useMemo(() => {
    if (filters.collection === 'classic') return movies.filter((movie) => movie.year <= 1990);
    if (filters.collection === 'healing') return movies.filter((movie) => HEALING_IDS.includes(movie.id));
    return movies;
  }, [movies, filters.collection]);

  const results = useMemo(
    () =>
      filterMovies(base, {
        query: filters.query,
        genre: filters.genre,
        decade: filters.decade,
        minRating: filters.minRating,
        sort: filters.sort,
      }),
    [base, filters]
  );

  const update = (patch) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([key, value]) => {
      const paramKey = key === 'query' ? 'q' : key;
      if (value === null || value === undefined || value === '' || value === 'all') next.delete(paramKey);
      else next.set(paramKey, String(value));
    });
    setParams(next, { replace: true });
  };

  const activeCount = [
    filters.query !== '',
    filters.genre !== 'all',
    filters.decade !== 'all',
    filters.minRating !== 'all',
    filters.sort !== 'recommended',
    Boolean(filters.collection),
  ].filter(Boolean).length;

  const shown = results.slice(0, visible);
  const hasMore = visible < results.length;

  return (
    <div className="page discover">
      <div className="container">
        <header className="page-head">
          <p className="eyebrow">Discover</p>
          <h1>发现电影</h1>
          <p className="page-head__desc">
            从 {MOVIES.length} 部影片里，按类型、年代和评分慢慢筛，总会遇见一部刚好合适的。
          </p>
        </header>

        <MovieFilter
          filters={filters}
          onChange={update}
          onReset={() => setParams(new URLSearchParams(), { replace: true })}
          resultCount={results.length}
          totalCount={movies.length}
          activeCount={activeCount}
        />

        <div className="discover__results">
          {pending ? (
            <MovieGrid loading skeletonCount={PAGE_SIZE} />
          ) : results.length ? (
            <>
              <MovieGrid movies={shown} />
              <div className="load-more">
                {hasMore ? (
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setVisible((value) => value + PAGE_SIZE)}
                  >
                    加载更多
                    <span className="load-more__count">还剩 {results.length - visible} 部</span>
                  </button>
                ) : (
                  <p className="load-more__end">已经到底了 · 共 {results.length} 部</p>
                )}
              </div>
            </>
          ) : (
            <EmptyState
              title="没有符合这些条件的电影"
              description="试着减少一个筛选条件，或者换一个关键词。"
              actionLabel="重置全部筛选"
              onAction={() => setParams(new URLSearchParams(), { replace: true })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
