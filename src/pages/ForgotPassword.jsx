import React, { useState } from "react";
import "./SignIn.scss";
import { Link } from "react-router-dom";
import { OAuth } from "../components/OAuth";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  function onChange(e) {
    setEmail(e.target.value);
  }

  return (
    <section className="form-section">
      <h1 className=" form-section__title">Forgot Password</h1>
      <div className=" form-section__form-wrapper">
        <div className="form-section__image-wrap">
          <img
            src="https://wallpapers.com/images/hd/real-estate-house-keys-h79pvlxway8mwu2p.jpg"
            alt="key"
          />
        </div>
        <div className="form-section__form-wrap">
          <form className="form-section__form">
            <input
              type="email"
              id="email"
              placeholder="Email address"
              className="form-section__form-input"
              value={email}
              onChange={onChange}
            />

            <div className="form-section__other-detail">
              <p className="form-section__account-signing">
                Don't have a account?
                <Link to="/sign-up">Register</Link>
              </p>
              <p className="form-section__forgot-password">
                <Link to="/sign-in">Sign in instead</Link>
              </p>
            </div>
            <button className="form-section__btn-signing" type="submit">
              Send reset Email
            </button>
            <div className="form-section__border-line">
              <p>OR</p>
            </div>
            <OAuth />
          </form>
        </div>
      </div>
    </section>
  );
};
export default ForgotPassword;
