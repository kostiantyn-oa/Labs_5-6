import "../styles/Pagination.css";

export const Pagination = ({
  currentPage,
  totalPages,
  onNextPage,
  onPrevPage,
  limitPerPage,
  onLimitChange,
  totalTodos,
}) => {
  const startItem = (currentPage - 1) * limitPerPage + 1;
  const endItem = Math.min(currentPage * limitPerPage, totalTodos);

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <span className="pagination-text">
          Показано {startItem}-{endItem} з {totalTodos}
        </span>
        <div className="limit-selector">
          <label htmlFor="limit-select">На сторінці:</label>
          <select
            id="limit-select"
            value={limitPerPage}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="limit-select"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={onPrevPage}
          disabled={currentPage === 1}
          aria-label="Попередня сторінка"
        >
          ← Попередня
        </button>
        <span className="page-indicator">
          Сторінка {currentPage} з {totalPages}
        </span>
        <button
          className="pagination-button"
          onClick={onNextPage}
          disabled={currentPage >= totalPages}
          aria-label="Наступна сторінка"
        >
          Наступна →
        </button>
      </div>
    </div>
  );
};