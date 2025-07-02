import React from 'react'
import { Button } from '../ui/button'
import { FiShoppingCart } from 'react-icons/fi'

const CartWithoutLogin = ({ setIsLoginOpen, loading }) => {


    return (
        <div className={`flex flex-col justify-center items-center h-[70vh] gap-3`}>
            <div className="bg-stone-100 rounded-full p-6 mb-6">
                <FiShoppingCart className="text-5xl text-stone-500" />
            </div>
            <div className='flex flex-col justify-center items-center w-50 '>
                <h2 className="text-xl font-semibold mb-2">Your Bag is Empty</h2>
                <p className="text-stone-600 mb-6 max-w-md">
                    Looks like you haven’t logged in yet.
                </p>
                <Button
                    variant="login2"
                    size="login2"
                    onClick={() => setIsLoginOpen(true)}
                >
                    Login
                </Button>
            </div>
        </div>
    )
}

export default CartWithoutLogin