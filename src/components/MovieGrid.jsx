import MovieCard, { MovieCardSkeleton } from './MovieCard';
import EmptyState from './EmptyState';

/** 自适应网格：桌面 6 列 → 平板 4 列 → 手机 2 列 */
export default function MovieGrid({ movies = [], loading = false, skeletonCount = 12, empty, onRemove }) {
  if (loading) {
    return (
      <div className="movie-grid">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <MovieCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (!movies.length) {
    return empty || <EmptyState title="没有找到相关电影" description="换个关键词或放宽筛选条件再试试。" />;
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} onRemove={onRemove} />
      ))}
    </div>
  );
}
