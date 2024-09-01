import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const Shop: React.FC = () => {

  const navigate = useNavigate();


  const categories = [
    { name: 'Backpacks', image: '/images/backpack-shop.jpg' },
    { name: 'Tents', image: '/images/tent-shop.jpg' },
    { name: 'Sleeping Bags', image: '/images/sleeping-bag-shop.webp' },
    { name: 'Footwear', image: '/images/boots-shop.webp' },
  ];

  const products = [
    { name: 'Hiking Backpack', price: '$89.99', image: '/images/backpack.jpg' },
    { name: 'Ultralight Tent', price: '$199.99', image: '/images/tent.jpg' },
    { name: 'Sleeping Bag', price: '$129.99', image: '/images/sleeping-bag.jpg' },
    { name: 'Hiking Boots', price: '$149.99', image: '/images/shoes.jpg' },
  ];

  return (

    <div className="container mx-auto p-4 sm:p-10">
   
      <div className='flex items-center mb-4'>
      <button 
              type="button" 
              className="mr-4 text-gray-500 dark:text-gray-100 bg-gray-200 dark:bg-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-500 p-2 rounded-full hover:shadow-sm" 
              onClick={() => navigate(-1)}>
              <FaArrowLeft size={17} />
            </button>
      <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Shop Hiking Gear</h1>
      </div>
      <p className="text-base text-left text-gray-600 dark:text-gray-300 mb-8">
             Discover top-quality hiking gear to enhance your outdoor adventures.
          </p>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div key={index} className="relative group cursor-pointer">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-48 object-cover rounded-lg shadow-lg transform group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity group-hover:scale-105 transition-transform">
                <span className="text-white text-lg font-bold">{category.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div key={index} className="bg-white dark:bg-box rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
              <div className='w-full dark:bg-white rounded-lg'>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-contain rounded-lg mb-4"
              />
              </div>
              <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-2">{product.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{product.price}</p>
              <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm">
                View on Amazon
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
    
  );
};

export default Shop;
