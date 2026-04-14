import React, { useEffect, useState } from "react";

function ElfsightWidget() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div style={{ overflow: "hidden" }}>
      <div
        className="elfsight-app-acbdfc91-1069-4174-a7aa-9fd11406bb2e"
        data-elfsight-app-lazy
      />
    </div>
  );
}

export default ElfsightWidget;
