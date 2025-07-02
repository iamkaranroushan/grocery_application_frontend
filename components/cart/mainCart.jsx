'use client'
import React, { useEffect, useState, useMemo } from 'react'
import CartWithoutProduct from './cartWithoutProduct'
import CartProductCard from './cartProductCard'
import useCart from '@/hooks/useCart'
import { MoonLoader } from 'react-spinners'
import { Button } from '../ui/button'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'

const CartSummary = ({ formattedTotal, onCheckout }) => (
    <>
        <div className="flex justify-between font-semibold text-sm mb-2">
            <span className="lg:text-[16px] text-stone-700">Subtotal</span>
            <span className="lg:text-lg text-stone-700">{formattedTotal}</span>
        </div>
        <div className="flex justify-between font-semibold text-sm mb-2">
            <span className="lg:text-[16px] text-stone-700">Shipping</span>
            <span className="lg:text-lg text-stone-700">Free</span>
        </div>
        <div className="flex justify-between font-semibold text-base mt-4 border-t pt-4">
            <span className="lg:text-[16px] text-stone-700">Total</span>
            <span className="lg:text-lg text-stone-700">{formattedTotal}</span>
        </div>
        <Button onClick={onCheckout} className="w-full mt-6" variant="order" size="order">
            Checkout
        </Button>
    </>
)

const MainCart = ({ token, setIsLoginOpen }) => {
    const { cartItems, loading, error, refetch } = useCart()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    const [isExpanded, setIsExpanded] = useState(false)
    const [routeLoading, setRouteLoading] = useState(false)

    const handleCheckOut = (url) => {
        const currentUrl = window.location.pathname + window.location.search
        if (url !== currentUrl) {
            setRouteLoading(true)
            router.push(url, { scroll: false })
        }
    }

    useEffect(() => {
        setRouteLoading(false)
    }, [pathname, searchParams])

    const itemTotal = useMemo(() => {
        return cartItems?.reduce((sum, item) => {
            return sum + (item?.productVariant?.price || 0) * (item?.quantity || 0)
        }, 0) || 0
    }, [cartItems])

    const formattedTotal = useMemo(() => {
        try {
            return itemTotal.toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
            })
        } catch {
            return `₹${itemTotal}`
        }
    }, [itemTotal])

    if (routeLoading || loading) {
        return (
            <div className="flex flex-col h-[70vh] items-center justify-center">
                <MoonLoader color="#3a3a3a" size={50} speedMultiplier={1} />
                <p>{routeLoading ? 'Preparing the order ...' : 'Loading cart items ...'}</p>
            </div>
        )
    }

    if (!cartItems || cartItems.length === 0) {
        return <CartWithoutProduct />
    }

    return (
        <div className="flex flex-col h-[100dvh] lg:h-auto">
            {/* Scrollable Cart Section */}
            <div className="flex-1 overflow-y-auto px-4 lg:pt-6 pb-36 lg:pb-8 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-[2fr_1px_1fr] gap-8">
                    {/* Cart Items */}
                    <div className="lg:space-y-6">
                        <h2 className="text-3xl font-semibold mb-4 hidden lg:block">Shopping Bag</h2>
                        {cartItems.map((product) => (
                            <CartProductCard
                                key={product.id}
                                refetchCartItems={refetch}
                                token={token}
                                setIsLoginOpen={setIsLoginOpen}
                                product={product}
                            />
                        ))}
                    </div>

                    {/* Vertical Divider */}
                    <div className="hidden lg:block h-full bg-stone-300 w-[1px] mx-auto" />

                    {/* Right Order Summary (Desktop) */}
                    <div className="hidden  lg:block relative">
                        <div className="fixed top-20 bg-white p-6 w-[450px] ">
                            <h3 className="text-2xl lg:text-3xl font-semibold mb-10">Order Summary</h3>
                            <CartSummary
                                formattedTotal={formattedTotal}
                                onCheckout={() => handleCheckOut('/checkout')}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Checkout Summary (Mobile) */}
            <div className="fixed bottom-0 left-0 right-0 lg:hidden z-50">
                <div
                    className="flex justify-between items-center bg-white border-t px-4 py-6 shadow-md"
                    onClick={() => setIsExpanded((prev) => !prev)}
                >
                    <div className="flex items-center">
                        <span className="text-base font-medium">Total:</span>
                        <span className="text-base font-semibold ml-2">{formattedTotal}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold">Summary</span>
                        {isExpanded ? <IoIosArrowUp size={20} /> : <IoIosArrowDown size={20} />}
                    </div>
                </div>

                <div
                    className={`bg-white transition-all duration-300 overflow-hidden px-4 ${isExpanded ? 'max-h-[200px] py-4' : 'max-h-0 py-0'
                        }`}
                >
                    <CartSummary
                        formattedTotal={formattedTotal}
                        onCheckout={() => handleCheckOut('/checkout')}
                    />
                    <div className="h-4" /> {/* Spacer for padding-bottom */}
                </div>
            </div>
        </div>
    )
}

export default MainCart
