import React, { useState } from 'react';
import Modal from './Modal';
import { BiSolidCoffeeAlt } from "react-icons/bi";


interface SupportUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SupportUsModal: React.FC<SupportUsModalProps> = ({ isOpen, onClose }) => {
  const [selectedCoffee, setSelectedCoffee] = useState<number>(1);
  const [coffeeOptions, setCoffeeOptions] = useState<number[]>([1, 3, 5, 10]);
  const [customCoffeeInput, setCustomCoffeeInput] = useState<string>('');
  const pricePerCoffee = 5;

  const handleAddCustomCoffee = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const customValue = parseInt(customCoffeeInput, 10);
      if (!isNaN(customValue) && customValue > 0 && !coffeeOptions.includes(customValue)) {
        setCoffeeOptions([...coffeeOptions, customValue]); 
        setSelectedCoffee(customValue); 
        setCustomCoffeeInput(''); 
      }
    }
  };

  const handleSupport = () => {
    alert(`You chose to buy ${selectedCoffee} coffee(s) for $${selectedCoffee * pricePerCoffee}.`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Who We Are">
      <div className="flex flex-col w-full gap-6">
        <div className="w-full">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
          We are a team of developers and designers who love hiking and actively enjoy the outdoors. Our mission is to help hikers organize their trip & bags with ease and share their journeys with others.
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
          If our work has made a positive impact on your hiking experience and you’d like to show your support, feel free to buy us a coffee!
          </p>
        </div>

        <div className="w-full bg-gray-100 dark:bg-black p-4 rounded-lg border dark:border-accent">
          <div className='flex flex-row justify-between w-full items-center'>
          <h3 className="text-lg font-semibold mb-3 dark:text-white">Buy Us a Coffee</h3>
          <BiSolidCoffeeAlt size={30} className="dark:text-white" />
          </div>
          <p className="text-sm text-gray-800 dark:text-gray-200 mb-4">Choose your coffee amount:</p>
          <input
              type="number"
              min="1"
              value={customCoffeeInput}
              placeholder="Add x"
              className="w-24 px-3 py-2 border rounded-lg text-gray-800 dark:text-gray-200 dark:bg-black dark:border-accent focus:outline-none focus:ring focus:ring-primary"
              onChange={(e) => setCustomCoffeeInput(e.target.value)}
              onKeyDown={handleAddCustomCoffee}
            />

          <div className="flex flex-wrap gap-3 mb-6 mt-6 items-center">
            {coffeeOptions.map((option) => (
              <button
                key={option}
                className={`px-5 py-2 rounded-lg border ${
                  selectedCoffee === option
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-black text-gray-800 dark:text-gray-200 dark:border-accent'
                } hover:bg-primary hover:text-white transition`}
                onClick={() => setSelectedCoffee(option)}
              >
                {option}x
              </button>
            ))}
           
          </div>
          <button
            onClick={handleSupport}
            className="w-full bg-primary hover:bg-button-hover text-white py-2 rounded-lg hover:bg-primary-dark transition"
          >
            Support ${selectedCoffee * pricePerCoffee}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SupportUsModal;
