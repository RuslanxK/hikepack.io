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


export const GoalFilterInput: React.FC = () => {
  const { searchGoal, setSearchGoal } = useFilterContext();

  return (
    <div className="mb-4 w-full">
      <label htmlFor="goal-filter" className="block text-sm font-medium text-gray-700 dark:text-white">
        Search by Goal
      </label>
      <input
        type="range"
        id="goal-filter"
        value={searchGoal}
        onChange={(e) => setSearchGoal(e.target.value)}
        min={0}
        max={100}
        step={1}
        className="w-full mt-1"
      />
      <span className="block text-sm mt-1 text-gray-700 dark:text-white">
        Goal: <strong>{searchGoal}</strong>
      </span>
    </div>
  );
};



export const PassedFilterInput: React.FC = () => {
  const { searchPassed, setSearchPassed } = useFilterContext();

  const handleFilterClick = (status: string) => {
    setSearchPassed(status);
  };

  return (
    <div className="mb-4 w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-white mb-2">Search by Status</label>
      <div className="flex gap-2 border border-2 dark:border dark:border-accent border-gray-100 p-2 rounded-lg">
        <button
          onClick={() => handleFilterClick('')}
          className={`px-3 py-1 rounded-full text-sm ${
            searchPassed === '' ? 'bg-blue text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleFilterClick('true')}
          className={`px-3 py-1 rounded-full text-sm ${
            searchPassed === 'true' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Passed
        </button>
        <button
          onClick={() => handleFilterClick('false')}
          className={`px-3 py-1 rounded-full text-sm ${
            searchPassed === 'false' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Not Passed
        </button>
      </div>
    </div>
  );
};


export const ClearFiltersButton: React.FC = () => {
  const { clearFilters } = useFilterContext();

  return (
    <button
      onClick={clearFilters}
      className="text-sm p-2 mt-1 bg-primary text-white rounded-lg sm:w-64 w-full hover:bg-button-hover"
    >
      Clear
    </button>
  );
};
