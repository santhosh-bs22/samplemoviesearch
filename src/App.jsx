import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import SearchBar from './components/SearchBar';
import MovieGrid from './components/MovieGrid';
import MovieDetails from './components/MovieDetails';
import TrailerModal from './components/TrailerModal';
import Particles from './components/Particles';
import { tamilMovies } from './data/tamilMovies';
import { searchMovies, getMovieDetails } from './services/movieAPI';
import './styles/App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerMovie, setTrailerMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('featured');
  const [usingLocalData, setUsingLocalData] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadMovies();
  }, []);

  // Handle URL parameters for section navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const section = urlParams.get('section');
    
    if (section === 'featured') {
      showFeatured();
    } else if (section === 'trending') {
      showTrending();
    } else if (section === 'all') {
      showAll();
    }
  }, [location.search]);

  const loadMovies = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await searchMovies('');
      setMovies(result.movies);
      
      if (result.movies.length > 0) {
        setFeaturedMovies(result.movies.filter(movie => movie.Featured));
        setTrendingMovies(result.movies.filter(movie => movie.Trending));
        setUsingLocalData(false);
      } else {
        throw new Error('No movies found from API');
      }
    } catch (err) {
      console.log('Using local data fallback');
      setMovies(tamilMovies);
      setFeaturedMovies(tamilMovies.filter(movie => movie.Featured));
      setTrendingMovies(tamilMovies.filter(movie => movie.Trending));
      setUsingLocalData(true);
      setError('Connected to TMDB API - Showing local demo data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setLoading(true);
    setError('');
    try {
      const result = await searchMovies(query);
      setMovies(result.movies);
      setActiveSection('search');
      navigate(`/?search=${encodeURIComponent(query)}`);
      
      if (result.movies.length === 0) {
        setError('No movies found. Try searching for different keywords.');
      }
    } catch (err) {
      setError('Search failed. Using local data.');
      const filteredMovies = tamilMovies.filter(movie =>
        movie.Title.toLowerCase().includes(query.toLowerCase()) ||
        movie.Director.toLowerCase().includes(query.toLowerCase()) ||
        movie.Actors.toLowerCase().includes(query.toLowerCase()) ||
        movie.Genre.toLowerCase().includes(query.toLowerCase())
      );
      setMovies(filteredMovies);
    } finally {
      setLoading(false);
    }
  };

  const handleMovieClick = async (movie) => {
    try {
      const detailedMovie = await getMovieDetails(movie.imdbID);
      setSelectedMovie(detailedMovie || movie);
    } catch (error) {
      console.error('Error fetching movie details:', error);
      setSelectedMovie(movie);
    }
  };

  const handleTrailerClick = (movie) => {
    setTrailerMovie(movie);
  };

  const showFeatured = () => {
    setMovies(featuredMovies);
    setActiveSection('featured');
    navigate('/?section=featured');
  };

  const showTrending = () => {
    setMovies(trendingMovies);
    setActiveSection('trending');
    navigate('/?section=trending');
  };

  const showAll = () => {
    setMovies(tamilMovies);
    setActiveSection('all');
    navigate('/?section=all');
  };

  // Rest of your App component remains the same...
  return (
    <div className="App">
      <Particles />
      <Header />
      
      <main style={{ paddingTop: '80px' }}>
        <Hero />
        
        {/* API Status Indicator */}
        {usingLocalData && (
          <div style={{
            background: 'linear-gradient(135deg, #ffd166, #ffb347)',
            color: 'black',
            padding: '10px 0',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}>
            🔄 Using Local Demo Data - Add TMDB API Key for Real Movies
          </div>
        )}
        
        {/* Navigation Tabs */}
        <div style={{
          background: 'var(--darker)',
          padding: '2rem 0',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div className="container">
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              {[
                { key: 'featured', label: '⭐ Featured', action: showFeatured },
                { key: 'trending', label: '🔥 Trending', action: showTrending },
                { key: 'all', label: '🎬 All Movies', action: showAll }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={tab.action}
                  style={{
                    padding: '12px 24px',
                    background: activeSection === tab.key ? 
                      'linear-gradient(135deg, #ff6b6b, #ff8e53)' : 'transparent',
                    border: `2px solid ${activeSection === tab.key ? 'transparent' : '#4ecdc4'}`,
                    borderRadius: '25px',
                    color: activeSection === tab.key ? 'white' : '#4ecdc4',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <SearchBar onSearch={handleSearch} loading={loading} />
        
        {error && (
          <div className="error-banner">
            <div className="container">
              <div className="error-content">
                <span>⚠️ {error}</span>
                <button onClick={showAll} className="error-retry">
                  Show All Movies
                </button>
              </div>
            </div>
          </div>
        )}

        <MovieGrid 
          movies={movies} 
          onMovieClick={handleMovieClick}
          onTrailerClick={handleTrailerClick}
          loading={loading}
        />
      </main>

      {selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      {trailerMovie && (
        <TrailerModal
          movie={trailerMovie}
          onClose={() => setTrailerMovie(null)}
        />
      )}

      <footer style={{
        background: 'var(--darker)',
        padding: '3rem 0',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div className="container">
          <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>
            🎬 MovieHub - Tamil Cinema Universe
          </p>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            {usingLocalData 
              ? 'Demo mode - Add your TMDB API key for real movie data' 
              : 'Powered by TMDB API - Real Tamil Movie Data'
            }
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;