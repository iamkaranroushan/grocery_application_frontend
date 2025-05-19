'use client'
import React, { useEffect, useState } from 'react'
import CartWithoutProduct from './cartWithoutProduct';
import CartProductCard from './cartProductCard';
import useCart from '@/hooks/useCart';
import { MoonLoader } from 'react-spinners';
import { Button } from '../ui/button';
import { IoIosArrowDropright } from 'react-icons/io';
import { FaRupeeSign } from 'react-icons/fa';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const MainCart = ({ token, setIsLoginOpen }) => {
    const { cartItems, loading, error, refetch } = useCart();
    const [routeLoading, setRouteLoading] = useState(false);

    console.log(cartItems);
    console.log(token);

    const pathname = usePathname();

    const searchParams = useSearchParams();
    const router = useRouter();

    const handleCheckOut = (url) => {
        const currentUrl = window.location.pathname + window.location.search;
        if (url !== currentUrl) {
            setRouteLoading(true);
            console.log(url);
            router.push(url, { scroll: false });
        }
    };
    useEffect(() => {
        setRouteLoading(false); // Cleanup timer when the effect re-runs
    }, [pathname, searchParams]);

    if (routeLoading) {
        return (<div className="flex flex-col h-[70vh] items-center justify-center">
            <MoonLoader color="#3a3a3a" size={50} speedMultiplier={1} />
            <p>Preparing the order ...</p>
        </div>)
    }
    if (loading) {
        return (<div className="flex flex-col h-[70vh] items-center justify-center">
            <MoonLoader color="#3a3a3a" size={50} speedMultiplier={1} />
            <p>Loading cart items ...</p>
        </div>)
    }
    if (cartItems && cartItems.length === 0) {
        return <CartWithoutProduct />
    }
    return (
        <>
            {cartItems &&
                <div className='flex flex-col '>
                    <div className='flex flex-col gap-2 mb-16 max-w-3xl mx-auto '>
                        {cartItems.length > 0 &&
                            cartItems.map((product) => (
                                <CartProductCard refetchCartItems={refetch} token={token} setIsLoginOpen={setIsLoginOpen} key={product.id} product={product} />
                            ))}
                    </div>
                    <div className='fixed bottom-0 left-0 w-full p-3 bg-white'>
                        <Button onClick={() => handleCheckOut('/checkout')} className="flex items-center justify-center max-w-[500px]" variant="order" size="order" >
                            Checkout
                        </Button>
                    </div>
                </div>
            }
        </>
    )
}

export default MainCart