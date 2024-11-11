import PropTypes from "prop-types";

function MovieTrailer({ trailer }) {
  return (
    <div className="movie-trailer">
      <h2>Trailer</h2>
      <iframe
        title="trailer"
        width="100%"
        height="500"
        src={`https://www.youtube.com/embed/${trailer}`}
        style={{ border: 0 }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export default MovieTrailer;

MovieTrailer.propTypes = {
  trailer: PropTypes.string.isRequired,
};
