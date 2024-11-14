/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MovieCard from "../components/Movie/MovieCard";
import { getSortedgMovies } from "../function/Movie";
import PaginationComponent from "../components/Pagination";

const MovieList = () => {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [isLoading, setIsLoading] = useState(true);

  const onClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };
  useEffect(() => {
    setIsLoading(true);
    getSortedgMovies(activePage, sortBy)
      .then((response) => {
        if (response.results) {
          setMovies(response.results);
          setActivePage(response.page);
          setTotalPages(response.total_pages);
          console.log("inin", response);
        }
      })
      .catch((error) => {
        console.error("Error fetching now playing movies: ", error);
      })
      .finally(() => setIsLoading(false));
  }, [activePage, sortBy]);

  return (
    <div className="movie-list">
      <div className="d-flex align-items-baseline gap-4 my-4">
        <h2 className="h5 text-uppercase">Discover Movies</h2>
        <select
          className="form-control w-auto"
          onChange={(e) => {
            setActivePage(1);
            setSortBy(e.target.value);
          }}
        >
          <option value="popularity.desc">Popular</option>
          <option value="vote_average.desc&vote_count.gte=1000">
            Top Rated
          </option>
        </select>
      </div>
      <div className="movie-grid">
        {movies &&
          movies.map((movie, index) =>
            isLoading ? (
              <div
                className="skeleton"
                style={{ height: "300px" }}
                key={index}
              ></div>
            ) : (
              <MovieCard
                key={index}
                movie={movie}
                clickFun={onClick}
              ></MovieCard>
            )
          )}
      </div>
      <PaginationComponent
        activePage={activePage}
        totalPages={totalPages}
        setActivePage={setActivePage}
      />
    </div>
  );
};

export default MovieList;
