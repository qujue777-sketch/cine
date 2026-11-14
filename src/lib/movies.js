import { MOVIES } from '../data/movies';

export const SORT_HANDLERS = {
  recommended: (a, b) =>
    b.popularity - a.popularity || b.rating - a.rating || b.year - a.year,
  rating: (a, b) => b.rating - a.rating || b.popularity - a.popularity,
  newest: (a, b) => b.releaseDate.localeCompare(a.releaseDate),
  oldest: (a, b) => a.releaseDate.localeCompare(b.releaseDate),
};

const matchQuery = (movie, q) => {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const haystack = [
    movie.title,
    movie.originalTitle,
    movie.director,
    movie.genres.join(' '),
    movie.cast.join(' '),
    String(movie.year),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(needle);
};

/**
 * 组合筛选：关键词 + 类型 + 年代 + 最低评分 + 排序
 * 所有条件同时生效，任一为空即视为不限制。
 */
export function filterMovies(list, { query = '', genre = 'all', decade = 'all', minRating = 'all', sort = 'recommended' } = {}) {
  const threshold = minRating === 'all' ? 0 : Number(minRating);

  return list
    .filter((movie) => {
      if (genre !== 'all' && !movie.genres.includes(genre)) return false;
      if (decade !== 'all') {
        const start = Number(decade);
        if (movie.year < start || movie.year >= start + 10) return false;
      }
      if (threshold && movie.rating < threshold) return false;
      if (!matchQuery(movie, query)) return false;
      return true;
    })
    .sort(SORT_HANDLERS[sort] || SORT_HANDLERS.recommended);
}

export const getTrending = (list = MOVIES, limit = 12) =>
  [...list].sort(SORT_HANDLERS.recommended).slice(0, limit);

export const getTopRated = (list = MOVIES, limit = 12) =>
  [...list].sort(SORT_HANDLERS.rating).slice(0, limit);

/** 相似电影：类型重合度 > 同导演 > 评分，排除自身 */
export function getSimilar(movie, list = MOVIES, limit = 6) {
  if (!movie) return [];
  return list
    .filter((m) => m.id !== movie.id)
    .map((m) => {
      const shared = m.genres.filter((g) => movie.genres.includes(g)).length;
      const sameDirector = m.director && m.director === movie.director ? 2 : 0;
      return { movie: m, weight: shared * 2 + sameDirector + m.rating / 10 };
    })
    .filter((item) => item.weight > 0.8)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, limit)
    .map((item) => item.movie);
}

/** 取片库里影片数量最多的几个年份，用于「年度精选」 */
export function getFeaturedYears(list = MOVIES, limit = 6) {
  const counts = new Map();
  list.forEach((m) => counts.set(m.year, (counts.get(m.year) || 0) + 1));
  return [...counts.entries()]
    .filter(([, count]) => count >= 3)
    .sort((a, b) => b[0] - a[0])
    .slice(0, limit)
    .map(([year]) => year);
}

export const moviesByYear = (year, list = MOVIES) =>
  list
    .filter((m) => m.year === year)
    .sort((a, b) => b.rating - a.rating);
