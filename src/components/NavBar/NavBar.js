import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authProvider";

import "./Heading.css";

const NavBar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  console.log(useAuth());
  const { user, signInWithGoogle, logout } = useAuth();
  // const { user, signInWithGoogle, logout } = useAuth();
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      console.log("success");
    } catch (error) {
      console.log("errr", error);
    }
  };
  // 跳轉到首頁並重新獲取 Now Playing 電影
  const handleTitleClick = () => {
    navigate("/");
  };

  return (
    <div className="heading-container navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="heading d-flex justify-content-between">
        {/* 網站標題 */}
        <span
          className="navbar-brand"
          onClick={handleTitleClick}
          style={{ cursor: "pointer" }}
        >
          Movie DB
        </span>

        <div className="d-flex align-items-center">
          {/* 搜索框 */}
          <div className="mr-3" onClick={() => navigate("/search")}>
            <i className="bi bi-search text-white"></i>
          </div>
          {user && (
            <div className="d-none d-md-block">
              <div className="dropdown" id="dropdown">
                <div
                  className="dropdown-toggle"
                  data-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="text-white">{user.displayName}</span>
                </div>
                <div className="dropdown-menu dropdown-menu-md-right">
                  <span
                    className="dropdown-item"
                    onClick={() => navigate("/watchlist")}
                  >
                    Watch List
                  </span>
                  <span className="dropdown-item" onClick={logout}>
                    Logout
                  </span>
                </div>
              </div>
            </div>
          )}
          {user && (
            <div className="d-flex d-md-none">
              <button
                className="btn btn-outline-light"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                ☰
              </button>
            </div>
          )}

          {!user && (
            <div className="d-flex text-white" onClick={handleGoogleLogin}>
              Login
            </div>
          )}
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          {!user && (
            <button
              className="btn btn-outline-light w-100 mb-2 text-white"
              onClick={() => {
                handleGoogleLogin();
                setIsMobileMenuOpen(false);
              }}
            >
              Login
            </button>
          )}
          {user && (
            <>
              <div className="fw-bolder w-100 mb-2 d-flex align-items-center">
                <img className="avatar" src={user.photoURL} alt="" />
                <div className="pl-2 text-white">{user.displayName}</div>
              </div>
              <div
                className="text-white mb-4 w-100"
                onClick={() => {
                  navigate("/");
                  setIsMobileMenuOpen(false);
                }}
              >
                Home
              </div>
              <div
                className="text-white mb-4 w-100"
                onClick={() => {
                  navigate("/watchlist");
                  setIsMobileMenuOpen(false);
                }}
              >
                WatchList
              </div>

              <button
                className="btn btn-outline-light w-100 mb-2"
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NavBar;
