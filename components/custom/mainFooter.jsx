'use client'
import React, { useEffect, useState } from 'react'
import { FcLike } from "react-icons/fc";
import Input from './input';
import { FaRegCopyright } from 'react-icons/fa';
import { Button } from '../ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from './loadingSpinner';
const MainFooter = () => {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const routeChange = (url) => {
        const currentUrl = window.location.pathname + window.location.search;
        if (url !== currentUrl) {
            setLoading(true);
            console.log(url);
            router.push(url, { scroll: false });
        }
    };
    useEffect(() => {
        setLoading(false); // Cleanup timer when the effect re-runs
    }, [pathname, searchParams]);

    return (
        <div>


            {loading &&
                <div className="fixed inset-0 w-screen flex items-center justify-center  bg-white bg-opacity-60 ">
                    <LoadingSpinner />
                </div>
            }
            <div className='flex flex-col flex-wrap p-3 bg-black '>
                <div className='flex flex-col text-white font-semibold mb-4'>
                    <span className='mb-2'>Easy Grocery</span>
                    <div className='flex flex-col'>
                        <span className='text-gray-500 text-sm'>Delivering fresh groceries to your door with quality you can trust.</span>
                    </div>
                </div>
                <div className='flex flex-col text-white font-semibold mb-4'>
                    <span className='mb-2'>Quick links</span>
                    <div className='flex flex-col'>
                        <span onClick={() => { routeChange('/') }} className='text-gray-500 text-sm cursor-pointer'>Home</span>
                        <span onClick={() => { routeChange('/about') }} className='text-gray-500 text-sm cursor-pointer'>about us</span>
                        <span onClick={() => { routeChange('/support') }} className='text-gray-500 text-sm cursor-pointer'>contact us</span>
                        <span onClick={() => { routeChange('/orders') }} className='text-gray-500 text-sm cursor-pointer'>orders</span>
                        <span onClick={() => { routeChange('/cart') }} className='text-gray-500 text-sm cursor-pointer'>cart</span>
                    </div>
                </div>

                <div className='flex justify-between items-end mb-4'>
                    <span className='text-white/30 text-5xl font-bold'>
                        HAPPY SHOPPING
                    </span>
                    <span className='text-5xl opacity-50 p-2'><FcLike /></span>
                </div>
                <div className='flex items-center justify-center'>

                    <span className='text-gray-500 text-xs'>© {new Date().getFullYear()} Easy Grocery. All rights reserved</span>
                </div>
            </div>
        </div>
    )
}

export default MainFooter


{/*
    <div className='flex flex-col text-white font-semibold mb-4'>
                <span className='mb-2' >subscribe</span>
                <span className='text-gray-500 text-sm mb-2' >Get updates on new products and offers.</span>
                <div className='flex justify-around items-center'>
                    <Input
                        type="text"
                        placeholder="email"
                        className="p-3 placeholder:text-sm placeholder:text-stone-400 rounded-lg border focus:border-stone-400 focus:outline-none"
                    />
                    <Button variant='subscribe' size='subscribe'>Subscribe</Button>
                </div>
            </div>
             */}