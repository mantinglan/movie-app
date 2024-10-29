import axios from "axios";
import {
  TMDB_BASE_URL,
  TMDB_IMAGE_BASE_URL,
  TMDB_API_KEY,
  ENDPOINTS,
  YOUTUBE_BASE_URL,
} from "../constants/Urls";

const TMDB_HTTP_REQUEST = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

const handleError = (error, showAlert) => {
  console.error("API call failed: ", error);
  if (showAlert) {
    showAlert({
      message: "Something went wrong. Please try again later.",
      type: "danger",
    });
  } else {
    alert("Something went wrong. Please try again later.");
  }
};

const getNowPlayingMovies = (moviePage = 1, showAlert) =>
  TMDB_HTTP_REQUEST.get(ENDPOINTS.NOW_PLAYING_MOVIES, {
    params: {
      page: moviePage,
    },
  }).catch((error) => handleError(error, showAlert));

const getUpComingMovies = (moviePage = 1, showAlert) =>
  TMDB_HTTP_REQUEST.get(ENDPOINTS.UPCOMING_MOVIES, {
    params: {
      page: moviePage,
    },
  }).catch((error) => handleError(error, showAlert));

const getSortedgMovies = (
  moviePage = 1,
  sortBy = "popularity.desc",
  showAlert
) =>
  TMDB_HTTP_REQUEST.get(ENDPOINTS.DISCOVER, {
    params: {
      page: moviePage,
      sort_by: sortBy,
    },
  }).catch((error) => handleError(error, showAlert));

const getAllGenres = (showAlert) =>
  TMDB_HTTP_REQUEST.get(ENDPOINTS.GENRES).catch((error) =>
    handleError(error, showAlert)
  );

const getPoster = (path) => `${TMDB_IMAGE_BASE_URL}/original${path}`;

const getMovieById = (movieId, append_to_response = "", showAlert) =>
  TMDB_HTTP_REQUEST.get(
    `${ENDPOINTS.MOVIE}/${movieId}`,
    append_to_response ? { params: { append_to_response } } : null
  ).catch((error) => handleError(error, showAlert));

const getVideo = (key) => `${YOUTUBE_BASE_URL}?v=${key}`;

const searchMovies = (movieQuery, moviePage = 1, showAlert) =>
  TMDB_HTTP_REQUEST.get(`/search/movie`, {
    params: {
      query: movieQuery,
      page: moviePage,
    },
  }).catch((error) => handleError(error, showAlert));

export {
  getNowPlayingMovies,
  getUpComingMovies,
  getSortedgMovies,
  getAllGenres,
  getPoster,
  getMovieById,
  getVideo,
  searchMovies,
};
