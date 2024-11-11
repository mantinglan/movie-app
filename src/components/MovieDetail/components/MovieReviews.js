import PropTypes from "prop-types";

function MovieReviews({ reviews }) {
  return (
    <div className="reviews-section">
      <h2>Reviews</h2>
      {reviews.length > 0 ? (
        <ul className="reviews-list">
          {reviews.map((review) => (
            <li key={review.id} className="review-item">
              <strong>{review.author}</strong>
              <p>{review.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews available.</p>
      )}
    </div>
  );
}

export default MovieReviews;

MovieReviews.propTypes = {
  reviews: PropTypes.array.isRequired,
};
