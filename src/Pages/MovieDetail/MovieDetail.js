import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieById } from "../../function/Movie";
import { APPEND_TO_RESPONSE as AR } from "../../constants/Urls";
import "./MovieDetail.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useAuth } from "../../context/authProvider";
import { useAlert } from "../../context/alertProvider";
import { useFirestore } from "../../firebase/FirebaseStore";
import MovieHeader from "../../components/MovieDetail/MovieHeader";
import MovieTrailer from "../../components/MovieDetail/MovieTrailer";
import MovieCast from "../../components/MovieDetail/MovieCast";
import MovieReviews from "../../components/MovieDetail/MovieReviews";
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
        console.log("movieResponse", movieResponse);
        setMovie(movieResponse);
        setCast(movieResponse.credits.cast.slice(0, 6));
        setReviews(movieResponse.reviews.results); // 設置評論
        const trailers = movieResponse.videos.results.filter(
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
    console.log("in handleAddtoWatchList");
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
      <MovieHeader
        movie={movie}
        isInWatchlist={isInWatchlist}
        onAddToWatchlist={handleAddtoWatchList}
        onRemoveFromWatchlist={handleRemoveFromWatchlist}
      />

      <MovieTrailer trailer={trailer} />

      <MovieCast cast={cast} />

      <MovieReviews reviews={reviews} />
    </div>
  );
};

export default MovieDetail;
