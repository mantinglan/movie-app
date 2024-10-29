import NavBar from "./NavBar/NavBar";
import PropTypes from "prop-types";

const Layout = ({ children }) => {
  return (
    <>
      <NavBar />
      <main>{children}</main>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
