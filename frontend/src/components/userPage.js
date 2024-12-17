import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

const UserPage = () => {
  const { user_id } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [numberDetails, setNumberDetails] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(5); // Default to 5 rows per page
  const [filter, setFilter] = useState("all"); // New filter state

  // Fetch user and number details
  const fetchUserDetails = useCallback(() => {
    if (user_id) {
      console.log(`Fetching details for user ID: ${user_id}`);

      // Fetch user details
      fetch(
        `http://localhost:8080/getuserdet?user_id=${encodeURIComponent(user_id)}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("User Details fetched:", data);
          setUserDetails(data);
        })
        .catch((error) => console.error("Error fetching user details:", error));

      // Fetch paginated and filtered number details
      fetch(
        `http://localhost:8080/getusernumbers?user_id=${encodeURIComponent(
          user_id
        )}&page=${currentPage}&page_size=${pageSize}&filter=${filter}`, // Include filter in query
        {
          method: "GET",
          headers: { Accept: "application/json" },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log("Number Details fetched:", data);
          setNumberDetails(data.number_details);
          setTotalPages(data.total_pages);
          setTotalCount(data.total_count);
        })
        .catch((error) =>
          console.error("Error fetching user number details:", error)
        );
    } else {
      console.warn("No user_id found");
    }
  }, [user_id, currentPage, pageSize, filter]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Page size change handler
  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value, 10));
    setCurrentPage(1); // Reset to the first page when the page size changes
  };

  // Filter change handler
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1); // Reset to the first page when the filter changes
  };

  if (!userDetails) {
    return <div className="text-center text-lg mt-10">Loading user details...</div>;
  }

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-20 mt-20">
        <button
          onClick={() => window.history.back()}
          className="text-custom-blue font-bold flex items-center"
        >
          <span className="mr-2 font-bold">&larr;</span> Back
        </button>

        <h1 className="text-3xl font-bold text-custom-blue mx-auto">
          Searches by {userDetails.name}
        </h1>

        {/* Filter Dropdown */}
        <select 
          value={filter} 
          onChange={handleFilterChange} 
          className="border text-custom-blue font-bold rounded px-2 py-1"
        >
          <option value="all">All</option>
          <option value="positive">Positives</option>
          <option value="negative">Negatives</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto border-separate border w-full">
          <thead>
            <tr className="bg-custom-blue text-white">
              <th className="px-4 py-2 text-left text-xl rounded-tl-lg">NUMBER</th>
              <th className="px-4 py-2 text-xl text-left">RESULT</th>
              <th className="px-4 py-2 text-xl text-left">DATE</th>
              <th className="px-4 py-2 text-left text-xl rounded-tr-lg">TIME</th>
            </tr>
          </thead>
          <tbody>
            {numberDetails.map((entry) => (
              <tr key={entry.id} className="bg-custom-blue">
                <td className="border px-4 py-2 text-white">{entry.number}</td>
                <td className="border px-4 py-2 text-white">{entry.result}</td>
                <td className="border px-4 py-2 text-white">
                  {new Date(entry.created_at).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2 text-white">
                  {new Date(entry.created_at).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <label htmlFor="pageSize" className="mr-2 font-bold text-custom-blue">Show:</label>
            <select 
              id="pageSize" 
              value={pageSize} 
              onChange={handlePageSizeChange}
              className="border text-custom-blue font-bold rounded px-2 py-1"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="text-center font-bold text-custom-blue">
            Page {currentPage} of {totalPages} (Total {totalCount} entries)
          </div>

          <div className="flex space-x-2">
            <button 
              onClick={handlePrevPage} 
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded ${
                currentPage === 1 
                  ? 'bg-gray-200 font-bold text-custom-blue cursor-not-allowed' 
                  : 'bg-custom-blue text-white font-bold hover:opacity-90'
              }`}
            >
              Previous
            </button>
            <button 
              onClick={handleNextPage} 
              disabled={currentPage === totalPages}
              className={`px-4 py-2 border rounded ${
                currentPage === totalPages 
                  ? 'bg-gray-200 font-bold text-custom-blue cursor-not-allowed' 
                  : 'bg-custom-blue text-white font-bold hover:opacity-90'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPage;
