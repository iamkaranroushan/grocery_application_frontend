"use client";
import ProductNavbar from "@/components/product/productNavbar";
import UserNavbar from "@/components/user/usernav";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import { Provider } from "react-redux";
import { store, persistor } from "@/features/auth/authStore";
import { PersistGate } from "redux-persist/integration/react";
import OrderNavbar from "@/components/orders/orderNavbar";
import LoadingSpinner from "@/components/custom/loadingSpinner";

const UserLayout = ({ children }) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter(); // Using the useRouter hook
    const [loading, setLoading] = useState(false);

    const handleBack = () => {
        setLoading(true);
        router.back(); // Navigates to the previous page
    };
    useEffect(() => {
        setLoading(false);
    }, [searchParams, pathname]);

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <div className="flex flex-col items-center min-h-screen">
                    {/* Show loading spinner while loading */}
                    {loading ? (
                        <div className="flex h-[70vh] items-center justify-center">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <>
                            {/* Render the ProductNavbar and main content only when not loading */}
                            <OrderNavbar handleBack={handleBack} />
                            <main className="flex-grow justify-center w-screen  p-3">
                                {children}
                            </main>
                        </>
                    )}
                </div>
            </PersistGate>
        </Provider>
    );
};

export default UserLayout;
