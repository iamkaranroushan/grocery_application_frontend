'use client'
import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { FiShoppingCart } from 'react-icons/fi'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const CartWithoutProduct = () => {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();

    const searchParams = useSearchParams();
    const Router = useRouter();

    const routeChange = (url) => {
        const currentUrl = window.location.pathname + window.location.search;
        if (url !== currentUrl) {
            setLoading(true);
            console.log(url);
            Router.push(url, { scroll: false });
        }
    };
    useEffect(() => {
        setLoading(false); // Cleanup timer when the effect re-runs
    }, [pathname, searchParams]);



    return (
        <div className={`flex flex-col justify-center items-center h-[70vh] gap-3`}>
            <div className=''>
                <FiShoppingCart className='text-4xl' />
            </div>
            <div className='flex flex-col justify-center items-center w-50 gap-2'>
                <p className='font-bold'>Your cart is empty</p>
                <button onClick={() => routeChange('/categories')} className='text-semibold text-stone-600 active:underline'>keep shopping</button>
            </div>
        </div>
    )
}

export default CartWithoutProduct