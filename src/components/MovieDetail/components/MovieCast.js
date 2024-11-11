import PropTypes from "prop-types";
import { LazyLoadImage } from "react-lazy-load-image-component";

function MovieCast({ cast }) {
  return (
    <div className="cast-section">
      <h2>Cast</h2>
      <div className="cast-list">
        {cast.map((actor) => (
          <div key={actor.id} className="cast-card">
            <LazyLoadImage
              src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
              alt={actor.name}
              effect="blur" // 懶加載並在圖片加載時顯示模糊效果
              placeholderSrc={"/path-to-placeholder-image.jpg"} // 替代圖片URL
            />
            <p>
              <strong>{actor.name}</strong>
            </p>
            <p>as {actor.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MovieCast;

MovieCast.propTypes = {
  cast: PropTypes.array.isRequired,
};
