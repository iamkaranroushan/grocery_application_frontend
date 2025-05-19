'use client';
import { useState } from 'react';
import useCategories from '@/hooks/useCategories';
import { MdOutlineExpandMore, MdOutlineExpandLess } from 'react-icons/md';
import EditProductList from '@/components/edit/editProductList';
import CreateProductForm from '@/components/edit/createProductForm'; // Assuming it's here
import { Button } from '@/components/ui/button';
import { RxCross2 } from 'react-icons/rx';

const EditProductPage = () => {
  const { categories } = useCategories();
  const [expandedSubId, setExpandedSubId] = useState(null);
  const [showFormMap, setShowFormMap] = useState({});

  const subCategories = categories.flatMap(category =>
    category.subCategories?.map(sub => ({
      ...sub,
      parentCategoryName: category.name,
      parentCategoryId: category.id,
    })) || []
  );

  const handleToggle = (id) => {
    setExpandedSubId(prev => (prev === id ? null : id));
  };


  const toggleCreateForm = (subId) => {
    setShowFormMap(prev => ({
      ...prev,
      [subId]: !prev[subId]
    }));
  };


  return (
    <div className='flex flex-col justify-center p-3 mt-12'>
      <div className='grid gap-4'>
        {subCategories.map(sub => (
          <div key={sub.id} className='border-b'>
            <div className='py-4 flex justify-between items-center' onClick={() => handleToggle(sub.id)}>

              <div className='flex items-center gap-4'>
                <img
                  src={sub.imageUrl}
                  alt={sub.name}
                  className='w-12 h-12 object-cover rounded-full'
                />
                <div>
                  <p className='font-semibold'>{sub.name}</p>
                  <p className='text-xs text-gray-500'>in {sub.parentCategoryName}</p>
                </div>
              </div>
              {/*expand more or less icons toggles product display*/}
              <div
                className='flex gap-3 text-xl cursor-pointer'
              >
                {expandedSubId === sub.id ? <MdOutlineExpandLess /> : <MdOutlineExpandMore />}
              </div>
            </div>
            {/*If expanded  show the products */}
            {expandedSubId === sub.id && (
              <div className=" flex flex-col justify-center">

                {/**button which triggers the createProduct form*/}
                {showFormMap[sub.id] ? (
                  <div className='flex justify-end mb-4'>
                    <RxCross2
                      className='text-2xl cursor-pointer text-gray-600 hover:text-red-500 transition'
                      onClick={() => toggleCreateForm(sub.id)}
                    />
                  </div>
                ) : (
                  <Button
                    onClick={() => toggleCreateForm(sub.id)}
                    className='mb-4 p-6'
                  >
                    Create Product
                  </Button>
                )}
                {/*createProduct form here*/}
                {showFormMap[sub.id] && (
                  <CreateProductForm
                    subcategoryId={sub.id}
                    onCreateProduct={(data) => {
                      console.log("🛠 Creating product for:", sub.id, data);
                      // 🔧 Hook up your actual product creation here
                    }}
                  />
                )}
                <EditProductList
                  categoryId={sub.id}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditProductPage;
