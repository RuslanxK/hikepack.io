import React, { useState, useEffect} from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useQuery } from '@apollo/client';
import { CategoryProps } from '../../types/category';
import { GET_ITEMS} from '../../queries/itemQueries';
import { GetItemsData, Item } from '../../types/item';
import ItemShare from './ItemShare'
import Spinner from '../loading/Spinner';
import Message from '../message/Message';

const CategoryShare: React.FC<CategoryProps> = ({ categoryData, weightUnit }) => {
  const [expanded, setExpanded] = useState(true);

  const { loading, error, data } = useQuery<GetItemsData>(GET_ITEMS, { variables: { categoryId: categoryData.id } });
  const [itemsData, setItemsData] = useState<Item[]>([]);

  useEffect(() => {
    if (data) {
      setItemsData(data.items.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    }
  }, [data]);

  const handleRowClick = () => {
    setExpanded(!expanded);
  };

  if (loading  || error) {
    if (error) {
      console.error('Error fetching item details:', error);
    }
    return (
      <div className="w-full flex flex-col justify-center">
        <Spinner w={6} h={6} />
        {(error) && (
          <Message width='w-fit' title="Attention Needed" padding="sm:p-5 p-3" titleMarginBottom="mb-2" message="Something went wrong. Please try again later." type="error" />
        )}
      </div>
    );
  }

  return (
    <div className="mb-2" >
      <div className="cursor-pointer bg-white dark:bg-zinc-800 w-full">
        <div className="py-2.5 pl-2 pr-2 text-sm w-full">
          <div className="flex justify-between items-center w-full">
            <input
              type="text"
              readOnly
              defaultValue={categoryData.name}
              placeholder='name'
              className="border-b border-gray-300 dark:border-gray-600 px-2 py-1 mr-4 flex-grow bg-transparent focus:outline-none w-full text-gray-800 dark:text-gray-200"/>
            <div className="flex items-center">
              <span className="mr-2 text-gray-400 dark:text-gray-500" onClick={handleRowClick}>
                {expanded ? <FaChevronUp size={13}/> : <FaChevronDown size={13}/>}
              </span>
            </div>
          </div>
        </div>
      </div>
      {expanded && (
        <div className="w-full">
          <div className="px-5 pb-5 text-sm w-full bg-white dark:bg-zinc-800">
            <div className="w-full">
                  {itemsData.map((item) => (
                    <ItemShare key={item.id} itemData={item} weightUnit={weightUnit}  />
                  ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(CategoryShare);
