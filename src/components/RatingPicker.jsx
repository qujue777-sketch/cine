import { getRatingLabel } from '../data/constants';
import { IconClose } from './Icons';

/** 1—10 分评分器，点击同一分值可取消 */
export default function RatingPicker({ value = 0, onChange, onClear }) {
  return (
    <div className="rating-picker">
      <div className="rating-picker__buttons" role="group" aria-label="为这部电影打分">
        {Array.from({ length: 10 }).map((_, i) => {
          const score = i + 1;
          const active = score <= value;
          return (
            <button
              key={score}
              type="button"
              className={`rating-picker__btn ${active ? 'is-active' : ''} ${score === value ? 'is-current' : ''}`}
              aria-label={`${score} 分`}
              aria-pressed={score === value}
              onClick={() => onChange(score)}
            >
              {score}
            </button>
          );
        })}
      </div>

      <div className="rating-picker__readout">
        <p>
          {value ? (
            <>
              你的评分 <strong>{value}</strong> / 10 · {getRatingLabel(value)}
            </>
          ) : (
            '还没有评分，给出 1—10 分记录你的感受'
          )}
        </p>
        {value ? (
          <button type="button" className="text-link text-link--quiet" onClick={onClear}>
            清除评分
            <IconClose />
          </button>
        ) : null}
      </div>
    </div>
  );
}
