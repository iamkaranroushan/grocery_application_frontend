import { useState, useEffect } from "react";
import HeroCard from "../custom/HeroCard";
import TopCategoryCard from "../custom/TopCategoryCard";
import { Button } from "../ui/button";
import { MdOutlineArrowOutward } from "react-icons/md";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "../custom/loadingSpinner";
const Hero = () => {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const routeChange = (url) => {
    const currentUrl = window.location.pathname + window.location.search;
    if (url !== currentUrl) {
      setLoading(true);
      router.push(url, { scroll: false });
    }
  };

  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  return (
    <>


      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
          <LoadingSpinner />
        </div>
      )}
      <div className="flex flex-col  gap-6 lg:gap-20 bg-white  px-4 lg:px-20 lg:h-[95vh] h-[40vh] justify-center">
        <div onClick={() => routeChange("/categories")} className=" p-2 gap-2 lg:gap-8 cursor-pointer flex flex-col mt-24">
         
          <span className="flex items-center gap-4">
            <span className=" lg:text-9xl text-5xl font-extrabold">
              Shop Now
            </span>

            <MdOutlineArrowOutward className="icons lg:text-4xl" />
          </span>

          <p className="text-2xl lg:text-5xl">From Your Trusted Grocery App</p>
        </div>
        <HeroCard />
      </div>
    </>
  );
};

export default Hero;
