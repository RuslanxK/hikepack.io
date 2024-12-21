import React from 'react';
import { useFilterContext } from '../../context/FilterContext';

export const NameFilterInput: React.FC = () => {
  const { searchName, setSearchName } = useFilterContext();

  return (
    <div className="mb-4 w-full">
      <label htmlFor="name-filter" className="block text-sm font-medium text-gray-700 dark:text-white">
        Search by Name
      </label>
      <input
        type="text"
        id="name-filter"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        placeholder="Enter name"
        className='text-sm w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none dark:bg-theme-bgDark dark:border-accent'
      />
    </div>
  );
};

export const DistanceFilterInput: React.FC = () => {
  const { searchDistance, setSearchDistance } = useFilterContext();

  return (
    <div className="mb-4 w-full">
      <label htmlFor="distance-filter" className="block text-sm font-medium text-gray-700 dark:text-white">
        Search by Distance
      </label>
      <input
        type="range"
        id="distance-filter"
        value={searchDistance}
        onChange={(e) => setSearchDistance(e.target.value)}
        min={0}
        max={10000}
        className="w-full"
      />
      <span className="text-sm  dark:text-white">{searchDistance} km</span>
    </div>
  );
};

export const YearFilterInput: React.FC = () => {
  const { searchDate, setSearchDate } = useFilterContext();

  return (
    <div className="mb-4 w-full">
      <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 dark:text-white">
        Search by Year
      </label>
      <input
        type="number"
        id="year-filter"
        min={2024}
        value={searchDate}
        onChange={(e) => setSearchDate(e.target.value)}
        placeholder="Enter year (e.g., 2025)"
        className="text-sm w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none dark:bg-theme-bgDark dark:border-accent"
      />
    </div>
  );
};

export const ClearFiltersButton: React.FC = () => {
  const { clearFilters } = useFilterContext();

  return (
    <button
      onClick={clearFilters}
      className="text-sm p-2 mt-1 bg-primary text-white rounded-lg sm:w-96 w-full hover:bg-button-hover"
    >
      Clear Filters
    </button>
  );
};
