import "../styles/SearchBar.css";

export const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="🔍 Пошук завдань..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchTerm && (
        <button
          className="clear-search-button"
          onClick={() => onSearchChange("")}
          aria-label="Очистити пошук"
        >
          ✕
        </button>
      )}
    </div>
  );
};