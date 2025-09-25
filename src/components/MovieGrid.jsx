import React from 'react';
import MovieCard from './MovieCard';

const MovieGrid = ({ movies, onMovieClick, onTrailerClick, loading }) => {
  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '4rem',
        color: 'white'
      }}>
        <div className="loading-spinner"></div>
        <h3 style={{ marginTop: '1rem' }}>Loading Awesome Movies...</h3>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '4rem',
        color: 'white'
      }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎬</div>
        <h3>No movies found</h3>
        <p>Try searching for different keywords or browse our featured collection</p>
      </div>
    );
  }

  return (
    <section style={{ padding: '2rem 0' }}>
      <div className="container">
        <h2 className="section-title fade-in-up">
          {movies.length} Amazing Tamil Movies
        </h2>
        <div className="movies-grid">
          {movies.map((movie, index) => (
            <div 
              key={movie.imdbID} 
              className="fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <MovieCard
                movie={movie}
                onClick={onMovieClick}
                onTrailerClick={onTrailerClick}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieGrid;