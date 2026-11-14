import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import SmartImage from '../components/SmartImage';
import MovieRow from '../components/MovieRow';
import RatingPicker from '../components/RatingPicker';
import EmptyState from '../components/EmptyState';
import { useMovies } from '../context/MoviesProvider';
import { useLibrary } from '../context/LibraryProvider';
import { getSimilar } from '../lib/movies';
import { formatDate, formatRuntime, formatScore } from '../lib/format';
import { IconArrowRight, IconBookmark, IconCheck, IconEye, IconStar } from '../components/Icons';

export default function Detail() {
  const { id } = useParams();
  const { getMovie, movies } = useMovies();
  const {
    isFavorite,
    isWatchlisted,
    isWatched,
    toggleFavorite,
    toggleWatchlist,
    toggleWatched,
    myRating,
    setRating,
    clearRating,
  } = useLibrary();

  const movie = getMovie(id);
  const similar = useMemo(() => {
    if (!movie) return [];
    const list = getSimilar(movie, movies, 6);
    if (list.length) return list;
    return movies
      .filter((item) => item.id !== movie.id)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6);
  }, [movie, movies]);

  if (!movie) {
    return (
      <div className="page container">
        <EmptyState
          title="没有找到这部电影"
          description="它可能不在当前资料库里，去发现页看看别的作品吧。"
          actionLabel="返回发现页"
          to="/discover"
        />
      </div>
    );
  }

  const favorite = isFavorite(movie.id);
  const watchlisted = isWatchlisted(movie.id);
  const watched = isWatched(movie.id);
  const mine = myRating(movie.id);

  return (
    <article className="page detail">
      <div className="detail__backdrop" aria-hidden="true">
        <SmartImage src={movie.backdrop} alt="" priority fallbackText={movie.title} />
        <span className="detail__backdrop-scrim" />
      </div>

      <div className="container detail__grid">
        <div className="detail__poster-col">
          <SmartImage
            className="detail__poster"
            src={movie.poster}
            alt={`${movie.title} 海报`}
            ratio="2 / 3"
            priority
            fallbackText={movie.title}
          />

          <div className="detail__score-card">
            <p className="detail__score-label">
              <IconStar />
              CINÉ 评分
            </p>
            <p className="detail__score-value">
              {formatScore(movie.rating)}
              <span>/ 10</span>
            </p>
            <span className="detail__score-bar" aria-hidden="true">
              <i style={{ width: `${Math.min(movie.rating * 10, 100)}%` }} />
            </span>
            <p className="detail__score-note">编辑评分 · 仅用于本站排版展示</p>
          </div>
        </div>

        <div className="detail__main">
          <p className="eyebrow">
            电影 · {movie.year}
            {movie.country ? ` · ${movie.country}` : ''}
          </p>
          <h1 className="detail__title">{movie.title}</h1>
          <p className="detail__original">{movie.originalTitle}</p>
          {movie.tagline ? <p className="detail__tagline">「{movie.tagline}」</p> : null}

          <div className="detail__pills">
            <span className="pill">{movie.year}</span>
            <span className="pill">{formatRuntime(movie.runtime)}</span>
            {movie.genres.map((genre) => (
              <Link className="pill pill--link" key={genre} to={`/discover?genre=${encodeURIComponent(genre)}`}>
                {genre}
              </Link>
            ))}
          </div>

          <div className="detail__actions">
            <button
              type="button"
              className={`btn ${favorite ? 'btn--primary' : 'btn--dark'}`}
              onClick={() => toggleFavorite(movie.id)}
              aria-pressed={favorite}
            >
              <IconBookmark filled={favorite} />
              {favorite ? '已在收藏' : '收藏这部电影'}
            </button>
            <button
              type="button"
              className={`btn btn--ghost ${watchlisted ? 'is-active' : ''}`}
              onClick={() => toggleWatchlist(movie.id)}
              aria-pressed={watchlisted}
            >
              <IconCheck />
              {watchlisted ? '已在想看' : '想看'}
            </button>
            <button
              type="button"
              className={`btn btn--ghost ${watched ? 'is-active' : ''}`}
              onClick={() => toggleWatched(movie.id)}
              aria-pressed={watched}
            >
              <IconEye />
              {watched ? '已看过' : '标记已看'}
            </button>
          </div>

          <dl className="detail__facts">
            <div>
              <dt>上映日期</dt>
              <dd>{formatDate(movie.releaseDate)}</dd>
            </div>
            <div>
              <dt>导演</dt>
              <dd>{movie.director || '暂无资料'}</dd>
            </div>
            <div>
              <dt>主演</dt>
              <dd>{movie.cast.length ? movie.cast.join(' / ') : '暂无资料'}</dd>
            </div>
          </dl>

          <section className="detail__section">
            <h2>剧情简介</h2>
            <p>{movie.overview}</p>
          </section>

          <section className="detail__section detail__rating">
            <div className="detail__rating-head">
              <h2>我的评分</h2>
              <p>1—10 分，只保存在你的浏览器里。</p>
            </div>
            <RatingPicker value={mine} onChange={(score) => setRating(movie.id, score)} onClear={() => clearRating(movie.id)} />
          </section>
        </div>
      </div>

      <div className="container">
        <section className="section detail__similar">
          <div className="section-header">
            <div>
              <p className="eyebrow">You may also like</p>
              <h2 className="section-header__title">相似电影</h2>
              <p className="section-header__desc">同类型或同导演的作品，顺着这条线继续看下去。</p>
            </div>
            <Link className="text-link" to={`/discover?genre=${encodeURIComponent(movie.genres[0] || '')}`}>
              更多{movie.genres[0] || ''}电影
              <IconArrowRight />
            </Link>
          </div>
          <MovieRow movies={similar} ariaLabel="相似电影" />
        </section>
      </div>
    </article>
  );
}
