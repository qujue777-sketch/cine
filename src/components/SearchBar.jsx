import { useRef } from 'react';
import { IconClose, IconSearch } from './Icons';

export default function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = '搜索电影、导演或演员',
  autoFocus = false,
  large = false,
}) {
  const inputRef = useRef(null);

  return (
    <form
      className={`searchbar ${large ? 'searchbar--large' : ''}`}
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.(value);
      }}
    >
      <IconSearch className="searchbar__icon" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        autoFocus={autoFocus}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="搜索电影"
        enterKeyHint="search"
      />
      {value ? (
        <button
          type="button"
          className="searchbar__clear"
          aria-label="清除搜索内容"
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
        >
          <IconClose />
        </button>
      ) : null}
    </form>
  );
}
