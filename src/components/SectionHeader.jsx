import { Link } from 'react-router-dom';
import { IconArrowRight } from './Icons';

/** 区块标题：左侧主标题 + 副标题，右侧「查看全部」 */
export default function SectionHeader({ eyebrow, title, description, to, linkLabel = '查看全部' }) {
  return (
    <header className="section-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="section-header__title">{title}</h2>
        {description ? <p className="section-header__desc">{description}</p> : null}
      </div>

      {to ? (
        <Link className="text-link" to={to}>
          {linkLabel}
          <IconArrowRight />
        </Link>
      ) : null}
    </header>
  );
}
