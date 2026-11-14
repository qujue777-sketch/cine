import { MOVIES } from './movies';

/**
 * 精选专题
 * filter 为纯函数，保证专题内电影与资料库永远一致；
 * 不写死电影数量，新增影片后专题自动扩充。
 */
export const TOPICS = [
  {
    key: 'sci-fi',
    title: '科幻电影',
    en: 'Science Fiction',
    desc: '向我们尚未抵达的地方提问。',
    backdrop: '/media/backdrops/dune-2.jpg',
    filter: (m) => m.genres.includes('科幻'),
  },
  {
    key: 'mystery',
    title: '悬疑推理',
    en: 'Mystery',
    desc: '真相，永远藏在下一帧。',
    backdrop: '/media/backdrops/se7en.jpg',
    filter: (m) => m.genres.includes('悬疑'),
  },
  {
    key: 'romance',
    title: '浪漫爱情',
    en: 'Romance',
    desc: '关于靠近，也关于错过。',
    backdrop: '/media/backdrops/mood-for-love.jpg',
    filter: (m) => m.genres.includes('爱情'),
  },
  {
    key: 'classic',
    title: '经典电影',
    en: 'Classics',
    desc: '时间替我们筛过的作品。',
    backdrop: '/media/backdrops/godfather.jpg',
    filter: (m) => m.year <= 1990,
  },
  {
    key: 'healing',
    title: '治愈电影',
    en: 'Slow Living',
    desc: '慢一点，先呼吸。',
    backdrop: '/media/backdrops/heidi.jpg',
    filter: (m) =>
      ['heidi', 'little-forest', 'soul', 'walter-mitty', 'before-sunrise', 'your-name', 'into-the-wild'].includes(
        m.id
      ),
  },
  {
    key: 'action',
    title: '动作冒险',
    en: 'Action & Adventure',
    desc: '肾上腺素，与远方。',
    backdrop: '/media/backdrops/fury-road.jpg',
    filter: (m) => m.genres.includes('动作') || m.genres.includes('冒险'),
  },
];
