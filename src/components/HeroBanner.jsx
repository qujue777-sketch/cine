import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SmartImage from './SmartImage';
import { IconArrowRight, IconBookmark, IconChevronLeft, IconChevronRight, IconStar } from './Icons';
import { formatRuntime, formatScore } from '../lib/format';
import { useLibrary } from '../context/LibraryProvider';

const AUTOPLAY_MS = 7000;

/**
 * 首页主视觉轮播
 * - 每 7 秒自动切换，hover / 键盘聚焦时暂停
 * - 支持左右按钮与指示点手动切换，切换后重新计时
 * - 图片交叉淡入 + 缓慢推近，文案单独淡入
 */
export default function HeroBanner({ movies = [] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { isFavorite, toggleFavorite } = useLibrary();

  const count = movies.length;
  const active = movies[index] || movies[0];

  useEffect(() => {
    if (paused || count < 2) return undefined;
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % count), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [index, paused, count]);

  useEffect(() => {
    if (count > 0 && index > count - 1) setIndex(0);
  }, [count, index]);

  if (!active) return null;

  const go = (step) => setIndex((current) => (current + step + count) % count);
  const favorite = isFavorite(active.id);

  return (
    <section
      className="hero"
      aria-roledescription="轮播"
      aria-label="编辑精选电影"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="hero__viewport">
        <div className="hero__media">
          {movies.map((movie, i) => (
            <div key={movie.id} className={`hero__slide ${i === index ? 'is-active' : ''}`} aria-hidden={i !== index}>
              <SmartImage
                src={movie.backdrop}
                alt=""
                className="hero__image"
                priority={i === 0}
                fallbackText={movie.title}
              />
            </div>
          ))}
          <span className="hero__scrim" aria-hidden="true" />
        </div>

        <div className="hero__content" key={active.id}>
          <p className="hero__eyebrow">
            <span className="hero__eyebrow-dot" aria-hidden="true" />
            CINÉ 编辑精选 · {active.year}
          </p>
          <h1 className="hero__title">{active.title}</h1>
          <p className="hero__original">{active.originalTitle}</p>
          <p className="hero__desc">{active.overview}</p>

          <div className="hero__meta">
            <span className="hero__score">
              <IconStar />
              {formatScore(active.rating)}
            </span>
            <span>{active.year}</span>
            <span className="dot-sep" aria-hidden="true" />
            <span>{formatRuntime(active.runtime)}</span>
            <span className="dot-sep" aria-hidden="true" />
            <span>{active.genres.join(' / ')}</span>
          </div>

          <div className="hero__actions">
            <Link className="btn btn--light" to={`/movie/${active.id}`}>
              了解电影
              <IconArrowRight />
            </Link>
            <button
              type="button"
              className={`btn btn--outline-light ${favorite ? 'is-active' : ''}`}
              onClick={() => toggleFavorite(active.id)}
              aria-pressed={favorite}
            >
              <IconBookmark filled={favorite} />
              {favorite ? '已在片单' : '加入片单'}
            </button>
          </div>
        </div>

        {count > 1 ? (
          <>
            <div className="hero__arrows">
              <button type="button" className="hero__arrow" onClick={() => go(-1)} aria-label="上一部精选电影">
                <IconChevronLeft />
              </button>
              <button type="button" className="hero__arrow" onClick={() => go(1)} aria-label="下一部精选电影">
                <IconChevronRight />
              </button>
            </div>

            <div className="hero__dots" role="tablist" aria-label="精选电影切换">
              {movies.map((movie, i) => (
                <button
                  key={movie.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`第 ${i + 1} 部：${movie.title}`}
                  className={`hero__dot ${i === index ? 'is-active' : ''}`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className="hero-caption">
        <p className="eyebrow">Editor&rsquo;s Pick · 2026</p>
        <h2>每一帧，都是一个世界。</h2>
        <p>发现值得珍藏的电影，探索银幕背后的故事。</p>
      </div>
    </section>
  );
}
