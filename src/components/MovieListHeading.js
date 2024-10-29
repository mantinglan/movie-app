import PropTypes from "prop-types";

const MovieListHeading = (props) => {
  return (
    <div className="col">
      <h1>{props.heading}</h1>
    </div>
  );
};

export default MovieListHeading;

MovieListHeading.propTypes = {
  heading: PropTypes.string.isRequired,
};
