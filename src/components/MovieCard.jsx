import React, { useState } from 'react';

const MovieCard = ({ movie, onClick, onTrailerClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="movie-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(movie)}
    >
      {/* Featured Badge */}
      {movie.Featured && (
        <div className="movie-badge">⭐ Featured</div>
      )}
      
      {/* Poster Image */}
      <div className="poster-container">
        <img 
          src={movie.Poster}
          alt={movie.Title}
          className="movie-poster"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x400/333/fff?text=No+Image';
          }}
        />
        
        {/* Overlay with Trailer Button */}
        <div className={`poster-overlay ${isHovered ? 'visible' : ''}`}>
          <button 
            className="trailer-btn"
            onClick={(e) => {
              e.stopPropagation();
              onTrailerClick(movie);
            }}
          >
            ▶ Play Trailer
          </button>
        </div>

        {/* Rating */}
        <div className="movie-rating">
          ⭐ {movie.imdbRating}
        </div>
      </div>

      {/* Movie Info */}
      <div className="movie-info">
        <h3 className="movie-title">{movie.Title}</h3>
        <div className="movie-meta">
          <span>{movie.Year}</span>
          <span>{movie.Runtime}</span>
        </div>
        <p className="movie-plot">{movie.Plot}</p>
        <div className="movie-genres">
          {movie.Genre.split(',').slice(0, 2).map((genre, index) => (
            <span key={index} className="genre-tag">
              {genre.trim()}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        .poster-container {
          position: relative;
          overflow: hidden;
        }

        .poster-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            transparent 40%,
            rgba(0, 0, 0, 0.9) 100%
          );
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 2rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .poster-overlay.visible {
          opacity: 1;
        }

        .trailer-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .trailer-btn:hover {
          background: #ff0a14;
          transform: scale(1.05);
        }

        .movie-genres {
          display: flex;
          gap: 0.5rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }

        .genre-tag {
          background: rgba(255, 255, 255, 0.1);
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          color: var(--text-gray);
        }

        @media (max-width: 768px) {
          .poster-overlay {
            opacity: 1;
            background: linear-gradient(
              to bottom,
              transparent 60%,
              rgba(0, 0, 0, 0.9) 100%
            );
          }
        }
      `}</style>
    </div>
  );
};

export default MovieCard;