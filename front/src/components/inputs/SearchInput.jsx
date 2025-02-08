import React, { useState } from "react";

const SearchInput = ({ onSearch, showSelect }) => {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("service"); // Tipo de búsqueda: 'service' o 'passenger'

  const handleInputChange = (e) => {
    let value = e.target.value.trim();
    value = value.replace(/\s+/g, " ");
    value = value.replace(/\t/g, "");
    setQuery(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      console.log("Realizando búsqueda:", query, searchType);
      onSearch(query, searchType);
    }
  };

  const handleClear = () => {
    setQuery("");
    onSearch("", searchType);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-[600px]">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative flex items-center gap-2">
            {showSelect && (
              <select
                className="min-w-[180px] h-12 border border-gray-300 rounded-full px-4 py-2 bg-white text-gray-700 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="service" className="text-gray-800 bg-gray-100">
                  Buscar por Servicio
                </option>
                <option value="passenger" className="text-gray-800 bg-gray-100">
                  Buscar por Pasajero
                </option>
              </select>
            )}

            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                className="w-full h-12 pl-6 pr-16 border shadow-sm rounded-full text-gray-800 border-gray-300 bg-white focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                placeholder={
                  searchType === "service"
                    ? "Buscar por servicio..."
                    : "Buscar por pasajero..."
                }
              />

              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <button
                  type="submit"
                  className="p-2 hover:text-teal-500 text-teal-400 transition-colors"
                >
                  <svg
                    className="h-5 w-5 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 56.966 56.966"
                  >
                    <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17s-17-7.626-17-17S14.61,6,23.984,6z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </form>
        {query && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-[#4256a6] text-white rounded-full hover:bg-[#2c3e7e] transition-colors duration-200 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              Limpiar búsqueda
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
