import PropTypes from "prop-types";

function WatchlistButton({ isInWatchlist, onAdd, onRemove }) {
  return (
    <button 
      className={`watchlist-btn ${isInWatchlist ? 'remove-from-watchlist-btn' : 'add-to-watchlist-btn'}`}
      onClick={isInWatchlist ? onRemove : onAdd}
    >
      {isInWatchlist ? '- Remove from Watchlist' : '+ Add to Watchlist'}
    </button>
  );
}

export default WatchlistButton;

WatchlistButton.propTypes = {
  isInWatchlist: PropTypes.bool.isRequired,
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};
