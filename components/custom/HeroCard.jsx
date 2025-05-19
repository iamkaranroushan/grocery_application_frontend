"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "./loadingSpinner";

const HeroCard = () => {
  const phrases = ["Organic Fruits", "Authentic Spices", "Fresh Vegetables", "Crunchy Cookies"];
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

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

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % phrases.length);
        setFade(true);
      }, 400); // fade out time
    }, 2000); // interval between phrases

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80 ">
          <LoadingSpinner />
        </div>
      )}
      <div className={`w-screen mt-2 p-3  flex flex-col justify-end items-center bg-white`}>


        < div className="flex flex-col z-10 w-full max-w-md text-center py-2">
          <h1
            className={`text-stone-800 text-6xl font-bold transition-opacity duration-500 ${fade ? "opacity-100" : "opacity-0"
              }`}
          >
            {phrases[index]}
          </h1>
          <br />

          <Button onClick={() => routeChange('/categories')} variant="hero_button" size="subscribe" className="w-full">
            shop from categories
          </Button>

        </div>
      </div >
    </>
  );
};

export default HeroCard;
