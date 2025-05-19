'use client'
import FeaturedProducts from "@/components/custom/featuredProducts";
import Layout from "@/components/custom/layout";
import Login from "@/components/custom/login";
import MainFooter from "@/components/custom/mainFooter";
import PreviouslyPurchased from "@/components/custom/previouslyPurchased";
import TopCategoryCard from "@/components/custom/TopCategoryCard";
import Hero from "@/components/homepage/hero";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Page = ({ Component, pageProps }) => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  return (
    <Layout>
      {isLoginOpen && (
        <Login
          setIsLoginOpen={setIsLoginOpen}
          onClose={() => setIsLoginOpen(false)}
        />
      )}
      <div className={`flex flex-col justify-center bg-black ${isLoginOpen ? "blur-sm" : ""
        }`}>

        <Hero />
        <FeaturedProducts setIsLoginOpen={setIsLoginOpen} />
        <MainFooter />
      </div>
    </Layout>
  );
};

export default Page;
