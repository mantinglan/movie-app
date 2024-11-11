import { Routes, Route } from "react-router-dom";

import MovieList from "../../src/Pages/MovieList";
import SearchResult from "../../src/Pages/SearchResult";
import WatchList from "../../src/Pages/WatchList/WatchList";
import MovieDetail from "../../src/components/MovieDetail/MovieDetail";
import Protected from "../../src/Routes/Protected";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MovieList />} />
      <Route path="/search" element={<SearchResult />} />
      <Route path="/movie/:movie_id" element={<MovieDetail />} />
      <Route
        path="/watchlist"
        element={
          <Protected>
            <WatchList />
          </Protected>
        }
      />
    </Routes>
  );
}
