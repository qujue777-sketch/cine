import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import SearchOverlay from './SearchOverlay';
import { IconClose, IconMenu, IconMoon, IconSearch, IconSun } from './Icons';
import { NAV_LINKS } from '../data/constants';
import { useTheme } from '../context/ThemeProvider';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 路由变化时收起移动端菜单
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  return (
    <>
      <header className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="container navbar__inner">
          <Link className="brand" to="/" aria-label="CINÉ 首页">
            <span className="brand__mark">CINÉ</span>
            <span className="brand__dot" aria-hidden="true" />
          </Link>

          <nav className="navbar__nav" aria-label="主导航">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `navbar__link ${isActive ? 'is-active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar__actions">
            <button
              type="button"
              className="icon-btn icon-btn--ghost"
              onClick={() => setSearchOpen(true)}
              aria-label="打开搜索"
            >
              <IconSearch />
            </button>
            <button
              type="button"
              className="icon-btn icon-btn--ghost"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}
              title={theme === 'dark' ? '浅色模式' : '深色模式'}
            >
              {theme === 'dark' ? <IconSun /> : <IconMoon />}
            </button>
            <button
              type="button"
              className="icon-btn icon-btn--ghost navbar__menu-btn"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? 'is-open' : ''}`} hidden={!menuOpen}>
        <nav className="mobile-menu__nav" aria-label="移动端导航">
          {NAV_LINKS.map((link, index) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `mobile-menu__link ${isActive ? 'is-active' : ''}`}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <span>{link.label}</span>
              <span className="mobile-menu__index">0{index + 1}</span>
            </NavLink>
          ))}
        </nav>
        <p className="mobile-menu__foot">CINÉ · Discover your next favorite film.</p>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
