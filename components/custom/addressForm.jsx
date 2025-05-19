
import React from 'react'
import { RxCross1 } from 'react-icons/rx'
import AddressFormComponent from './addressFormComponent'
import { useSelector } from 'react-redux';

const AddressForm = ({ onClose, setIsAddressFormOpened, fetchAddressesByUser, existingAddress }) => {
    return (
        <div className='flex-col fixed inset-0 flex p-6 bg-stone-100 overflow-y-auto rounded-t-xl z-50  '>
            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-semibold text-stone-700">Address details</h1>
                <span
                    onClick={onClose}
                    className="text-sm text-stone-600 hover:underline"
                >
                    <RxCross1 className="text-xl" />
                </span>
            </div>
            <AddressFormComponent existingAddress={existingAddress} fetchAddressesByUser={fetchAddressesByUser} onClose={onClose} />
        </div>
    )
}

export default AddressForm