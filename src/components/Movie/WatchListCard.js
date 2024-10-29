/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useFirestore } from "../../firebase/FirebaseStore";
import { useAuth } from "../../context/useAuth";
import { Tooltip, OverlayTrigger } from "react-bootstrap";

const WatchListCard = ({ movie, setWatchlist }) => {
  const navigate = useNavigate();
  const { removeFromWatchlist } = useFirestore();
  const { user } = useAuth();

  const handleRemoveClick = (event) => {
    event.preventDefault(); // Prevent the default behavior (link redirection)
    removeFromWatchlist(user?.uid, movie.id).then(() => {
      setWatchlist((prev) => prev.filter((el) => el.id !== movie.id));
    });
  };

  return (
    <div className="w-100 d-flex">
      <div className="img-container">
        <img
          className="watchlist-poster"
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
              : ""
          }
          alt={movie.title}
        />
        <OverlayTrigger
          delay={{ hide: 450, show: 300 }}
          overlay={(props) => (
            <Tooltip {...props}>Remove from watchlist</Tooltip>
          )}
          placement="bottom"
        >
          <div className="remove-btn" onClick={handleRemoveClick}>
            X
          </div>
        </OverlayTrigger>
      </div>
      <div
        className="watchlist-info pl-3"
        onClick={() => navigate(`/movie/${movie.id}`)}
      >
        <h3>{movie.title}</h3>
        <p className="overview">{movie.overview}</p>
        <p>
          <strong>Release Date:</strong> {movie.release_date}
        </p>
        <p>
          <strong>Rating:</strong> {movie.vote_average} / 10
        </p>
        <p>
          <strong>Popularity:</strong> {movie.popularity}
        </p>
      </div>
    </div>
  );
};

export default WatchListCard;
