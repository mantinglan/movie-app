import "./App.css";
import { HashRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import NavBar from "./components/NavBar/NavBar";
import Routes from "./Routes/Routes";

import { AuthProvider } from "./context/authProvider";
import { AlertProvider } from "./context/alertProvider";

function App() {
  return (
    <>
      <AuthProvider>
        <AlertProvider>
          <HashRouter>
            <NavBar />
            <div className="app-container">
              <Routes />
            </div>
          </HashRouter>
        </AlertProvider>
      </AuthProvider>
    </>
  );
}

export default App;
