import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FilterContextType {
  searchName: string;
  setSearchName: (value: string) => void;
  searchDistance: string;
  setSearchDistance: (value: string) => void;
  searchDate: string;
  setSearchDate: (value: string) => void;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchName, setSearchName] = useState('');
  const [searchDistance, setSearchDistance] = useState('');
  const [searchDate, setSearchDate] = useState('');

  const clearFilters = () => {
    setSearchName('');
    setSearchDistance('');
    setSearchDate('');
  };

  return (
    <FilterContext.Provider
      value={{
        searchName,
        setSearchName,
        searchDistance,
        setSearchDistance,
        searchDate,
        setSearchDate,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
};
