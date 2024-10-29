import { useState, useEffect } from "react";
import { useFirestore } from "../../firebase/FirebaseStore.js";
import { useAuth } from "../../context/useAuth.js";
import WatchLottery from "../../components/WatchLottery/WatchLottery.js";
import sortOptions from "../../constants/optionConst.js";
import WatchListCard from "../../components/Movie/WatchListCard.js";
import "./WatchList.css";

const WatchList = () => {
  const [showLottery, setShowLottery] = useState(false);
  const [sortOption, setSortOption] = useState("release_date");

  const { getWatchlist } = useFirestore();
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      getWatchlist(user?.uid)
        .then((data) => {
          setWatchlist(data);
          console.log(data, "data");
        })
        .catch((err) => {
          console.log(err, "error");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [user?.uid, getWatchlist]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedMovies = watchlist.sort((a, b) => {
    const sortKey = sortOptions.find(
      (option) => option.value === sortOption
    )?.key;
    if (sortKey === "release_date") {
      return new Date(b.release_date) - new Date(a.release_date);
    }
    return b[sortKey] - a[sortKey];
  });

  return (
    <div className="watchlist-page">
      <h2>My Watchlist</h2>
      <div className="sort-lottery-container mb-2">
        <button
          className="lottery-button mb-1"
          onClick={() => setShowLottery(true)}
        >
          Randomly Pick a Movie!
        </button>
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
      </div>
      {showLottery && (
        <div className="lottery-modal">
          <div className="lottery-modal-content">
            <button
              className="close-lottery"
              onClick={() => setShowLottery(false)}
            >
              X
            </button>
            <WatchLottery movies={watchlist} />
          </div>
        </div>
      )}
      {isLoading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status"></div>
        </div>
      )}

      {!isLoading && sortedMovies.length === 0 && (
        <div className="d-flex justify-content-center">
          <p className="h2">No movies in your watchlist.</p>
        </div>
      )}
      {!isLoading && sortedMovies.length > 0 && (
        <div className="movie-list">
          {sortedMovies.map((movie, index) => (
            <WatchListCard
              key={index}
              movie={movie}
              setWatchlist={setWatchlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchList;
