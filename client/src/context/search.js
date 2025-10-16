// context/search.js (✅ Rename file for clarity)

import { useState, useContext, createContext } from "react";

// Create search context
const SearchContext = createContext();

// Search provider component
const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState({
    keyword: "",
    results: [],
  });

  return (
    <SearchContext.Provider value={[search, setSearch]}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook for using search context
const useSearch = () => useContext(SearchContext);

export { useSearch, SearchProvider };
