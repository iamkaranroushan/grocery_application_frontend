"use client";
import Layout from "@/components/custom/layout";
import LoadingSpinner from "@/components/custom/loadingSpinner";
import Login from "@/components/custom/login";
import Logout from "@/components/custom/logout";
import SignUp from "@/components/custom/signup";
import UserPage from "@/components/user/userPage";
import useLogin from "@/hooks/useLogin";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GridLoader } from "react-spinners";
const user = () => {

  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const token = useSelector((state) => state.auth.token); // Access the token from Redux store
  const id = useSelector((state) => state.auth.id);

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

  // Access the token from Redux store
  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  const handleLogoutClick = () => {
    setIsLogoutOpen(true);
    console.log("logout clicked");
  }

  const handleCardClick = () => {
    console.log("Card clicked");
  }

  //fetch addresses
  const handleAddressClick = () => {
    routeChange("/address")
    console.log("Address clicked");
  }

  //fetch orders
  const handleOrderClick = () => {
    routeChange("/orders")
    console.log("Order clicked");
  }

  const handleTransactionClick = () => {
    console.log("Transaction clicked");
  }
  //fetch the cart.
  const handleCartClick = () => {
    routeChange("/cart")
    console.log("Cart clicked");
  }
  const handleSupportClick = () => {
    routeChange("/support")
    console.log("support clicked");
  }
  const handleAboutClick = () => {
    routeChange("/about")
    console.log("about clicked");
  }


  return (
    <div>
      {isLoginOpen && <Login setIsLoginOpen={setIsLoginOpen} onClose={() => setIsLoginOpen(false)} />}
      {isLogoutOpen && <Logout
        setIsLogoutOpen={setIsLogoutOpen}
        onClose={() => {
          setIsLogoutOpen(false)
          console.log("close clicked")
        }} />}
      {loading &&
        <div className="fixed inset-0 w-screen flex items-center justify-center  bg-white bg-opacity-60 ">
          <LoadingSpinner />
        </div>
      }
      <UserPage
        loading={loading}
        isLoginOpen={isLoginOpen}
        handleClick={handleLoginClick}
        handleLogoutClick={handleLogoutClick}
        handleAddressClick={handleAddressClick}
        handleCardClick={handleCardClick}
        handleOrderClick={handleOrderClick}
        handleCartClick={handleCartClick}
        handleSupportClick={handleSupportClick}
        handleAboutClick={handleAboutClick}
      />
    </div>
  );
};

export default user;
