'use client';
import React, { useState, useEffect } from 'react';
import { FaAngleDown, FaAngleUp, FaRegCopyright } from 'react-icons/fa';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import LoadingSpinner from './loadingSpinner';
import { CiGlobe } from 'react-icons/ci';

const sections = [
  {
    title: 'Customer Care',
    links: [
      { label: 'Contact Us', url: '/contact' },
    ],
  },
  {
    title: 'Links',
    links: [
      { label: 'Your Orders', url: '/orders' },
      { label: 'Your Cart', url: '/cart' },
      { label: 'Shop From Categories', url: '/categories' },
    ],
  },
  {
    title: 'Shop',
    links: [
      { label: 'About Us', url: '/about' },
    ],
  },
];


const MainFooter = () => {
  const [loading, setLoading] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const toggleSection = (title) => {
    setOpenSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-60">
          <LoadingSpinner />
        </div>
      )}

      <footer className="bg-[#111] text-white px-4 lg:px-20 lg:pt-20 lg:pb-10 pt-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {sections.map((section) => (
            <div key={section.title} className="border-b lg:border-none border-gray-700 pb-6 lg:pb-0">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex justify-between items-center text-left font-semibold text-white text-sm lg:cursor-default lg:pointer-events-none"
              >
                {section.title}
                <span className="lg:hidden">
                  {openSections[section.title] ? <FaAngleUp /> : <FaAngleDown />}
                </span>
              </button>

              {(openSections[section.title] || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
                <ul className="mt-6 space-y-2 text-sm text-gray-400 lg:mt-4">
                  {section.links.map((link, index) => (
                    <li
                      key={index}
                      className="hover:text-white cursor-pointer"
                      onClick={() => routeChange(link.url)}
                    >
                      {link.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center text-sm text-gray-500 my-6">
          <span className="mr-2">
            <CiGlobe className="text-gray-500" />
          </span>
          India
        </div>

        <div className="border-t border-gray-700 pt-4 text-xs text-gray-500 space-y-2">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center">
            <span className="flex items-center gap-1 mb-2 sm:mb-0">
              <FaRegCopyright className="text-[10px]" />
              {new Date().getFullYear()} Easy Grocery. All rights reserved.
            </span>
            <div className="flex gap-4 flex-wrap">
              <span className="cursor-pointer hover:text-white">Terms of Sale</span>
              <span className="cursor-pointer hover:text-white">Terms of Use</span>
              <span className="cursor-pointer hover:text-white">Privacy Policy</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default MainFooter;
