'use client'
import React, { useState } from 'react'
import { Button } from '../ui/button'

const CheckOutBottom = ({handleOrder, isCartEmpty}) => {
    const [paymentMethod, setPaymentMethod] = useState("COD");
    return (
        <div className="flex flex-col bg-white gap-3">
            {/* Payment Method Selection */}
            <h2 className="lg:font-semibold text-[16px] lg:text-lg text-stone-700  mb-2">Select Mode of Payment</h2>
            <div className="flex flex-col border p-3 rounded-lg gap-3">
                {/* Cash on Delivery Option */}
                <label
                    className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer ${paymentMethod === "COD" ? "border-stone-900 bg-stone-200" : "border-gray-300"
                        }`}
                >
                    <input
                        type="radio"
                        name="payment"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="hidden" // Hides default radio button
                    />
                    <span
                        className={`w-4 h-4 flex items-center justify-center border rounded-full ${paymentMethod === "COD" ? "bg-stone-900 border-stone-900" : "border-gray-400"
                            }`}
                    >
                        {paymentMethod === "COD" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </span>
                    <p>Cash on Delivery</p>
                </label>
                {/* UPI Payment Option */}
                <label
                    className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer ${paymentMethod === "UPI" ? "border-stone-900 bg-stone-200" : "border-gray-300"
                        }`}
                >
                    <input
                        type="radio"
                        disabled={true}
                        name="payment"
                        value="UPI"
                        checked={paymentMethod === "UPI"}
                        onChange={() => setPaymentMethod("UPI")}
                        className="hidden" // Hides default radio button
                    />
                    <span
                        className={`w-4 h-4 flex items-center justify-center border rounded-full ${paymentMethod === "UPI" ? "border-stone-900 bg-stone-900 " : "border-gray-400"
                            }`}
                    >
                        {paymentMethod === "UPI" && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </span>
                    <p className='text-stone-500'>UPI (not available right now)</p>
                </label>
            </div>
            <span className="">
                <Button disabled={isCartEmpty}  onClick={()=>{handleOrder(paymentMethod)}} variant="order" size="order" >{paymentMethod === "COD" ? "Place order" : "Proceed to pay"}</Button>
            </span>
        </div>
    )
}

export default CheckOutBottom