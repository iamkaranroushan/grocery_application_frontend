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
import AddressNavbar from "@/components/address/addressNav";
import { Bottom_navbar } from "@/components/custom/bottom_navbar";
import AdminNavbar from "@/components/admin/adminNav";



const DashboardLayout = ({ children }) => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter(); // Using the useRouter hook
    const [loading, setLoading] = useState(false);

    const handleBack = () => {
        setLoading(true);
        router.back(); // Navigates to the previous page
    };

    const routeChange = (url) => {
        const currentUrl = window.location.pathname + window.location.search;
        if (url !== currentUrl) {
            setLoading(true);
            console.log(url);
            router.push(url, { scroll: false });
        }
    };
    useEffect(() => {
        setLoading(false); // Cleanup timer when the effect re-runs
    }, [pathname, searchParams]);

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
                            <AdminNavbar handleBack={handleBack} />
                            <main className="flex-grow justify-center w-screen  p-3">

                                {children}
                            </main>
                            <Bottom_navbar routeChange={routeChange} />
                        </>
                    )}
                </div>
            </PersistGate>
        </Provider>
    );
};

export default DashboardLayout;
