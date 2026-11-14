import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS, readStorage, writeStorage } from '../lib/storage';
import { useToast } from './ToastProvider';

const EMPTY_LIBRARY = { favorites: [], watchlist: [], watched: [], ratings: {} };

const LibraryContext = createContext(null);

/** 兼容旧数据 / 手工改坏的数据，避免整个页面白屏 */
function sanitize(raw) {
  const safe = { favorites: [], watchlist: [], watched: [], ratings: {} };
  if (!raw || typeof raw !== 'object') return safe;
  ['favorites', 'watchlist', 'watched'].forEach((key) => {
    if (Array.isArray(raw[key])) {
      safe[key] = [...new Set(raw[key].filter((id) => typeof id === 'string'))];
    }
  });
  if (raw.ratings && typeof raw.ratings === 'object') {
    Object.entries(raw.ratings).forEach(([id, value]) => {
      const score = Number(value);
      if (Number.isFinite(score) && score >= 1 && score <= 10) safe.ratings[id] = score;
    });
  }
  return safe;
}

export function LibraryProvider({ children }) {
  const { notify } = useToast();
  const [library, setLibrary] = useState(() => sanitize(readStorage(STORAGE_KEYS.library, EMPTY_LIBRARY)));

  // 任何一次操作都会写回 localStorage，刷新后依然保留
  useEffect(() => {
    writeStorage(STORAGE_KEYS.library, library);
  }, [library]);

  const toggleFavorite = useCallback(
    (id) => {
      const has = library.favorites.includes(id);
      setLibrary((prev) => ({
        ...prev,
        favorites: has ? prev.favorites.filter((item) => item !== id) : [...prev.favorites, id],
      }));
      notify(has ? '已从收藏中移除' : '已加入我的收藏');
    },
    [library.favorites, notify]
  );

  const toggleWatchlist = useCallback(
    (id) => {
      const has = library.watchlist.includes(id);
      setLibrary((prev) => ({
        ...prev,
        watchlist: has ? prev.watchlist.filter((item) => item !== id) : [...prev.watchlist, id],
      }));
      notify(has ? '已从想看中移除' : '已加入想看');
    },
    [library.watchlist, notify]
  );

  const toggleWatched = useCallback(
    (id) => {
      const has = library.watched.includes(id);
      setLibrary((prev) => ({
        ...prev,
        watched: has ? prev.watched.filter((item) => item !== id) : [...prev.watched, id],
      }));
      notify(has ? '已取消看过标记' : '已标记为看过');
    },
    [library.watched, notify]
  );

  const setRating = useCallback(
    (id, score) => {
      const current = library.ratings[id];
      setLibrary((prev) => {
        const ratings = { ...prev.ratings };
        if (current === score) {
          delete ratings[id];
          return { ...prev, ratings };
        }
        ratings[id] = score;
        const watched = prev.watched.includes(id) ? prev.watched : [...prev.watched, id];
        return { ...prev, ratings, watched };
      });
      if (current === score) notify('已取消评分');
      else notify(`已评分 ${score} / 10`);
    },
    [library.ratings, notify]
  );

  const clearRating = useCallback(
    (id) => {
      setLibrary((prev) => {
        const ratings = { ...prev.ratings };
        delete ratings[id];
        return { ...prev, ratings };
      });
      notify('已取消评分');
    },
    [notify]
  );

  const removeFrom = useCallback(
    (collection, id) => {
      setLibrary((prev) => ({
        ...prev,
        [collection]: Array.isArray(prev[collection])
          ? prev[collection].filter((item) => item !== id)
          : prev[collection],
      }));
      notify('已从片单中移除');
    },
    [notify]
  );

  const value = useMemo(() => {
    const favorites = new Set(library.favorites);
    const watchlist = new Set(library.watchlist);
    const watched = new Set(library.watched);
    return {
      favorites: library.favorites,
      watchlist: library.watchlist,
      watched: library.watched,
      ratings: library.ratings,
      stats: {
        favorites: library.favorites.length,
        watchlist: library.watchlist.length,
        watched: library.watched.length,
        ratings: Object.keys(library.ratings).length,
      },
      isFavorite: (id) => favorites.has(id),
      isWatchlisted: (id) => watchlist.has(id),
      isWatched: (id) => watched.has(id),
      myRating: (id) => library.ratings[id] || 0,
      toggleFavorite,
      toggleWatchlist,
      toggleWatched,
      setRating,
      clearRating,
      removeFrom,
    };
  }, [library, toggleFavorite, toggleWatchlist, toggleWatched, setRating, clearRating, removeFrom]);

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export const useLibrary = () => {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error('useLibrary 必须在 LibraryProvider 内部使用');
  return ctx;
};
