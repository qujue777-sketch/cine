/**
 * TMDB 可选数据源
 * ------------------------------------------------------------------
 * 只有在 .env 中配置了 VITE_TMDB_API_KEY 时才会启用；
 * 未配置或请求失败时，网站完全依赖 src/data/movies.js 中的本地资料库，
 * 功能不受任何影响。
 */
import { MOVIES } from '../data/movies';

const API_KEY = (import.meta.env.VITE_TMDB_API_KEY || '').trim();
const API_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';

export const tmdbEnabled = Boolean(API_KEY);

/** TMDB 的英文类型 -> 本站中文类型 */
const GENRE_MAP = {
  28: '动作',
  12: '冒险',
  16: '动画',
  35: '喜剧',
  80: '犯罪',
  18: '剧情',
  27: '恐怖',
  9648: '悬疑',
  10749: '爱情',
  878: '科幻',
};

const normalize = (text = '') => text.toLowerCase().replace(/[\s:：·,，.。'"!?！？-]/g, '');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function request(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${API_BASE}${path}`, { signal: controller.signal });
    if (!res.ok) throw new Error(`TMDB 请求失败：${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function mapMovie(raw) {
  const year = Number((raw.release_date || '').slice(0, 4));
  return {
    id: `tmdb-${raw.id}`,
    title: raw.title || raw.original_title || '未命名影片',
    originalTitle: raw.original_title || raw.title || '',
    year: Number.isFinite(year) ? year : 0,
    releaseDate: raw.release_date || '',
    runtime: 0,
    rating: Math.round((raw.vote_average || 0) * 10) / 10,
    genres: (raw.genre_ids || []).map((id) => GENRE_MAP[id]).filter(Boolean).slice(0, 3),
    director: '资料待补充',
    cast: [],
    country: '',
    tagline: '',
    overview: raw.overview || '这部影片暂时还没有中文简介。',
    poster: raw.poster_path ? `${IMG_BASE}/w500${raw.poster_path}` : '',
    backdrop: raw.backdrop_path ? `${IMG_BASE}/w1280${raw.backdrop_path}` : '',
    popularity: Math.round((raw.popularity || 0) / 10),
    source: 'tmdb',
  };
}

/**
 * 拉取 TMDB 热门电影，作为本地资料库的补充
 * @returns {Promise<Array>} 补充影片（已去重）
 */
export async function fetchTmdbMovies(limit = 12) {
  if (!tmdbEnabled) return [];

  const collected = [];
  for (const page of [1, 2]) {
    try {
      const data = await request(
        `/movie/popular?api_key=${encodeURIComponent(API_KEY)}&language=zh-CN&page=${page}`
      );
      collected.push(...(data.results || []));
    } catch (error) {
      if (page === 1) throw error;
      break;
    }
    await sleep(120);
  }

  const existingTitles = new Set(MOVIES.map((m) => normalize(m.originalTitle)));
  const seen = new Set();

  return collected
    .map(mapMovie)
    .filter((movie) => {
      const key = normalize(movie.originalTitle);
      if (!movie.poster || !key) return false;
      if (existingTitles.has(key) || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}
