import { useEffect, useState } from "react";
import Script from "next/script";

const ElfsightWidget = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Script
        src="https://elfsightcdn.com/platform.js"
        strategy="afterInteractive"
      />
      <div
        className="elfsight-app-3556d60c-9ec1-4325-8318-b25c82d7ac2a !overflow-hidden"
        data-elfsight-app-lazy
      ></div>
    </>
  );
};

export default ElfsightWidget;
