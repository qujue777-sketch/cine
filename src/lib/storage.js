export const STORAGE_KEYS = {
  library: 'cine.library.v1',
  theme: 'cine.theme.v1',
};

/** localStorage 在隐私模式 / 关闭存储时会抛错，这里统一兜底 */
export function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* 存储不可用时静默降级，页面依然可以正常使用 */
  }
}
