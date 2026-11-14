/** 展示层格式化工具 */

export const formatScore = (score) =>
  typeof score === 'number' && Number.isFinite(score) ? score.toFixed(1) : '—';

export function formatRuntime(minutes) {
  if (!minutes) return '时长未知';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m} 分钟`;
  return m ? `${h} 小时 ${m} 分` : `${h} 小时`;
}

/** 手动拆分字符串，避免 new Date 带来的时区偏移 */
export function formatDate(iso) {
  if (!iso) return '上映日期未知';
  const [y, m, d] = iso.split('-');
  if (!y) return iso;
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`;
}

export { getRatingLabel as rateLabel } from '../data/constants';
