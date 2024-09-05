import React, { useState, useEffect } from 'react';
import { CategoryTableProps } from '../../types/category';

const weightConversionRates = {
  lb: { lb: 1, kg: 0.453592, g: 453.592, oz: 16 },
  kg: { lb: 2.20462, kg: 1, g: 1000, oz: 35.274 },
  g: { lb: 0.00220462, kg: 0.001, g: 1, oz: 0.035274 },
  oz: { lb: 0.0625, kg: 0.0283495, g: 28.3495, oz: 1 },
};

const CategoryTable: React.FC<CategoryTableProps> = ({ categories, weightUnit: initialWeightUnit }) => {
  const [weightUnit, setWeightUnit] = useState(initialWeightUnit);
  const [convertedCategories, setConvertedCategories] = useState(categories);

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

 
    

  const totalWeight = convertedCategories.reduce((sum, category) => sum + category.totalWeight, 0);
  const totalWornWeight = convertedCategories.reduce((sum, category) => sum + category.totalWornWeight, 0);
  const baseWeight = totalWeight - totalWornWeight;

  return (
    <div className="w-full">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-200">
        <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
          <tr>
            <th className="px-4 sm:px-6 py-2 border-r border-b border-neutral-400 dark:border-gray-500 dark:text-gray-200">Color</th>
            <th className="px-4 sm:px-6 py-2 border-r border-b border-neutral-400 dark:border-gray-500 dark:text-gray-200">Category</th>
            <th className="px-3 sm:px-6 py-2 border-b border-neutral-400 dark:border-gray-500 dark:text-gray-200">
              Weight
              <div className="relative inline-block text-left ml-1">
            <select
            value={weightUnit}
            onChange={(e) => setWeightUnit(e.target.value)}
            className="text-gray-900 dark:text-gray-200 focus:outline-none dark:bg-transparent font-medium text-sm text-center border border-gray-300 dark:border-zinc-500"
             >
           {['lb', 'kg', 'g', 'oz'].map((unit) => (
           <option key={unit} className='dark:text-gray-900' value={unit}>
           {unit}
           </option>
           ))}
           </select>
           </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {convertedCategories.map((category) => (
            <tr key={category.id} className="border-b border-neutral-400 dark:border-gray-500">
              <td className="px-4 sm:px-6 py-2"><div style={{ backgroundColor: category.color }} className="w-4 h-4 rounded-full"></div></td>
              <td className="px-4 sm:px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white border-l border-r border-neutral-400 dark:border-gray-500"> {category.name.length > 10 ? `${category.name.substring(0, 10)}...` : category.name}</td>
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
