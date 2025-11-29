import { useState, useEffect } from "react";
import PreLoader from './components/PreLoader';
import LandingContent from "./components/LandingContent";

function App() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen bg-[#1E222A]">
          <PreLoader />
        </div>
      ) : (
        <LandingContent />
      )}
    </>
  )
}

export default App