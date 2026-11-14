import { Link } from 'react-router-dom';
import SmartImage from './SmartImage';
import { IconArrowRight, IconBookmark, IconClose, IconStar } from './Icons';
import { formatScore, rateLabel } from '../lib/format';
import { useLibrary } from '../context/LibraryProvider';

/**
 * 统一的电影卡片
 * - 海报固定 2:3，hover 轻微放大
 * - hover 时浮出简介与入口，移动端不依赖 hover
 * - 右上角收藏按钮，独立于详情链接
 */
export default function MovieCard({ movie, rank, onRemove, removeLabel = '移除', showMyRating = false }) {
  const { isFavorite, toggleFavorite, myRating } = useLibrary();
  const favorite = isFavorite(movie.id);
  const mine = showMyRating ? myRating(movie.id) : 0;

  return (
    <article className="movie-card">
      <Link className="movie-card__link" to={`/movie/${movie.id}`} aria-label={`查看《${movie.title}》详情`}>
        <SmartImage
          className="movie-card__media"
          src={movie.poster}
          alt={`${movie.title} 海报`}
          ratio="2 / 3"
          fallbackText={movie.title}
        >
          <span className="movie-card__score" title="CINÉ 编辑评分">
            <IconStar />
            {formatScore(movie.rating)}
          </span>

          {typeof rank === 'number' ? <span className="movie-card__rank">{String(rank).padStart(2, '0')}</span> : null}

          <span className="movie-card__hover">
            <span className="movie-card__hover-text">{movie.overview}</span>
            <span className="movie-card__hover-cta">
              查看详情
              <IconArrowRight />
            </span>
          </span>
        </SmartImage>

        <div className="movie-card__body">
          <h3 className="movie-card__title">{movie.title}</h3>
          <p className="movie-card__meta">
            {movie.year} · {movie.genres.slice(0, 2).join(' / ')}
          </p>
          {mine ? (
            <p className="movie-card__mine">
              我的评分 {mine} 分 · {rateLabel(mine)}
            </p>
          ) : null}
        </div>
      </Link>

      {/* 片单页里移除按钮更重要，避免两个圆钮挤在右上角 */}
      {!onRemove ? (
        <button
          type="button"
          className={`movie-card__bookmark ${favorite ? 'is-active' : ''}`}
          onClick={() => toggleFavorite(movie.id)}
          aria-pressed={favorite}
          aria-label={favorite ? `取消收藏《${movie.title}》` : `收藏《${movie.title}》`}
        >
          <IconBookmark filled={favorite} />
        </button>
      ) : null}

      {onRemove ? (
        <button
          type="button"
          className="movie-card__remove"
          onClick={() => onRemove(movie.id)}
          aria-label={`${removeLabel}《${movie.title}》`}
          title={removeLabel}
        >
          <IconClose />
        </button>
      ) : null}
    </article>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="movie-card movie-card--skeleton" aria-hidden="true">
      <div className="skeleton movie-card__media" />
      <div className="movie-card__body">
        <div className="skeleton skeleton--line" style={{ width: '68%' }} />
        <div className="skeleton skeleton--line skeleton--sm" style={{ width: '44%' }} />
      </div>
    </div>
  );
}
