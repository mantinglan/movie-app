/* eslint-disable react/prop-types */
import "./MovieCard.css";

const MovieCard = ({ movie, clickFun }) => {
  return (
    <div
      className="movie-card image-container d-flex justify-content-start"
      onClick={() => clickFun(movie.id)}
    >
      {movie.poster_path ? (
        <img
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title}
        />
      ) : (
        <div className="no-poster">No Image Available</div>
      )}
      <div className="movie-card overlay d-flex align-items-center ">
        <span>{movie.title}</span>
      </div>
    </div>
  );
};

export default MovieCard;
