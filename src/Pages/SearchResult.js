/* eslint-disable react/prop-types */
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { searchMovies } from "../function/Movie";
import sortOptions from "../constants/optionConst.js";
import MovieCard from "../components/Movie/MovieCard";
import debounce from "lodash.debounce";

const LoadingSpinner = () => (
  <div className="d-flex justify-content-center mt-4">
    <div className="spinner-border text-danger" role="status">
      <span className="sr-only">Loading...</span>
    </div>
  </div>
);

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
    const fetchMovies = async () => {
      if (!searchValue) return;

      try {
        setIsLoading(true);
        const res = await searchMovies(searchValue, page);

        setMovies((prevMovies) =>
          page === 1 ? res.data.results : [...prevMovies, ...res.data.results]
        );

        setHasMore(page < res.data.total_pages);
      } catch (err) {
        console.error("搜尋電影時發生錯誤:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [searchValue, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!tempSearchValue.trim()) return;
    setPage(1);
    setSearchValue(tempSearchValue);
  };

  const onClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const handleScroll = () => {
    const scrollPosition =
      window.innerHeight + document.documentElement.scrollTop;
    const threshold = document.documentElement.offsetHeight - 500;

    if (scrollPosition >= threshold && !isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const debouncedScroll = debounce(handleScroll, 200);
    window.addEventListener("scroll", debouncedScroll);

    return () => {
      window.removeEventListener("scroll", debouncedScroll);
    };
  }, [isLoading, hasMore]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedMovies = useMemo(() => {
    return [...movies].sort((a, b) => {
      const sortKey = sortOptions.find(
        (option) => option.value === sortOption
      )?.key;

      if (sortKey === "release_date") {
        return new Date(b.release_date) - new Date(a.release_date);
      }
      return b[sortKey] - a[sortKey];
    });
  }, [movies, sortOption]);

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
      {isLoading && page === 1 && <LoadingSpinner />}

      {sortedMovies?.length === 0 && !isLoading && (
        <h3 className="text-center mt-4">No results found</h3>
      )}

      <div className="movie-grid">
        {sortedMovies?.length > 0 &&
          sortedMovies.map((item, i) => (
            <MovieCard key={i} movie={item} clickFun={onClick}></MovieCard>
          ))}
      </div>

      {isLoading && page > 1 && <LoadingSpinner />}
    </div>
  );
};

export default SearchResult;
