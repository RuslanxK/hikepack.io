import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import CategoryChart from '../chart/CategoryChart';
import CategoryTable from '../chart/CategoryTable';
import LocalSingleCategory from './LocalSingleCategory';
import { Bag } from '../../types/bag';
import { Category } from '../../types/category';

const LOCAL_STORAGE_KEY = 'categoriesData';

const defaultBag: Bag = {
  id: 'bag-1',
  tripId: 'trip-1',
  name: 'Sample Bag',
  description: 'A sample hiking bag',
  likes: 0,
  exploreBags: false,
  goal: 'Sample Goal',
  passed: false,
  imageUrl: '/images/sample-bag.png',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
 
};

const TryItNowSection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const storedCategories = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedCategories ? (JSON.parse(storedCategories) as Category[]) : [];
    } catch (error) {
      console.error('Failed to parse localStorage data:', error);
      return [];
    }
  });

  const [bag, setBag] = useState<Bag>(defaultBag);
 
  const persistCategories = (updatedCategories: Category[]) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCategories));
  };

  const addCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: `New Category ${categories.length + 1}`,
      items: [],
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      tripId: `trip-${Date.now()}`,
      bagId: `bag-${Date.now()}`,
      order: categories.length + 1,
      totalWeight:20,
      totalWornWeight: 10,
    };
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    persistCategories(updatedCategories);
  };

  const deleteCategory = (id: string) => {
    const updatedCategories = categories.filter((category) => category.id !== id);
    setCategories(updatedCategories);
    persistCategories(updatedCategories);
  };

  const updateCategory = (updatedCategory: Category) => {
    const updatedCategories = categories.map((category) =>
      category.id === updatedCategory.id ? updatedCategory : category
    );
    setCategories(updatedCategories);
    persistCategories(updatedCategories);
  };


  return (
    <section className='container mx-auto flex flex-col items-center pl-10 pr-10'>
      <h2 className='text-3xl font-bold text-center mb-2'>
        Just Try It Now <span className='text-primary'>For Free</span>
      </h2>
      <p className='text-black'>Adventure Awaits. Pack Smart. Hike Confidently.</p>

      <div className='w-full bg-white dark:bg-box rounded-lg flex flex-col sm:flex-row items-center py-10 justify-center sm:space-x-12 space-y-8 sm:space-y-0 mt-5'>
      <div className="sm:w-64 h-64 mb-6">
        <CategoryChart categories={categories} weightUnit={'lb'} />
      </div>
      <div className="w-full sm:w-fit mb-6">
        <CategoryTable categories={categories} weightUnit={'lb'} bag={bag} />
      </div>
      </div>
      <button
        onClick={addCategory}
        className='rounded-lg bg-white dark:bg-box mt-5 mb-4 w-full py-4 border-2 border-dashed border-gray-400 dark:border-gray-400 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:border-primary dark:hover:border-white'>
        <FaPlus className='text-xl' size={13} />
      </button>
      <div className='flex flex-col w-full'>
        {categories.map((category) => (
          <LocalSingleCategory
            key={category.id}
            categoryData={category}
            onDelete={deleteCategory}
            onUpdate={updateCategory}
            weightUnit={'lb'}
          />
        ))}
      </div>
    </section>
  );
};

export default TryItNowSection;
