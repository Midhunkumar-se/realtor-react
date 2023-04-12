import React from "react";
import "./OAuth.scss";
import { FcGoogle } from "react-icons/fc";

export const OAuth = React.memo(() => {
  function onClick() {
    console.log("OAuth: mount click");
  }
  console.log("OAuth: mount");
  return (
    <button onClick={onClick} type="button" className=" OAuth-btn">
      <FcGoogle className=" OAuth-btn__google" />
      Continue with Google
    </button>
  );
});
