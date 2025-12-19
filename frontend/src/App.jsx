import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HSStaticMethods } from "preline";

import PreLoader from "./components/PreLoader";
import LandingContent from "./components/LandingContent";

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  /* ========================================================
      LOADING SCREEN (2 detik)
  ======================================================== */
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  /* ========================================================
      LOAD PRELINE JS
  ======================================================== */
  useEffect(() => {
    // supaya preline tidak crash jika diimport berkali-kali
    let isMounted = true;

    import("preline/preline").then(() => {
      if (isMounted) {
        HSStaticMethods.autoInit();
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  /* ========================================================
      RE-INIT PRELINE SETIAP PINDAH ROUTE
  ======================================================== */
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        HSStaticMethods.autoInit();
      } catch (e) {
        console.warn("Preline init skipped:", e);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return loading ? (
    <div className="flex justify-center items-center h-screen bg-[#1E222A]">
      <PreLoader />
    </div>
  ) : (
    <LandingContent />
  );
}

export default App;
