import React from "react";
import ReactCurvedText from "react-curved-text";

const CurvedText = () => {
  return (
    <div className="hidden xl:block absolute left-[52%] top-[10%]  rotate_text">
      <ReactCurvedText
        width={180}
        height={180}
        cx={90}
        cy={90}
        rx={80}
        ry={80}
        text="Lou On Tour . Lou On Tour . Lou On Tour . Lou On Tour .  "
        textProps={{ style: { fontSize: 25, fill: "#FE6847" } }}
      />
    </div>
  );
};

export default CurvedText;
