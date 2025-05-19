import React from 'react'
import { Button } from '../ui/button'
import { FiShoppingCart } from 'react-icons/fi'

const CartWithoutLogin = ({ setIsLoginOpen, loading }) => {


    return (
        <div className={`flex flex-col justify-center items-center h-[70vh] gap-3`}>
            <div className=''>
                <FiShoppingCart className='text-4xl' />
            </div>
            <div className='flex flex-col justify-center items-center w-50 gap-3'>
                <p className='font-bold'>Log in to see your cart</p>
                <Button className='w-full' onClick={() => setIsLoginOpen(true)}>
                    Login
                </Button>
            </div>
        </div>
    )
}

export default CartWithoutLogin