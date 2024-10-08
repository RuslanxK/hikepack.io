import React, { useEffect, useState } from 'react';
import { FaPlus, FaHeart } from 'react-icons/fa';
import { UPDATE_BAG } from '../mutations/bagMutations';
import { GET_BAG } from '../queries/bagQueries';
import { ADD_CATEGORY, UPDATE_CATEGORY_ORDER } from '../mutations/categoryMutations';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Category } from '../types/category';
import SingleCategory from './SingleCategory';
import { DndContext, closestCenter,  MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { getRandomDarkColor } from '../utils/color';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import CategoryChart from './chart/CategoryChart';
import CategoryTable from './chart/CategoryTable';
import { IoMdShare } from "react-icons/io";
import { AiFillEdit } from "react-icons/ai";
import UpdateBagModal from './popups/UpdateBagModal';
import SidePanel from './sidepanel/SidePanel';
import Message from './message/Message';
import { FaArrowLeft } from 'react-icons/fa';
import Spinner from './loading/Spinner';
import { GET_USER } from '../queries/userQueries';

ChartJS.register(ArcElement, Tooltip, Legend);

const BagDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const buttonClass = 'ml-2 text-white bg-button hover:bg-button-hover hover:text-white focus:ring-4 focus:outline-none focus:ring-orange-300 rounded-full p-1.5 dark:focus:ring-orange-800 dark:hover:bg-button-hover';

  const { data: dataBag, loading: loadingBag, error: errorBag } = useQuery(GET_BAG, { variables: { id } });
  const { loading: loadingUser, error: errorUser, data: userData } = useQuery(GET_USER);


  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } });
  const sensors = useSensors(mouseSensor, touchSensor);


  const [updateBag] = useMutation(UPDATE_BAG);
  const [addCategory, {loading: addingCategory }] = useMutation(ADD_CATEGORY);
  const [updateCategoryOrder] = useMutation(UPDATE_CATEGORY_ORDER);

  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [isSidePanelVisible, setIsSidePanelVisible] = useState( window.matchMedia('(max-width: 767px)').matches ? false : true); 

  useEffect(() => {
    if (dataBag?.bag?.categories) {
      setCategoriesData(dataBag.bag?.categories?.slice().sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)));
    }
  }, [dataBag?.bag?.categories]);

  useEffect(() => {
    if (!loadingBag && !dataBag?.bag) {
      navigate('/404');
    }
  }, [loadingBag, dataBag, navigate]);


  const bag = dataBag?.bag;

  useEffect(() => {
    if (dataBag?.bag?.categories) {
      const hasItems = dataBag.bag.categories.some((category: Category) => category.items.length > 0);
  
      if (!hasItems && bag?.exploreBags) {
        const updateExploreBags = async () => {
          try {
            await updateBag({
              variables: {
                bagId: id,
                exploreBags: false, 
              },
              refetchQueries: [{ query: GET_BAG, variables: { id } }],
            });
            console.log('Bag exploreBags set to false due to no items.');
          } catch (error) {
            console.error('Error updating bag:', error);
          }
        };
  
        updateExploreBags();
      }
    }
  }, [dataBag?.bag?.categories, bag?.exploreBags, id, updateBag]);



  if (loadingBag || loadingUser) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <Spinner w={10} h={10} />
      </div>
    );
  }

  if (errorUser || errorBag) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <Message 
          width="w-fit" 
          title="Attention Needed" 
          padding="sm:p-5 p-3" 
          titleMarginBottom="mb-2" 
          message="Something went wrong. Please try again later." 
          type="error" 
        />
      </div>
    );
  }


  const handleAddCategory = async () => {
    try {
      const newColor = getRandomDarkColor(categoriesData.map((category) => category.color));

      await addCategory({
        variables: { tripId: bag.tripId, bagId: id, name: 'new category', color: newColor },
        refetchQueries: [{ query: GET_BAG, variables: { id: id } }],
      });
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleToggleShareToExplore = async () => {

    try {
      await updateBag({
        variables: {
          bagId: id,
          exploreBags: !bag.exploreBags,
        },
        refetchQueries: [{ query: GET_BAG, variables: { id } }],
      });
    } catch (error) {
      console.error('Error updating bag:', error);
    }
  };


  const moveCategory = async (fromIndex: number, toIndex: number) => {
    try {
      const updatedCategories = [...categoriesData];
      const [movedCategory] = updatedCategories.splice(fromIndex, 1);
      updatedCategories.splice(toIndex, 0, movedCategory);

      const reorderedCategories = updatedCategories.map((category, index) => ({
        ...category,
        order: index + 1,
      }));

      setCategoriesData(reorderedCategories);
      await Promise.all(
        reorderedCategories.map((category) =>
          updateCategoryOrder({
            variables: { id: category.id, order: category.order },
            
          })
        )
      );
    } catch (error) {
      console.error("Failed to move category:", error);
    }
  };


  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const fromIndex = categoriesData.findIndex(
        (category) => category.id === active.id
      );
      const toIndex = categoriesData.findIndex(
        (category) => category.id === over.id
      );
      moveCategory(fromIndex, toIndex);
    }
  };

  const handleUpdateBag = () => {
    setIsModalUpdateOpen(true)
  }

  const toggleSidePanel = () => {
    setIsSidePanelVisible(!isSidePanelVisible);
  };

  const hasCategoriesWithWeight = categoriesData.some(category => category.totalWeight > 0);

  return (
    <div className='container mx-auto sm:mt-0 sm:p-4 mt-24 p-4'>
      <div className={`flex flex-col sm:flex-row items-start min-h-screen ${isSidePanelVisible && dataBag.bag.allItems.length ? 'sm:mr-56' : 'mr-0'}`}>
        <div className="w-full mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 w-full">
            <div className='w-full sm:pl-6 sm:pr-6 sm:pt-6 pr-2 pt-2 pl-2'>
              <div className='flex flex-row sm:flex-row items-start'>
                <div className='w-full w-8/12'>
                  <div className="flex items-center w-full sm:w-11/12">
                    <button 
                      type="button" 
                      className="mr-4 text-gray-500 dark:text-gray-100 bg-gray-200 dark:bg-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-500 p-2 rounded-full hover:shadow-sm"  
                      onClick={() => navigate(-1)}>
                      <FaArrowLeft size={17} />
                    </button>
                    <h1 className='text-xl font-semibold text-gray-900 dark:text-white'>
                      {bag.name}
                    </h1>
                  </div>
                </div>
                <div className='w-fit sm:w-4/12 flex flex-row items-center justify-end'>
             { bag.categories.some((category: Category) => category.items.length > 0) ? <label className="inline-flex flex-row items-center justify-center cursor-pointer mr-0 sm:mr-5 sm:flex fixed bottom-0 p-2 sm:p-0 right-0 z-40 w-full sm:w-48 sm:static bg-gray-100 sm:bg-transparent sm:dark:bg-transparent dark:bg-theme-dark">
              <input
                type="checkbox"
                checked={bag?.exploreBags}
                onChange={handleToggleShareToExplore}
                className="sr-only peer"
                  />
             <span className="mr-3 dark:text-white">Share to explore</span>
            <div className="relative w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-400 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-400"></div>
            </label> : null }
                  <button type="button" className={buttonClass} onClick={() => window.open(`/share/${bag.id}`, '_blank')}>
                    <IoMdShare size={19} />
                  </button>
                  <button type="button" className={buttonClass} onClick={handleUpdateBag}>
                    <AiFillEdit size={19} />
                  </button>
                </div>
              </div>
              <p className="text-base text-gray-700 dark:text-gray-200 p-5 dark:bg-theme-bgDark">
                {bag?.description}
              </p>
            </div>
          </div>
          
          {categoriesData.length > 0 && hasCategoriesWithWeight && (
            <div className="w-full flex flex-col sm:flex-row items-center py-10 justify-center sm:space-x-12 space-y-8 sm:space-y-0">
              <div className="flex justify-center items-center">
                <div className="flex items-center space-x-2 p-3 rounded-full">
                  <FaHeart size={20} className="text-red-500 animate-pulse" />
                  <div className="flex flex-col items-center">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {bag?.likes || 0}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {bag?.likes === 1 ? 'Like' : 'Likes'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="sm:w-64 h-64">
                <CategoryChart categories={dataBag?.bag?.categories} weightUnit={userData?.user?.weightOption} />
              </div>
              <div className='w-full sm:w-fit'>
                <CategoryTable categories={dataBag?.bag?.categories} weightUnit={userData?.user?.weightOption} />
              </div>
            </div>
          )}
        
            <button onClick={handleAddCategory} className="mt-5 mb-4 w-full py-4 border-2 border-dashed border-gray-400 dark:border-gray-400 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:border-primary dark:hover:border-primary transition-colors duration-300 ease-in-out">
              <FaPlus size={13} /> { addingCategory ? <Spinner w={4} h={4}/> : null }
            </button>
            <div className="w-full pb-14">
              {categoriesData.length === 0 ?  <Message title="Attention Needed" padding="sm:p-5 p-3" width="w-full" titleMarginBottom="mb-2" message="click on the plus icon to add a category." type="info" /> : null }

              <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd} sensors={sensors} id="builder-dnd">
                <SortableContext items={categoriesData.map((category) => category.id)} strategy={verticalListSortingStrategy}>
                  {categoriesData.map((category) => (
                    <SingleCategory key={category.id} categoryData={category} weightUnit={userData?.user?.weightOption}/>
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </div>
      
        {dataBag?.bag?.allItems?.length ? <SidePanel isVisible={isSidePanelVisible} toggleVisibility={toggleSidePanel} categories={categoriesData} items={dataBag?.bag?.allItems}  /> : null}
        <UpdateBagModal isOpen={isModalUpdateOpen} onClose={() => setIsModalUpdateOpen(false)} bag={bag} weightUnit={userData?.user?.weightOption} />
      </div>
    </div>
  );
}

export default BagDetails;
