import { useMemo, useState } from 'react';
import RankingList from '../components/RankingList';
import { useMovies } from '../context/MoviesProvider';
import { GENRES } from '../data/constants';

const TABS = [
  { key: 'trending', label: '全球热门', desc: '按站内热度排出的当下观看风向。' },
  { key: 'rating', label: '高分电影', desc: '编辑评分最高的十部，闭眼选不会错。' },
  { key: 'year', label: '年度电影', desc: '近五年上映作品中评分最高的一批。' },
  { key: 'genre', label: '类型排行榜', desc: '选一个类型，看这个赛道上最好的作品。' },
];

export default function Ranking() {
  const { movies } = useMovies();
  const [tab, setTab] = useState('trending');
  const [genre, setGenre] = useState('科幻');

  const activeTab = TABS.find((item) => item.key === tab) || TABS[0];

  const list = useMemo(() => {
    if (tab === 'trending') {
      return [...movies].sort((a, b) => b.popularity - a.popularity || b.rating - a.rating).slice(0, 10);
    }
    if (tab === 'rating') {
      return [...movies].sort((a, b) => b.rating - a.rating || b.year - a.year).slice(0, 10);
    }
    if (tab === 'year') {
      const latest = Math.max(...movies.map((movie) => movie.year));
      return movies
        .filter((movie) => movie.year >= latest - 4)
        .sort((a, b) => b.rating - a.rating || b.year - a.year)
        .slice(0, 12);
    }
    return movies
      .filter((movie) => movie.genres.includes(genre))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);
  }, [movies, tab, genre]);

  return (
    <div className="page ranking">
      <div className="container">
        <header className="page-head">
          <p className="eyebrow">Ranking</p>
          <h1>排行榜</h1>
          <p className="page-head__desc">四份不同的榜单，同一个目的：帮你少花时间挑片。</p>
        </header>

        <div className="tab-bar" role="tablist" aria-label="排行榜分类">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={tab === item.key}
              className={`tab ${tab === item.key ? 'is-active' : ''}`}
              onClick={() => setTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === 'genre' ? (
          <div className="chips chips--compact" role="group" aria-label="选择类型">
            {GENRES.map((item) => (
              <button
                key={item}
                type="button"
                className={`chip ${genre === item ? 'is-active' : ''}`}
                onClick={() => setGenre(item)}
                aria-pressed={genre === item}
              >
                {item}
              </button>
            ))}
          </div>
        ) : null}

        <div className="ranking__head">
          <p className="ranking__title">
            {tab === 'genre' ? `${genre}电影榜` : activeTab.label}
            <span className="ranking__count">{list.length} 部</span>
          </p>
          <p className="ranking__desc">{activeTab.desc}</p>
        </div>

        <RankingList movies={list} />

        <p className="ranking__note">
          榜单基于本站资料库与编辑评分生成，随资料库更新而变化，不代表任何第三方平台的实时数据。
        </p>
      </div>
    </div>
  );
}
