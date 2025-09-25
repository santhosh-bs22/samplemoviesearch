import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActiveLink = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <Link to="/" className="logo" onClick={closeMenu}>
            <div className="logo-icon">🎬</div>
            <div className="logo-text">MovieHub</div>
          </Link>
          
          <button 
            className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
            <ul className="nav-list">
              <li>
                <Link to="/" className={isActiveLink('/')} onClick={closeMenu}>
                  🏠 Home
                </Link>
              </li>
              <li>
                <Link to="/movies" className={isActiveLink('/movies')} onClick={closeMenu}>
                  🎬 Movies
                </Link>
              </li>
              <li>
                <a href="#trending" className="nav-link" onClick={closeMenu}>
                  🔥 Trending
                </a>
              </li>
              <li>
                <a href="#featured" className="nav-link" onClick={closeMenu}>
                  ⭐ Featured
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`nav-overlay ${isMenuOpen ? 'active' : ''}`}
        onClick={closeMenu}
      />
      
      <style jsx>{`
        .menu-toggle {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 30px;
          height: 21px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 1001;
        }

        .menu-toggle span {
          display: block;
          height: 3px;
          width: 100%;
          background-color: var(--text-light);
          border-radius: 3px;
          transition: all 0.3s ease;
        }

        @media (max-width: 768px) {
          .menu-toggle {
            display: flex;
          }
          
          .nav {
            position: fixed;
            top: 0;
            right: -100%;
            width: 280px;
            height: 100vh;
            background: var(--darker);
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            padding: 80px 30px 30px;
            transition: right 0.3s ease;
            z-index: 999;
            border-left: 2px solid var(--primary);
          }
          
          .nav.active {
            right: 0;
          }
          
          .nav-list {
            flex-direction: column;
            gap: 0;
            width: 100%;
          }
          
          .nav-list li {
            width: 100%;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .nav-link {
            display: block;
            padding: 1.2rem 0;
            font-size: 1.1rem;
            border-radius: 0;
            border: none;
          }
          
          .nav-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.7);
            z-index: 998;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
          }
          
          .nav-overlay.active {
            opacity: 1;
            visibility: visible;
          }
          
          .menu-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(6px, 6px);
          }
          
          .menu-toggle.active span:nth-child(2) {
            opacity: 0;
          }
          
          .menu-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(6px, -6px);
          }
        }
      `}</style>
    </>
  );
};

export default Header;