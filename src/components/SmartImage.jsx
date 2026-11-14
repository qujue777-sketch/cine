import { useEffect, useState } from 'react';
import { IconFilm } from './Icons';

/**
 * 带骨架屏与兜底图的图片组件
 * - 加载中显示柔和 shimmer 骨架，避免大面积空白
 * - 加载失败时显示统一的占位卡（而不是浏览器破图）
 */
export default function SmartImage({
  src,
  alt = '',
  className = '',
  ratio,
  priority = false,
  fallbackText = 'CINÉ',
  children,
}) {
  const [status, setStatus] = useState(src ? 'loading' : 'error');

  useEffect(() => {
    setStatus(src ? 'loading' : 'error');
  }, [src]);

  return (
    <div
      className={`smart-image ${className}`}
      data-status={status}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
        />
      ) : null}

      {status === 'loading' ? <span className="smart-image__skeleton" aria-hidden="true" /> : null}

      {status === 'error' ? (
        <span className="smart-image__fallback" aria-hidden="true">
          <IconFilm />
          <span>{fallbackText}</span>
        </span>
      ) : null}

      {children}
    </div>
  );
}
