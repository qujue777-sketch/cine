import SearchBar from './SearchBar';
import { IconChevronDown, IconClose } from './Icons';
import { DECADES, GENRES, RATING_FILTERS, SORTS } from '../data/constants';

const SelectField = ({ label, value, onChange, options }) => (
  <label className="select-field">
    <span className="select-field__label">{label}</span>
    <span className="select-field__control">
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <IconChevronDown className="select-field__chevron" />
    </span>
  </label>
);

const COLLECTION_LABEL = {
  classic: '专题 · 经典电影（1990 年前）',
  healing: '专题 · 治愈电影',
};

/**
 * 发现页筛选面板：搜索 + 类型标签 + 年代 + 评分 + 排序
 * 全部条件可自由组合，任一条件变化都会即时筛选。
 */
export default function MovieFilter({
  filters,
  onChange,
  onReset,
  resultCount,
  totalCount,
  activeCount,
}) {
  return (
    <section className="filter-panel" aria-label="电影筛选">
      <div className="filter-panel__search">
        <SearchBar
          large
          value={filters.query}
          onChange={(value) => onChange({ query: value })}
          placeholder="搜索电影名称、导演、演员或年份"
        />
      </div>

      <div className="filter-panel__selects">
        <SelectField
          label="年代"
          value={filters.decade}
          onChange={(value) => onChange({ decade: value })}
          options={DECADES}
        />
        <SelectField
          label="评分"
          value={filters.minRating}
          onChange={(value) => onChange({ minRating: value })}
          options={RATING_FILTERS}
        />
        <SelectField
          label="排序"
          value={filters.sort}
          onChange={(value) => onChange({ sort: value })}
          options={SORTS}
        />
      </div>

      <div className="filter-panel__genres" role="group" aria-label="按类型筛选">
        <button
          type="button"
          className={`chip ${filters.genre === 'all' ? 'is-active' : ''}`}
          onClick={() => onChange({ genre: 'all' })}
        >
          全部类型
        </button>
        {GENRES.map((genre) => (
          <button
            key={genre}
            type="button"
            className={`chip ${filters.genre === genre ? 'is-active' : ''}`}
            onClick={() => onChange({ genre: genre === filters.genre ? 'all' : genre })}
            aria-pressed={filters.genre === genre}
          >
            {genre}
          </button>
        ))}
      </div>

      {filters.collection && COLLECTION_LABEL[filters.collection] ? (
        <div className="filter-panel__collection">
          <span>{COLLECTION_LABEL[filters.collection]}</span>
          <button type="button" onClick={() => onChange({ collection: null })} aria-label="取消专题筛选">
            <IconClose />
          </button>
        </div>
      ) : null}

      <div className="filter-panel__summary">
        <p>
          共 <strong>{resultCount}</strong> 部电影
          {resultCount !== totalCount ? <span className="muted">（资料库共 {totalCount} 部）</span> : null}
        </p>
        {activeCount > 0 ? (
          <button type="button" className="text-link text-link--quiet" onClick={onReset}>
            重置全部筛选
            <IconClose />
          </button>
        ) : null}
      </div>
    </section>
  );
}
