'use client'
import Layout from '@/components/custom/layout';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';

const Edit = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleNavigate = (url) => {
    const currentUrl = window.location.pathname + window.location.search;
    if (url !== currentUrl) {
      setLoading(true);
      console.log(url);
      router.push(url, { scroll: false });
    }
  };
  useEffect(() => {
    setLoading(false);
  }, [searchParams, pathname]);

  return (
    <Layout>
      <div className='relative w-full'>
        {/* Main Content */}
        <div className={`flex flex-col w-screen justify-between items-center p-3 gap-3 ${loading ? 'opacity-30 pointer-events-none' : ''}`}>
          <div onClick={()=>handleNavigate('/admin/edit/categories')} className='hover:shadow-lg hover:scale-[1.01] cursor-pointer transition-all duration-200 flex flex-col items-center justify-center w-full rounded-lg h-40 bg-gradient-to-br from-white to-stone-300'>
            <span className='text-3xl font-bold'>Categories</span>
          </div>
          <div onClick={()=>handleNavigate('/admin/edit/subCategories')} className='hover:shadow-lg hover:scale-[1.01] cursor-pointer transition-all duration-200 flex flex-col items-center justify-center w-full rounded-lg h-40 bg-gradient-to-br from-white to-stone-300'>
            <span className='text-3xl font-bold'>Subcategories</span>
          </div>
          <div onClick={()=>handleNavigate('/admin/edit/products')} className='hover:shadow-lg hover:scale-[1.01] cursor-pointer transition-all duration-200 flex flex-col items-center justify-center w-full rounded-lg h-40 bg-gradient-to-br from-white to-stone-300'>
            <span className='text-3xl font-bold'>Products</span>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 flex justify-center items-center bg-white/60 z-50">
            <ClipLoader size={50} color="#4b5563" />
          </div>
        )}
      </div>
    </Layout>
  );
};


export default Edit;