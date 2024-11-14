import PropTypes from "prop-types";
import WatchlistButton from "./WatchlistButton";
import { TMDB_IMAGE_BASE_URL } from "../../constants/Urls";
import { LazyLoadImage } from "react-lazy-load-image-component";
function MovieHeader({
  movie,
  isInWatchlist,
  onAddToWatchlist,
  onRemoveFromWatchlist,
}) {
  return (
    <div className="movie-header">
      <LazyLoadImage
        className="movie-poster"
        src={`${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`}
        alt={movie.title}
        effect="blur"
        placeholderSrc="/placeholder-poster.jpg"
      />
      <div className="movie-info">
        <div className="movie-info-header">
          <h1 className="movie-title">{movie.title}</h1>
          {movie.tagline && <p className="tagline">{movie.tagline}</p>}
          <WatchlistButton
            isInWatchlist={isInWatchlist}
            onAdd={onAddToWatchlist}
            onRemove={onRemoveFromWatchlist}
          />
        </div>

        <div className="movie-info-body">
          <p className="overview">{movie.overview}</p>

          <div className="genres">
            {movie.genres?.map((genre) => (
              <span key={genre.id} className="genre-tag">
                {genre.name}
              </span>
            ))}
          </div>

          <div className="movie-meta">
            <div className="meta-item">
              <span className="meta-label">Release date:</span>
              <span className="meta-value">{movie.release_date}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Rating:</span>
              <span className="meta-value">
                {movie.vote_average.toFixed(1)}/10
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Popularity:</span>
              <span className="meta-value">{movie.popularity.toFixed(0)}</span>
            </div>
            {movie.homepage && (
              <a
                className="homepage-link"
                href={movie.homepage}
                target="_blank"
                rel="noopener noreferrer"
              >
                Homepage
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieHeader;

MovieHeader.propTypes = {
  movie: PropTypes.object.isRequired,
  isInWatchlist: PropTypes.bool.isRequired,
  onAddToWatchlist: PropTypes.func.isRequired,
  onRemoveFromWatchlist: PropTypes.func.isRequired,
};
