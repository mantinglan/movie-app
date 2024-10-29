/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { searchMovies } from "../function/Movie";
import sortOptions from "../constants/optionConst.js";
import MovieCard from "../components/Movie/MovieCard";

const SearchResult = () => {
  const [searchValue, setSearchValue] = useState("");
  const [tempSearchValue, setTempSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState("release_date");

  useEffect(() => {
    if (searchValue) {
      setIsLoading(true);
      searchMovies(searchValue, page)
        .then((res) => {
          if (page === 1) {
            setMovies(res.data.results);
          } else {
            setMovies((prevMovies) => [...prevMovies, ...res.data.results]);
          }
          setHasMore(page < res.data.total_pages);
        })
        .catch((err) => console.log(err, "err"))
        .finally(() => setIsLoading(false));
    }
  }, [searchValue, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearchValue(tempSearchValue);
  };

  const onClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 500 &&
      !isLoading &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedMovies = movies.sort((a, b) => {
    const sortKey = sortOptions.find(
      (option) => option.value === sortOption
    )?.key;
    if (sortKey === "release_date") {
      return new Date(b.release_date) - new Date(a.release_date);
    }
    return b[sortKey] - a[sortKey];
  });

  return (
    <div className="movie-list">
      <div className="d-flex align-items-baseline gap-4 my-4">
        <h2 className="h5 text-uppercase">Search</h2>
      </div>

      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Enter to Search movies..."
          value={tempSearchValue}
          onChange={(e) => setTempSearchValue(e.target.value)}
        />
      </form>

      <div className="sort-options mb-1">
        <label htmlFor="sort">Sort By: </label>
        <select id="sort" value={sortOption} onChange={handleSortChange}>
          {sortOptions.map((option) => (
            <option key={option.key} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      </div>
      {isLoading && page === 1 && (
        <div className="d-flex justify-content-center mt-4">
          <div className="spinner-border text-danger" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {sortedMovies?.length === 0 && !isLoading && (
        <h3 className="text-center mt-4">No results found</h3>
      )}

      <div className="movie-grid">
        {sortedMovies?.length > 0 &&
          sortedMovies.map((item, i) => (
            <MovieCard key={i} movie={item} clickFun={onClick}></MovieCard>
          ))}
      </div>

      {isLoading && page > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <div className="spinner-border text-danger" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResult;
