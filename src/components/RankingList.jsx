import { Link } from 'react-router-dom';
import SmartImage from './SmartImage';
import { formatScore } from '../lib/format';
import { useLibrary } from '../context/LibraryProvider';

/** 排行榜列表：名次、海报、片名、年份、评分（含评分刻度条） */
export default function RankingList({ movies = [] }) {
  const { myRating } = useLibrary();

  return (
    <ol className="ranking-list">
      {movies.map((movie, i) => {
        const mine = myRating(movie.id);
        return (
          <li className="ranking-item" key={movie.id}>
            <Link className="ranking-item__link" to={`/movie/${movie.id}`}>
              <span className={`ranking-item__rank ${i < 3 ? 'is-top' : ''}`}>
                {String(i + 1).padStart(2, '0')}
              </span>

              <SmartImage
                className="ranking-item__poster"
                src={movie.poster}
                alt={`${movie.title} 海报`}
                ratio="2 / 3"
                fallbackText={movie.title}
              />

              <span className="ranking-item__info">
                <span className="ranking-item__title">{movie.title}</span>
                <span className="ranking-item__original">{movie.originalTitle}</span>
                <span className="ranking-item__meta">
                  {movie.year} · {movie.genres.join(' / ')}
                </span>
                {mine ? <span className="ranking-item__mine">我的评分 {mine} 分</span> : null}
              </span>

              <span className="ranking-item__score">
                <span className="ranking-item__value">{formatScore(movie.rating)}</span>
                <span className="ranking-item__bar" aria-hidden="true">
                  <i style={{ width: `${Math.min(movie.rating * 10, 100)}%` }} />
                </span>
                <span className="ranking-item__hint">CINÉ 评分</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
