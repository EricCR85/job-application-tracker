
const FilterControls = ({
  searchQuery,
  setSearchQuery,
  filter,
  setFilter,
  sortBy,
  setSortBy,
}) => {
  return (
    <div className="filter-controls-bar">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by company or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="filter-selects">
        <div className="control-group">
          <label>Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="control-group">
          <label>Sort By:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest Applied</option>
            <option value="oldest">Oldest Applied</option>
            <option value="progress">Task Progress</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
