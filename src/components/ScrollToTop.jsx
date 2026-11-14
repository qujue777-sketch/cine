import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** 路由切换后回到页面顶部（保留浏览器前进后退的滚动体验） */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}
