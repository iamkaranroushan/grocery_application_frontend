"use client";
import Login from "@/components/custom/login";
import ProductNavbar from "@/components/product/productNavbar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import { Provider } from "react-redux";
import { store, persistor } from "@/features/auth/authStore";
import { PersistGate } from "redux-persist/integration/react";
import MainFooter from "@/components/custom/mainFooter";

const ProductLayout = ({ children }) => {
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
    setLoading(false);
  }, [searchParams, pathname]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="flex flex-col items-center min-h-screen">
          {/* Show loading spinner while loading */}
          {/* Render the ProductNavbar and main content only when not loading */}
          <ProductNavbar handleBack={handleBack} routeChange={routeChange} />

          {loading ? (
            <div className="flex flex-col h-[70vh] items-center justify-center">
              <MoonLoader color="#3a3a3a" size={50} speedMultiplier={1} />
              <p>Loading cart items ...</p>
            </div>
          ) : (
            <main className="flex-grow justify-center w-full my-10 py-2">
              {children}
            </main>)
          }
         
        </div>
      </PersistGate>
    </Provider>
  );
};

export default ProductLayout;
