"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Bottom_navbar } from "./bottom_navbar";
import Top_navbar from "./top_navbar";
import LoadingSpinner from "./loadingSpinner";
import { Provider } from "react-redux";
import { store, persistor } from "@/features/auth/authStore";
import { PersistGate } from "redux-persist/integration/react";
import { useIsMobile } from "@/hooks/useIsMobile"; // adjust path accordingly

const Layout = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const Router = useRouter();
  const isMobile = useIsMobile();

  const routeChange = (url) => {
    const currentUrl = window.location.pathname + window.location.search;
    if (url !== currentUrl) {
      setLoading(true);
      console.log(url);
      Router.push(url, { scroll: false });
    }
  };
  useEffect(() => {
    setLoading(false); // Cleanup timer when the effect re-runs
  }, [pathname, searchParams]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="flex flex-col items-center min-h-screen ">
          {<Top_navbar routeChange={routeChange} />}

          {/* Show loader as an overlay */}
          {loading && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70">
              <LoadingSpinner />
            </div>
          )}

          {/* Main content */}
          <main
            className={`flex-grow justify-center w-full mt-14   ${loading && "opacity-50"
              }`}
          >
            {children}
          </main>
          {isMobile && <Bottom_navbar routeChange={routeChange} />}
        </div>
      </PersistGate>
    </Provider>
  );
};

export default Layout;
