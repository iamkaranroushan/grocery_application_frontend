import React, { useEffect } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '../ui/button';
import Input from './input';
import useCreateAddress from '@/hooks/useAddress';
import { useSelector } from 'react-redux';
import useUpdateAddress from '@/hooks/useUpdateAddress';


const AddressFormComponent = ({ className, onClose, fetchAddressesByUser, existingAddress = null, }) => {
    const { createAddress, loading, error } = useCreateAddress(); // 🎣 Get the hook
    const userId = useSelector((state) => state.auth?.id || null);
    const username = useSelector((state) => state.auth?.user || null);
    const { updateAddress } = useUpdateAddress();
    const schema = z.object({
        streetAddress: z.string().min(5, "Street Address is too short"),
        city: z.string().min(2, "City name is too short"),
        state: z.string().min(2, "State name is too short"),
        postalCode: z.string().regex(/^\d{5,6}$/, "Invalid Postal Code"),
        landmark: z.string().optional(),
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: existingAddress
            ? {
                ...existingAddress,
                postalCode: existingAddress.zipCode || existingAddress.postalCode || "",
            }
            : {
                streetAddress: "",
                city: "",
                state: "",
                postalCode: "",
                landmark: "",
            }
    });

    useEffect(() => {
        if (existingAddress) {
            console.log(existingAddress)
            reset(existingAddress);

        } else {
            reset({});
        }
    }, [existingAddress, reset]);

    const onSubmit = async (data) => {
        console.log(userId)
        console.log(username)

        if (!userId) return alert("User ID is required!");

        const addressData = {
            ...data,
            userId: parseInt(userId), // Ensure it's a number
        };

        let response;
        if (existingAddress && existingAddress.id) {
            // Update existing address
            response = await updateAddress(existingAddress.id, addressData);
        } else {
            // Create new address
            response = await createAddress(addressData);
        }

        if (response) {
            reset();
            fetchAddressesByUser(userId);
            onClose();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={className}>
            <div className="flex flex-col gap-4">
                {[
                    { name: "streetAddress", label: "Street address", placeholder: "Danapur, cantt road, opposite of golamber" },
                    { name: "landmark", label: "Landmark", placeholder: "Opposite of Kalyan Jewellers" },
                    { name: "city", label: "City", placeholder: "Bihar" },
                    { name: "state", label: "State", placeholder: "Patna" },
                    { name: "postalCode", label: "Pin code", placeholder: "811215" },
                ].map(({ name, label, placeholder, type = "text" }) => (
                    <div key={name} className="flex flex-col space-y-2">
                        <Controller
                            name={name}
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    label={label}
                                    placeholder={placeholder}
                                    type={type}
                                    className="p-4 placeholder:text-sm placeholder:text-stone-400 rounded-lg border focus:border-stone-400 focus:outline-none"
                                />
                            )}
                        />
                        {errors[name] && (
                            <p className="text-sm text-red-500">{errors[name].message}</p>
                        )}
                    </div>
                ))}

                <Button variant="address" size="address" disabled={loading}>
                    {loading ? (existingAddress ? "Updating..." : "Creating...") : (existingAddress ? "Update Address" : "Create Address")}
                </Button>
                {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
        </form>
    );
};

export default AddressFormComponent;
