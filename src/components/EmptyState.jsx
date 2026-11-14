import { Link } from 'react-router-dom';
import { IconArrowRight, IconFilm } from './Icons';

export default function EmptyState({ title, description, actionLabel, to, onAction }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon">
        <IconFilm />
      </span>
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {to ? (
        <Link className="btn btn--ghost" to={to}>
          {actionLabel}
          <IconArrowRight />
        </Link>
      ) : null}
      {onAction ? (
        <button type="button" className="btn btn--ghost" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
