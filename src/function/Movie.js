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

// add adapter for data transformation
const movieDataAdapter = {
  adaptMovieList: (data) => {
    if (!data || !data.results || !Array.isArray(data.results)) {
      return {
        results: [],
        page: 1,
        total_pages: 1,
      };
    }
    return {
      results: data.results.map((movie) => ({
        id: movie?.id || 0,
        title: movie?.title || "Unknown Movie",
        poster_path: movie?.poster_path || null,
      })),
      page: data?.page || 1,
      total_pages: data?.total_pages || 1,
    };
  },

  adaptMovieDetail: (data) => {
    if (!data) {
      return {
        id: 0,
        title: "Unknown Movie",
        overview: "No description available",
        poster_path: null,
        genres: [],
        tagline: null,
        popularity: 0,
        vote_average: 0,
        release_date: null,
        reviews: {
          results: [],
        },
        credits: {
          cast: [],
        },
        videos: {
          results: [],
        },
      };
    }
    return {
      id: data?.id || 0,
      title: data?.title || "Unknown Movie",
      overview: data?.overview || "No description available",
      poster_path: data?.poster_path || null,
      genres: Array.isArray(data?.genres) ? data.genres : [],
      tagline: data?.tagline || null,
      popularity: data?.popularity || 0,
      vote_average: data?.vote_average || 0,
      release_date: data?.release_date || null,
      reviews: data?.reviews || { results: [] },
      credits: data?.credits || { cast: [] },
      videos: data?.videos || { results: [] },
    };
  },
};

const getNowPlayingMovies = (moviePage = 1, showAlert) =>
  TMDB_HTTP_REQUEST.get(ENDPOINTS.NOW_PLAYING_MOVIES, {
    params: {
      page: moviePage,
    },
  })
    .then((response) => movieDataAdapter.adaptMovieList(response.data))
    .catch((error) => {
      handleError(error, showAlert);
      return movieDataAdapter.adaptMovieList(null);
    });

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
  })
    .then((response) => movieDataAdapter.adaptMovieList(response.data))
    .catch((error) => {
      handleError(error, showAlert);
      return movieDataAdapter.adaptMovieList(null);
    });

const getAllGenres = (showAlert) =>
  TMDB_HTTP_REQUEST.get(ENDPOINTS.GENRES).catch((error) =>
    handleError(error, showAlert)
  );

const getPoster = (path) => `${TMDB_IMAGE_BASE_URL}/original${path}`;

const getMovieById = (movieId, append_to_response = "", showAlert) =>
  TMDB_HTTP_REQUEST.get(
    `${ENDPOINTS.MOVIE}/${movieId}`,
    append_to_response ? { params: { append_to_response } } : null
  )
    .then((response) => {
      console.log("response", response);
      return movieDataAdapter.adaptMovieDetail(response.data);
    })
    .catch((error) => {
      handleError(error, showAlert);
      return movieDataAdapter.adaptMovieDetail(null);
    });

const getVideo = (key) => `${YOUTUBE_BASE_URL}?v=${key}`;

const searchMovies = (movieQuery, moviePage = 1, showAlert) =>
  TMDB_HTTP_REQUEST.get(`/search/movie`, {
    params: {
      query: movieQuery,
      page: moviePage,
    },
  })
    .then((response) => movieDataAdapter.adaptMovieList(response.data))
    .catch((error) => {
      handleError(error, showAlert);
      return movieDataAdapter.adaptMovieList(null);
    });

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
