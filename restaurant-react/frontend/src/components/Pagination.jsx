import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  // Logic to show limited page numbers (e.g., 1, 2, ..., 5, 6, 7, ..., 10)
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <FaChevronLeft className="text-gray-600" />
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`w-10 h-10 rounded-lg border ${
              currentPage === 1
                ? 'bg-primary text-white border-primary'
                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
            } transition-colors font-medium`}
          >
            1
          </button>
          {start > 2 && <span className="text-gray-400">...</span>}
        </>
      )}

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 rounded-lg border ${
            currentPage === page
              ? 'bg-primary text-white border-primary'
              : 'border-gray-200 hover:bg-gray-50 text-gray-700'
          } transition-colors font-medium`}
        >
          {page}
        </button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-gray-400">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className={`w-10 h-10 rounded-lg border ${
              currentPage === totalPages
                ? 'bg-primary text-white border-primary'
                : 'border-gray-200 hover:bg-gray-50 text-gray-700'
            } transition-colors font-medium`}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <FaChevronRight className="text-gray-600" />
      </button>
    </div>
  );
};

export default Pagination;
