import React, { useState, useEffect, useRef } from 'react';
import { CategoryTableProps } from '../../types/category';

const weightConversionRates = {
  lb: { lb: 1, kg: 0.453592, g: 453.592, oz: 16 },
  kg: { lb: 2.20462, kg: 1, g: 1000, oz: 35.274 },
  g: { lb: 0.00220462, kg: 0.001, g: 1, oz: 0.035274 },
  oz: { lb: 0.0625, kg: 0.0283495, g: 28.3495, oz: 1 },
};

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, weightUnit: initialWeightUnit }) => {
  const [weightUnit, setWeightUnit] = useState(initialWeightUnit);
  const [isOpen, setIsOpen] = useState(false);
  const [convertedCategories, setConvertedCategories] = useState(categories);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const convertWeights = (categories: any, fromUnit: any, toUnit: any) => {
      const conversionRate = (weightConversionRates as any)[fromUnit][toUnit];
      return categories.map((category: any) => ({
        ...category,
        totalWeight: category.totalWeight * conversionRate,
        totalWornWeight: category.totalWornWeight * conversionRate,
      }));
    };
    setConvertedCategories(convertWeights(categories, initialWeightUnit, weightUnit));
  }, [weightUnit, categories, initialWeightUnit]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const totalWeight = convertedCategories.reduce((sum, category) => sum + category.totalWeight, 0);
  const totalWornWeight = convertedCategories.reduce((sum, category) => sum + category.totalWornWeight, 0);
  const baseWeight = totalWeight - totalWornWeight;

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="w-full">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-200">
        <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
          <tr>
            <th className="px-4 sm:px-6 py-2 border-r border-b border-neutral-400 dark:border-gray-500 dark:text-gray-200">Color</th>
            <th className="px-4 sm:px-6 py-2 border-r border-b border-neutral-400 dark:border-gray-500 dark:text-gray-200">Category</th>
            <th className="px-3 sm:px-6 py-2 border-b border-neutral-400 dark:border-gray-500 dark:text-gray-200">
              Weight
              <div className="relative inline-block text-left" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="text-gray-900 dark:text-gray-200 focus:outline-none font-medium rounded-lg px-1 text-sm text-center inline-flex items-center"
                >
                  {weightUnit} 
                  <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
                </button>
                {isOpen && (
                  <div className="bg-white divide-y divide-gray-100 shadow w-fit dark:bg-zinc-600 absolute mt-1">
                    <ul className="text-sm text-gray-700 dark:text-gray-200">
                      {['lb', 'kg', 'g', 'oz'].map(unit => (
                        <li key={unit}>
                          <button
                            onClick={() => { setWeightUnit(unit); setIsOpen(false); }}
                            className=" px-4 py-2 w-full hover:bg-gray-100 dark:hover:bg-zinc-500 dark:hover:text-white font-normal border-b border-neutral-300 dark:border-zinc-500">
                            {unit}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
            </th>
          </tr>
        </thead>
        <tbody>
          {convertedCategories.map((category) => (
            <tr key={category.id} className="border-b border-neutral-400 dark:border-gray-500">
              <td className="px-4 sm:px-6 py-2"><div style={{ backgroundColor: category.color }} className="w-4 h-4 rounded-full"></div></td>
              <td className="px-4 sm:px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border-l border-r border-neutral-400 dark:border-gray-500"> {category.name.length > 15 ? `${category.name.substring(0, 15)}...` : category.name}</td>
              <td className="px-4 sm:px-6 py-2">{category.totalWeight.toFixed(3)} {weightUnit}</td>
            </tr>
          ))}
          {['Total', 'Worn', 'Base'].map((label, index) => {
            const value = index === 0 ? totalWeight : index === 1 ? totalWornWeight : baseWeight;
            return (
              <tr key={label} className="text-gray-900 font-semibold border-b border-neutral-400 dark:border-gray-500">
                <td className="px-4 sm:px-6 py-2 border-r border-b border-neutral-400 dark:border-gray-500 dark:text-gray-200">{label}</td>
                <td className="px-4 sm:px-6 py-2"></td>
                <td className="px-4 sm:px-6 py-2 border-l border-neutral-400 dark:border-gray-500 dark:text-gray-200">{value.toFixed(3)} {weightUnit}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
