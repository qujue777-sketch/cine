import { useMemo, useState } from 'react';
import HeroBanner from '../components/HeroBanner';
import SectionHeader from '../components/SectionHeader';
import MovieRow from '../components/MovieRow';
import MovieGrid from '../components/MovieGrid';
import GenreSection from '../components/GenreSection';
import { useMovies } from '../context/MoviesProvider';
import { getFeaturedYears, getTopRated, getTrending, moviesByYear } from '../lib/movies';
import { useLibrary } from '../context/LibraryProvider';

export default function Home() {
  const { movies } = useMovies();
  const { favorites } = useLibrary();
  const [pickedYear, setPickedYear] = useState(null);

  const featured = useMemo(() => {
    const list = movies.filter((movie) => movie.featured);
    return list.length >= 3 ? list : getTopRated(movies, 5);
  }, [movies]);

  const trending = useMemo(() => getTrending(movies, 12), [movies]);
  const topRated = useMemo(() => getTopRated(movies, 12), [movies]);
  const years = useMemo(() => getFeaturedYears(movies, 5), [movies]);
  const activeYear = pickedYear && years.includes(pickedYear) ? pickedYear : years[0];
  const yearMovies = useMemo(() => moviesByYear(activeYear, movies), [activeYear, movies]);

  return (
    <div className="page home">
      <div className="container">
        <HeroBanner movies={featured} />

        <section className="section">
          <SectionHeader
            eyebrow="Now Trending"
            title="正在热门"
            description="这个周末，大家都在看什么。"
            to="/discover?sort=recommended"
            linkLabel="全部热门"
          />
          <MovieRow movies={trending} ariaLabel="热门电影" />
        </section>

        <section className="section">
          <SectionHeader
            eyebrow="Top Rated"
            title="高分电影"
            description="从资料库里挑出评分最高的一批，随时可以开始。"
            to="/discover?sort=rating"
            linkLabel="查看更多"
          />
          <MovieGrid movies={topRated.slice(0, 12)} skeletonCount={12} />
        </section>

        <section className="section">
          <SectionHeader
            eyebrow="Curated"
            title="精选专题"
            description="按类型和情绪，挑一条今晚的观影路线。"
          />
          <GenreSection movies={movies} />
        </section>

        <section className="section year-section">
          <div className="year-section__aside">
            <p className="eyebrow">By Year</p>
            <h2 className="section-header__title">年度精选</h2>
            <p className="section-header__desc">按年份回看，每一年都有它的代表作。</p>

            <div className="year-tabs" role="tablist" aria-label="选择年份">
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  role="tab"
                  aria-selected={year === activeYear}
                  className={`year-tab ${year === activeYear ? 'is-active' : ''}`}
                  onClick={() => setPickedYear(year)}
                >
                  <span>{year}</span>
                  <span className="year-tab__count">{moviesByYear(year, movies).length} 部</span>
                </button>
              ))}
            </div>

            <p className="year-section__note">
              共收藏 {favorites.length} 部影片 · 资料全部保存在本地浏览器
            </p>
          </div>

          <div className="year-section__grid">
            <MovieGrid movies={yearMovies} skeletonCount={4} />
          </div>
        </section>
      </div>
    </div>
  );
}
