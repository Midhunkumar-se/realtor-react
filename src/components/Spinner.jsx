import React from "react";
import spinner from "../assets/svg/spinner.svg";
import "./Spinner.scss";

const Spinner = () => {
  return (
    <div className="spinner">
      <img src={spinner} alt="Loading" className="spinner__img" />
    </div>
  );
};

export default Spinner;
