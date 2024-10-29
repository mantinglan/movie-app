import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieById } from "../../function/Movie";
import { APPEND_TO_RESPONSE as AR } from "../../constants/Urls";
import "./MovieDetail.css"; // 確保你有CSS文件來處理佈局和樣式
import { LazyLoadImage } from "react-lazy-load-image-component"; // Lazy Load Image component
import "react-lazy-load-image-component/src/effects/blur.css"; // 引入圖片模糊效果
import { useAuth } from "../../context/useAuth";
import { useFirestore } from "../../firebase/FirebaseStore";
import { TMDB_IMAGE_BASE_URL } from "../../constants/Urls";
import { useAlert } from "../../context/alertProvider";

const MovieDetail = () => {
  const { movie_id } = useParams();
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const { user } = useAuth();
  const { addToWatchlist, checkIfInWatchlist, removeFromWatchlist } =
    useFirestore();
  const { showAlert } = useAlert();

  useEffect(() => {
    getMovieById(movie_id, `${AR.CREDITS},${AR.REVIEWS},${AR.VIDEOS}`).then(
      (movieResponse) => {
        setMovie(movieResponse.data);
        setCast(movieResponse.data.credits.cast.slice(0, 6));
        setReviews(movieResponse.data.reviews.results); // 設置評論
        const trailers = movieResponse.data.videos.results.filter(
          (video) => video.type === "Trailer"
        );
        if (trailers.length > 0) {
          setTrailer(trailers[0].key); // 儲存預告片的YouTube Key
        }
      }
    );
  }, [movie_id]);

  useEffect(() => {
    if (movie) {
      const savedWatchlist = localStorage.getItem("watchlist");
      const watchlist = savedWatchlist ? JSON.parse(savedWatchlist) : [];
      setIsInWatchlist(watchlist.some((item) => item.id === movie.id));
    }
  }, [movie]);

  useEffect(() => {
    if (!user) {
      setIsInWatchlist(false);
      return;
    }

    checkIfInWatchlist(user?.uid, movie_id).then((data) => {
      setIsInWatchlist(data);
    });
  }, [movie_id, user, checkIfInWatchlist]);

  const handleAddtoWatchList = async () => {
    if (!user) {
      showAlert({
        message: "Login to add to watchlist",
        type: "info",
      });
      return;
    }
    const data = {
      id: movie?.id,
      title: movie?.title || movie?.name,
      poster_path: movie?.poster_path,
      release_date: movie?.release_date || movie?.first_air_date,
      vote_average: movie?.vote_average,
      popularity: movie?.popularity,
      overview: movie?.overview,
    };
    const dataId = movie?.id?.toString();
    await addToWatchlist(user?.uid, dataId, data);
    const isSetToWatchlist = await checkIfInWatchlist(user?.uid, dataId);
    setIsInWatchlist(isSetToWatchlist);
  };
  const handleRemoveFromWatchlist = async () => {
    await removeFromWatchlist(user?.uid, movie_id);
    const isSetToWatchlist = await checkIfInWatchlist(user?.uid, movie_id);
    setIsInWatchlist(isSetToWatchlist);
  };

  if (!movie) {
    return <p>Loading movie details...</p>;
  }

  return (
    <div className="movie-detail-page">
      <div className="movie-header">
        <img
          className="movie-poster"
          src={`${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <div className="movie-info">
          <h1>{movie.title}</h1>
          <p className="tagline">{movie.tagline}</p>
          {isInWatchlist ? (
            <button
              className="remove-from-watchlist-btn watchlist-btn "
              onClick={handleRemoveFromWatchlist}
            >
              - Remove from Watchlist
            </button>
          ) : (
            <button
              className="add-to-watchlist-btn watchlist-btn"
              onClick={handleAddtoWatchList}
            >
              + Add to Watchlist
            </button>
          )}
          <p className="overview">{movie.overview}</p>
          <div className="genres">
            {movie.genres.map((genre) => (
              <span key={genre.id} className="genre-tag">
                {genre.name}
              </span>
            ))}
          </div>
          <div className="movie-meta">
            <p>
              <strong>Release date:</strong> {movie.release_date}
            </p>
            <p>
              <strong>Rating:</strong> {movie.vote_average}/10
            </p>
            <p>
              <strong>Popularity:</strong> {movie.popularity.toFixed(2)}
            </p>
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

      {trailer && (
        <div className="movie-trailer">
          <h2>Trailer</h2>
          <iframe
            title="trailer"
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/${trailer}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}

      <div className="cast-section">
        <h2>Cast</h2>
        <div className="cast-list">
          {cast.map((actor) => (
            <div key={actor.id} className="cast-card">
              <LazyLoadImage
                src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                alt={actor.name}
                effect="blur" // 懶加載並在圖片加載時顯示模糊效果
                placeholderSrc={"/path-to-placeholder-image.jpg"} // 替代圖片URL
              />
              <p>
                <strong>{actor.name}</strong>
              </p>
              <p>as {actor.character}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="reviews-section">
        <h2>Reviews</h2>
        {reviews.length > 0 ? (
          <ul className="reviews-list">
            {reviews.map((review) => (
              <li key={review.id} className="review-item">
                <strong>{review.author}</strong>
                <p>{review.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;
