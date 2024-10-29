import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import NavBar from "./components/NavBar/NavBar";
import MovieList from "./Pages/MovieList";
import SearchResult from "./Pages/SearchResult";
import WatchList from "./Pages/WatchList/WatchList";
import MovieDetail from "./components/MovieDetail/MovieDetail";
import Protected from "./Routes/Protected";
import { AuthProvider } from "./context/authProvider";
import { AlertProvider } from "./context/alertProvider";

function App() {
  return (
    <>
      <AuthProvider>
        <AlertProvider>
          <Router>
            <NavBar />
            <div className="app-container">
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
            </div>
          </Router>
        </AlertProvider>
      </AuthProvider>
    </>
  );
}

export default App;
