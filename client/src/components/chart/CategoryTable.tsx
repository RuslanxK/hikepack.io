import React, { useState, useEffect } from 'react';
import { CategoryTableProps } from '../../types/category';
import Cookies from 'js-cookie';
import { useMutation } from '@apollo/client';
import { UPDATE_BAG_PASSED_STATUS } from '../../mutations/bagMutations';

const weightConversionRates = {
  lb: { lb: 1, kg: 0.453592, g: 453.592, oz: 16 },
  kg: { lb: 2.20462, kg: 1, g: 1000, oz: 35.274 },
  g: { lb: 0.00220462, kg: 0.001, g: 1, oz: 0.035274 },
  oz: { lb: 0.0625, kg: 0.0283495, g: 28.3495, oz: 1 },
};

const TOLERANCE_PERCENTAGE = 1; 

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  weightUnit: initialWeightUnit,
  bag,
}) => {
  const [weightUnit, setWeightUnit] = useState(initialWeightUnit);
  const [convertedCategories, setConvertedCategories] = useState(categories);
  const [isGoalMet, setIsGoalMet] = useState(false);

  const [updateBagPassedStatus] = useMutation(UPDATE_BAG_PASSED_STATUS);

  // 🛠️ Convert Weights
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

  // 📊 Calculate Weights
  const totalWeight = convertedCategories.reduce((sum, category) => sum + category.totalWeight, 0);
  const totalWornWeight = convertedCategories.reduce(
    (sum, category) => sum + category.totalWornWeight,
    0
  );
  const baseWeight = totalWeight - totalWornWeight;

  // 🍪 Store Total Weight in Cookies
  useEffect(() => {
    Cookies.set('totalWeight', totalWeight.toFixed(3), { expires: 7 });
  }, [totalWeight]);

  // ✅ Check Goal Status
  useEffect(() => {
    if (bag?.goal) {
      const goal = parseFloat(bag.goal);
      const tolerance = goal * (TOLERANCE_PERCENTAGE / 100);
      const maxAllowedWeight = goal + tolerance;

      const newGoalStatus = baseWeight <= maxAllowedWeight;
      setIsGoalMet(newGoalStatus);

      updateBagPassedStatus({
        variables: {
          id: bag.id,
          passed: newGoalStatus,
        },
      }).catch((error) => {
        console.error('Failed to update goal status:', error);
      });
    }
  }, [baseWeight, bag?.goal, updateBagPassedStatus, bag?.id]);

  // 🖥️ Render Table
  return (
    <div className="w-full sm:p-0">
      <table className="w-full text-sm text-left text-gray-800 dark:text-gray-300 rounded-lg bg-white dark:bg-zinc-800">
        <thead className="text-xs text-gray-700 uppercase dark:text-gray-400 bg-gray-100 dark:bg-zinc-700">
          <tr>
            <th className="px-4 sm:px-6 py-2 border-r border-b dark:border-zinc-600">Color</th>
            <th className="px-4 sm:px-6 py-2 border-r border-b dark:border-zinc-600">Category</th>
            <th className="px-3 sm:px-6 py-2 border-b dark:border-zinc-600">
              Weight
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
                className="ml-1 text-gray-800 dark:text-gray-200 bg-white dark:bg-zinc-700 border rounded cursor-pointer"
              >
                {['lb', 'kg', 'g', 'oz'].map((unit) => (
                  <option key={unit} className="dark:text-gray-800" value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </th>
          </tr>
        </thead>
        <tbody>
          {convertedCategories.map((category) => (
            <tr key={category.id} className="border-b dark:border-zinc-600">
              <td className="px-4 sm:px-6 py-2">
                <div
                  style={{ backgroundColor: category.color }}
                  className="w-4 h-4 rounded-full"
                ></div>
              </td>
              <td className="px-4 sm:px-6 py-2 font-medium text-gray-800 dark:text-gray-300">
                {category.name.length > 10
                  ? `${category.name.substring(0, 10)}...`
                  : category.name}
              </td>
              <td className="px-4 sm:px-6 py-2 text-gray-700 dark:text-gray-300">
                {category.totalWeight.toFixed(3)} {weightUnit}
              </td>
            </tr>
          ))}

          {/* 📊 Display Total, Worn, and Base weights */}
          {['Total', 'Worn', 'Base'].map((label, index) => {
            const value =
              index === 0
                ? totalWeight
                : index === 1
                ? totalWornWeight
                : baseWeight;
            return (
              <tr
                key={label}
                className={`font-semibold border-b dark:border-zinc-600 ${
                  label === 'Base' && bag?.goal
                    ? isGoalMet
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                    : 'text-gray-800 dark:text-gray-300'
                }`}
              >
                <td className="px-4 sm:px-6 py-2 border-r dark:border-zinc-600">{label}</td>
                <td className="px-4 sm:px-6 py-2"></td>
                <td className="px-4 sm:px-6 py-2 border-l dark:border-zinc-600">
                  {value.toFixed(3)} {weightUnit}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
