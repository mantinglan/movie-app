import PropTypes from "prop-types";

function MovieTrailer({ trailer }) {

  return (
    <div className="movie-trailer section-title">
      <h2>Trailer</h2>
      {!trailer ? (
        <div className="no-trailer-message">No trailer available.</div>
      ) : (
        <div className="video-container">
          <iframe
            title="trailer"
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${trailer}`}
            style={{ border: "none", borderRadius: "8px" }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
}

export default MovieTrailer;

MovieTrailer.propTypes = {
  trailer: PropTypes.string,
};
