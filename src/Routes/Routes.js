import { Routes, Route } from "react-router-dom";

import MovieList from "../../src/Pages/MovieList";
import SearchResult from "../../src/Pages/SearchResult";
import WatchList from "../../src/Pages/WatchList/WatchList";
import MovieDetail from "../../src/components/MovieDetail/MovieDetail";
import Protected from "../../src/Routes/Protected";

export const ROUTES = {
  HOME: "/",
  SEARCH: "/search",
  MOVIE_DETAIL: "/movie/:movie_id",
  WATCHLIST: "/watchlist"
};

const routeConfig = [
  {
    path: ROUTES.HOME,
    element: <MovieList />
  },
  {
    path: ROUTES.SEARCH,
    element: <SearchResult />
  },
  {
    path: ROUTES.MOVIE_DETAIL,
    element: <MovieDetail />
  },
  {
    path: ROUTES.WATCHLIST,
    element: <Protected><WatchList /></Protected>,
    protected: true
  }
];

export default function AppRoutes() {
  return (
    <Routes>
      {routeConfig.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={route.element}
        />
      ))}
    </Routes>
  );
}
