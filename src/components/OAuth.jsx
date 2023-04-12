import React from "react";
import "./OAuth.scss";
import { FcGoogle } from "react-icons/fc";

export const OAuth = () => {
  return (
    <button type="button" className=" OAuth-btn">
      <FcGoogle className=" OAuth-btn__google" />
      Continue with Google
    </button>
  );
};
