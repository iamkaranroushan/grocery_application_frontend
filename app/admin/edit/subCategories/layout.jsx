"use client";
import ProductNavbar from "@/components/product/productNavbar";
import UserNavbar from "@/components/user/usernav";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MoonLoader } from "react-spinners";
import { Provider } from "react-redux";
import { store, persistor } from "@/features/auth/authStore";
import { PersistGate } from "redux-persist/integration/react";
import CartNavbar from "@/components/cart/cartNavbar";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/useCart";
import EditNavbar from "@/components/edit/editNavbar";

const EditSubCategoryLayout = ({ children }) => {

  const [routeLoading, setRouteLoading] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter(); // Using the useRouter hook

  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    setLoading(true);
    router.back(); // Navigates to the previous page
  };

  const handleCheckOut = (url) => {
    const currentUrl = window.location.pathname + window.location.search;
    if (url !== currentUrl) {
      setRouteLoading(true);
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
          <EditNavbar handleBack={handleBack} editSection={"Edit Subcategories"} />
          {loading ?(
            <div className="flex h-[70vh] items-center justify-center">
              <MoonLoader color="#3a3a3a" size={50} speedMultiplier={1} />
            </div>
          ) : (
            <main className="p-3 w-full">
              {children}
            </main>
          )
          }
        </div>
      </PersistGate>
    </Provider >
  );
};

export default EditSubCategoryLayout;
