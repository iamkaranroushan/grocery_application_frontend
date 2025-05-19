'use client'

import FeaturedProducts from "@/components/custom/featuredProducts";
import Layout from "@/components/custom/layout";
import Login from "@/components/custom/login";
import MainFooter from "@/components/custom/mainFooter";
import Hero from "@/components/homepage/hero";
import { useState, Suspense } from "react";

const Page = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <Suspense fallback={<div>Loading layout...</div>}>
      <Layout>
        {isLoginOpen && (
          <Login
            setIsLoginOpen={setIsLoginOpen}
            onClose={() => setIsLoginOpen(false)}
          />
        )}
        <div
          className={`flex flex-col justify-center bg-black ${isLoginOpen ? "blur-sm" : ""
            }`}
        >
          <Hero />
          <FeaturedProducts setIsLoginOpen={setIsLoginOpen} />
          <MainFooter />
        </div>
      </Layout>
    </Suspense>
  );
};

export default Page;
