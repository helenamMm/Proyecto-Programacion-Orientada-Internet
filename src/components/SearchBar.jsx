import React, { useState } from "react";

function SearchBar() {
    const [query, setQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        alert(`Searching for: ${query}`);
    };

    return (
        <form className="d-flex" onSubmit={handleSearch}>
            <input
                className="form-control me-2"
                type="search"
                placeholder="Buscar....."
                aria-label="Search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button className="btn btn-outline-warning" type="submit">
                🔍
            </button>
        </form>
    );
}

export default SearchBar;

