import { useCallback, useEffect, useRef, useState } from 'react';
import MovieCard from './MovieCard';
import { IconChevronLeft, IconChevronRight } from './Icons';

/**
 * 横向电影滑动条
 * - 支持触摸滑动、鼠标滚轮横滑、左右按钮翻页
 * - 到达两端时自动隐藏对应按钮
 */
export default function MovieRow({ movies = [], ariaLabel = '电影列表' }) {
  const scrollerRef = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const syncEdges = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setEdges({
      left: el.scrollLeft > 8,
      right: el.scrollLeft < max - 8,
    });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return undefined;
    syncEdges();
    el.addEventListener('scroll', syncEdges, { passive: true });
    const observer = new ResizeObserver(syncEdges);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', syncEdges);
      observer.disconnect();
    };
  }, [movies.length, syncEdges]);

  const scrollByPage = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.max(el.clientWidth * 0.82, 260), behavior: 'smooth' });
  };

  return (
    <div className="movie-row">
      <div className="movie-row__scroller" ref={scrollerRef}>
        {movies.map((movie) => (
          <div className="movie-row__item" key={movie.id}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      <div className="movie-row__controls">
        <button
          type="button"
          className="icon-btn"
          onClick={() => scrollByPage(-1)}
          disabled={!edges.left}
          aria-label={`${ariaLabel}向前翻页`}
        >
          <IconChevronLeft />
        </button>
        <button
          type="button"
          className="icon-btn"
          onClick={() => scrollByPage(1)}
          disabled={!edges.right}
          aria-label={`${ariaLabel}向后翻页`}
        >
          <IconChevronRight />
        </button>
      </div>
    </div>
  );
}
