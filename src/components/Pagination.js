import PropTypes from "prop-types";

function PaginationComponent({ activePage, totalPages, setActivePage }) {
  return (
    <div className="pagination d-flex align-items-center gap-2 my-4">
      <div className="d-flex gap-2" style={{ maxWidth: "250px" }}>
        <button
          className="btn btn-primary mr-2"
          onClick={() => setActivePage(activePage - 1)}
          disabled={activePage === 1}
        >
          Prev
        </button>
        <button
          className="btn btn-primary mr-2"
          onClick={() => setActivePage(activePage + 1)}
          disabled={activePage === totalPages}
        >
          Next
        </button>
      </div>
      <div className="d-flex gap-1">
        <span>{activePage}</span>
        <span>of</span>
        <span>{totalPages}</span>
      </div>
    </div>
  );
}
export default PaginationComponent;

PaginationComponent.propTypes = {
  activePage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  setActivePage: PropTypes.func.isRequired,
};
