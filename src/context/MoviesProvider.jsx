import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { MOVIES } from '../data/movies';
import { fetchTmdbMovies, tmdbEnabled } from '../lib/tmdb';

const MoviesContext = createContext(null);

/**
 * 数据源：本地资料库始终可用；配置了 TMDB Key 时再异步补充热门影片。
 * 无论远程数据是否成功，页面都不会卡住或空白。
 */
export function MoviesProvider({ children }) {
  const [movies, setMovies] = useState(MOVIES);
  const [source, setSource] = useState(tmdbEnabled ? 'loading' : 'local');
  const [remoteError, setRemoteError] = useState('');

  useEffect(() => {
    if (!tmdbEnabled) return undefined;
    let alive = true;

    fetchTmdbMovies(12)
      .then((extra) => {
        if (!alive) return;
        if (extra.length) {
          setMovies([...MOVIES, ...extra]);
          setSource('tmdb');
        } else {
          setSource('local');
        }
      })
      .catch((error) => {
        if (!alive) return;
        setRemoteError(error?.message || 'TMDB 数据暂不可用');
        setSource('local');
      });

    return () => {
      alive = false;
    };
  }, []);

  const value = useMemo(() => {
    const index = new Map(movies.map((movie) => [movie.id, movie]));
    return {
      movies,
      source,
      remoteError,
      getMovie: (id) => index.get(id) || null,
    };
  }, [movies, source, remoteError]);

  return <MoviesContext.Provider value={value}>{children}</MoviesContext.Provider>;
}

export const useMovies = () => {
  const ctx = useContext(MoviesContext);
  if (!ctx) throw new Error('useMovies 必须在 MoviesProvider 内部使用');
  return ctx;
};
