import React from "react";
import ReactCurvedText from "react-curved-text";

const CurvedText = () => {
  return (
    <div className="absolute -top-10 -left-48 rotate_text">
      <ReactCurvedText
        width={250}
        height={250}
        cx={120}
        cy={120}
        rx={100}
        ry={100}
        text="Lou On Tour . Lou On Tour . Lou On Tour . Lou On Tour . Lou On Tour .  "
        textProps={{ style: { fontSize: "25", fill: "#E3494D" } }}
      />
    </div>
  );
};

export default CurvedText;
