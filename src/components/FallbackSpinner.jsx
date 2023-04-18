import React from "react";
import "./FallbackSpinner.scss";

const FallbackSpinner = () => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div className="loader"></div>
    </div>
  );
};

export default FallbackSpinner;
