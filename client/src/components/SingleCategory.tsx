import React, { useState, useEffect, useRef, useCallback} from 'react';
import { GrDrag } from 'react-icons/gr';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useSortable } from '@dnd-kit/sortable';
import { useMutation } from '@apollo/client';
import { CSS } from '@dnd-kit/utilities';
import { CategoryProps } from '../types/category';
import SingleItem from './SingleItem';
import { UPDATE_ITEM, DELETE_ITEM, ADD_ITEM } from '../mutations/itemMutation';
import { UPDATE_CATEGORY_NAME } from '../mutations/categoryMutations';
import { AddItemVariables, Item } from '../types/item';
import { FaPlus } from 'react-icons/fa';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { DndContext, closestCorners, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import DeleteCategoryModal from './popups/DeleteCategoryModal';
import Spinner from './loading/Spinner';
import { TiDelete } from "react-icons/ti";
import { GET_BAG } from '../queries/bagQueries';
import { useParams } from 'react-router-dom';


const SingleCategory: React.FC<CategoryProps> = ({ categoryData , weightUnit}) => {

  const { id } = useParams<{ id: string }>();

  const [expanded, setExpanded] = useState(true);
  const categoryNameRef = useRef<HTMLInputElement>(null);
  const [addItem, { loading: addingItem }] = useMutation<{ addItem: Item }, AddItemVariables>(ADD_ITEM);
  const [updateItem] = useMutation(UPDATE_ITEM);
  const [updateCategoryName] = useMutation(UPDATE_CATEGORY_NAME);
  const [deleteItem, { loading: deletingItem }] = useMutation(DELETE_ITEM); 
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [checkedItems, setCheckedItems] = useState<{ id: string, checked: boolean }[]>([]);

  const [itemsData, setItemsData] = useState<Item[]>([]);

  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } });
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } });
  const sensors = useSensors(mouseSensor, touchSensor);

  const buttonClass ='text-accent dark:text-gray-400 hover:text-accent rounded-full p-1 transform transition-transform duration-200 hover:scale-125';

  useEffect(() => {
    if (categoryData.items) {
      setItemsData(categoryData.items.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    }
  }, [categoryData]);


  const moveItem = async (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
  
    try {
      const updatedItems = [...itemsData];
      const [movedItem] = updatedItems.splice(fromIndex, 1);
      updatedItems.splice(toIndex, 0, movedItem);
  
      const reorderedItems = updatedItems.map((item, index) => ({
        ...item,
        order: index + 1,
      }));
  
      setItemsData(reorderedItems);
      await Promise.all(
        reorderedItems.map((item) =>
          updateItem({
            variables: { id: item.id, order: item.order },
            refetchQueries: [{ query: GET_BAG, variables: { id: id }}]
          })
        )
      );
    } catch (error) {
      console.error("Failed to move item:", error);
    }
  };
  
  const onDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const fromIndex = itemsData.findIndex((item) => item.id === active.id);
      const toIndex = itemsData.findIndex((item) => item.id === over?.id);
      moveItem(fromIndex, toIndex);
    }
   
  };
  

  const handleRowClick = () => {
    setExpanded(!expanded);
  };

  const handleDeleteClick = () => {
     setIsModalDeleteOpen(true)
  };

  const handleUpdateChecked = useCallback((id: string, checked: boolean) => {
    setCheckedItems((prevItems) => {
      if (checked) {
        return [...prevItems, { id, checked }];
      } else {
        return prevItems.filter((item) => item.id !== id);
      }
    });
  }, []);


  const handleAddItemSubmit = async () => {
    try {
      await addItem({
        variables: { tripId: categoryData.tripId, bagId: categoryData.bagId, categoryId: categoryData.id, name: '', qty: 1, weight: 0.1 },
        refetchQueries: [{ query: GET_BAG, variables: { id: id }}]});
      
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };



  const handleCategoryNameBlur = async () => {
    if (categoryNameRef.current && categoryNameRef.current.value !== categoryData.name) {
      try {

        await updateCategoryName({
          variables: { id: categoryData.id, name: categoryNameRef.current.value },
          refetchQueries: [{ query: GET_BAG, variables: { id: id }}]});
        
      } catch (error) {
        console.error('Error updating category name:', error);
      }
    }
  };


  const removeAllSelectedItems = async () => {
    try {
      await Promise.all(
        checkedItems.map(async (item) => {
          await deleteItem({ variables: { id: item.id },
          refetchQueries: [{ query: GET_BAG, variables: { id: id }}]});
        })
      );
      setCheckedItems([]); 
    } catch (error) {
      console.error("Error removing items:", error);
    }
  };


  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: categoryData.id });


  const style = { transform: CSS.Translate.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  

  return (
    <div className={`mb-2`} ref={setNodeRef} style={style}>
      <div className="cursor-pointer bg-white dark:bg-box  w-full rounded-t-lg">
        <div className="py-2.5 pl-2 pr-2 text-sm w-full">
          <div className="flex justify-between items-center w-full">
            <GrDrag className="mr-2 text-accent dark:text-gray-400 no-outline cursor-grabbing" size={16} {...attributes} {...listeners} />
            <input
              type="text"
              defaultValue={categoryData.name}
              placeholder='e.g., Clothes'
              ref={categoryNameRef}
              onBlur={handleCategoryNameBlur}
              className="border-b border-neutral-200 dark:border-neutral-600 px-2 py-1 mr-4 flex-grow bg-transparent focus:outline-none focus:ring-1 focus:ring-button-lightGreen rounded w-full text-gray-800 dark:text-gray-200"
            />
            <div className="flex items-center">
              <span className="mr-2 text-gray-400 dark:text-gray-500" onClick={handleRowClick}>
                {expanded ? <FaChevronUp size={14}/> : <FaChevronDown size={14}/>}
              </span>
              <button type="button" className='' onClick={handleDeleteClick}>
              <TiDelete className={buttonClass} size={32}  />
              </button>
            </div>
          </div>
        </div>
      </div>
      {expanded && (
          <div className="px-5 text-sm  bg-white dark:bg-box rounded-b-lg">
              <DndContext collisionDetection={closestCorners} onDragEnd={onDragEnd} sensors={sensors} id="builder-dnd">
                <SortableContext items={itemsData.map((item) => item.id) || []} strategy={verticalListSortingStrategy}>
                  {itemsData.map((item, index) => (
                    <SingleItem key={item.id} itemData={item} sendChecked={handleUpdateChecked} weightUnit={weightUnit} index={index} />
                  ))}
                </SortableContext>
              </DndContext>
           
           {checkedItems.length ? <button className="flex items-center pt-3 pb-3 text-button-red hover:text-accent focus:outline-none" onClick={removeAllSelectedItems}>
              <TiDelete className="mr-1" size={19} />
              Delete items { deletingItem ? <Spinner h={4} w={4}/> : null }
            </button> :
            <button className="flex items-center pt-3 pb-3 text-primary hover:text-accent dark:hover:text-primary dark:text-button-lightGreen focus:outline-none" onClick={handleAddItemSubmit}>
              <FaPlus className="mr-1" size={14} />
              Add item {addingItem ? <Spinner h={4} w={4}/> : null }
            </button> }
          </div>
        
      )}

      <DeleteCategoryModal isOpen={isModalDeleteOpen} categoryId={categoryData.id} categoryName={categoryData.name} onClose={() => setIsModalDeleteOpen(false)}  />

    </div>
  );
};

export default React.memo(SingleCategory);
