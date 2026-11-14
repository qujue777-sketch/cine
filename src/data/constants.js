/** 全站共用的筛选 / 排序 / 导航配置 */

export const GENRES = [
  '动作',
  '喜剧',
  '爱情',
  '科幻',
  '悬疑',
  '动画',
  '犯罪',
  '剧情',
  '冒险',
  '恐怖',
];

export const SORTS = [
  { value: 'recommended', label: '综合推荐' },
  { value: 'rating', label: '评分从高到低' },
  { value: 'newest', label: '上映年份从新到旧' },
  { value: 'oldest', label: '上映年份从旧到新' },
];

export const RATING_FILTERS = [
  { value: 'all', label: '全部评分' },
  { value: '9', label: '9 分以上' },
  { value: '8', label: '8 分以上' },
  { value: '7.5', label: '7.5 分以上' },
  { value: '7', label: '7 分以上' },
];

/** 年代筛选：按十年归档，兼容 1950 年前后的老片 */
export const DECADES = [
  { value: 'all', label: '全部年代' },
  { value: '2020', label: '2020 年代' },
  { value: '2010', label: '2010 年代' },
  { value: '2000', label: '2000 年代' },
  { value: '1990', label: '1990 年代' },
  { value: '1980', label: '1980 年代' },
  { value: '1950', label: '1950—1960' },
];

export const NAV_LINKS = [
  { to: '/', label: '首页', end: true },
  { to: '/discover', label: '发现电影' },
  { to: '/ranking', label: '排行榜' },
  { to: '/my-list', label: '我的片单' },
];

export const LIBRARY_TABS = [
  { key: 'favorites', label: '我的收藏', empty: '还没有收藏的电影，去发现一部属于你的作品。' },
  { key: 'watchlist', label: '想看的电影', empty: '把心动的片子放进「想看」，下次不用再找。' },
  { key: 'watched', label: '已看过的电影', empty: '标记看过的电影，慢慢攒成你自己的影史。' },
  { key: 'ratings', label: '我的评分', empty: '给看过的电影打个分，记录你与它的关系。' },
];

/** 详情页的评分文案 */
export const RATING_LABELS = [
  { min: 0, label: '尚未评分' },
  { min: 1, label: '不太合我口味' },
  { min: 3, label: '有些遗憾' },
  { min: 5, label: '尚可一看' },
  { min: 7, label: '值得一看' },
  { min: 8, label: '值得推荐' },
  { min: 9, label: '非常喜欢' },
  { min: 10, label: '影史级作品' },
];

/** 根据分数取对应的文字评价，全站共用一套标准 */
export const getRatingLabel = (score) => {
  if (!score) return RATING_LABELS[0].label;
  return RATING_LABELS.reduce((label, item) => (score >= item.min ? item.label : label), RATING_LABELS[0].label);
};
