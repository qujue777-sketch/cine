import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import SmartImage from './SmartImage';
import { filterMovies, getTrending } from '../lib/movies';
import { formatScore } from '../lib/format';
import { useMovies } from '../context/MoviesProvider';

/**
 * 顶部搜索浮层
 * - 输入即时匹配片名 / 导演 / 演员 / 年份
 * - 回车进入发现页查看完整结果
 * - Esc 或点击遮罩关闭，打开时锁定页面滚动
 */
export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState('');
  const { movies } = useMovies();
  const navigate = useNavigate();
  const inputWrapperRef = useRef(null);

  const results = useMemo(() => {
    if (!query.trim()) return getTrending(movies, 4);
    return filterMovies(movies, { query, sort: 'recommended' }).slice(0, 6);
  }, [movies, query]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  if (!open) return null;

  const goToResults = () => {
    const q = query.trim();
    onClose();
    navigate(q ? `/discover?q=${encodeURIComponent(q)}` : '/discover');
  };

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="搜索电影">
      <button type="button" className="search-overlay__backdrop" onClick={onClose} aria-label="关闭搜索" />

      <div className="search-overlay__panel" ref={inputWrapperRef}>
        <SearchBar
          large
          autoFocus
          value={query}
          onChange={setQuery}
          onSubmit={goToResults}
          placeholder="搜索电影、导演或演员，回车查看全部结果"
        />

        <p className="search-overlay__label">{query.trim() ? '搜索结果' : '大家都在看'}</p>

        <ul className="search-results">
          {results.map((movie) => (
            <li key={movie.id}>
              <button
                type="button"
                className="search-result"
                onClick={() => {
                  onClose();
                  navigate(`/movie/${movie.id}`);
                }}
              >
                <SmartImage
                  className="search-result__poster"
                  src={movie.poster}
                  alt=""
                  ratio="2 / 3"
                  fallbackText={movie.title}
                />
                <span className="search-result__info">
                  <span className="search-result__title">{movie.title}</span>
                  <span className="search-result__meta">
                    {movie.year} · {movie.genres.join(' / ')} · {movie.director}
                  </span>
                </span>
                <span className="search-result__score">{formatScore(movie.rating)}</span>
              </button>
            </li>
          ))}
        </ul>

        {!results.length ? <p className="search-overlay__empty">没有匹配的电影，换个关键词试试。</p> : null}

        <div className="search-overlay__foot">
          <button type="button" className="text-link" onClick={goToResults}>
            查看全部结果
          </button>
          <span className="search-overlay__hint">Esc 关闭</span>
        </div>
      </div>
    </div>
  );
}
