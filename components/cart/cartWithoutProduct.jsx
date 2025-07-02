'use client'
import React, { useState, useEffect } from 'react'
import { FiShoppingCart } from 'react-icons/fi'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const CartWithoutProduct = () => {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const routeChange = (url) => {
        const currentUrl = window.location.pathname + window.location.search;
        if (url !== currentUrl) {
            setLoading(true);
            router.push(url, { scroll: false });
        }
    };

    useEffect(() => {
        setLoading(false);
    }, [pathname, searchParams]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
            <div className="bg-stone-100 rounded-full p-6 mb-6">
                <FiShoppingCart className="text-5xl text-stone-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your Bag is Empty</h2>
            <p className="text-stone-600 mb-6 max-w-md">
                Looks like you haven’t added anything to your bag yet.
            </p>
            <button
                onClick={() => routeChange('/categories')}
                className="bg-black text-white px-6 py-3 text-sm font-medium tracking-wide hover:bg-stone-800 transition rounded-full"
            >
                Keep Shopping
            </button>
        </div>
    );
};

export default CartWithoutProduct;
