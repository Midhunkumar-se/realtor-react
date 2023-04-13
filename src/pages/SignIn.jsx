import React, { useState } from "react";
import "./SignIn.scss";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { OAuth } from "../components/OAuth";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { toast } from "react-toastify";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { email, password } = formData;
  const navigate = useNavigate();

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userCredential.user) {
        navigate("/");
      }
      setIsLoading(false);
    } catch (error) {
      toast.error("Bad user credentials");
      setIsLoading(false);
    }
  }

  return (
    <section className="form-section">
      <h1 className=" form-section__title">Sign In</h1>
      <div className=" form-section__form-wrapper">
        <div className="form-section__image-wrap">
          <img
            src="https://wallpapers.com/images/hd/real-estate-house-keys-h79pvlxway8mwu2p.jpg"
            alt="key"
          />
        </div>
        <div className="form-section__form-wrap">
          <form onSubmit={onSubmit} className="form-section__form">
            <input
              type="email"
              id="email"
              placeholder="Email address"
              className="form-section__form-input"
              value={email}
              onChange={onChange}
            />
            <div className="form-section__form-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                className="form-section__form-input-password"
                onChange={onChange}
                value={password}
              />
              {showPassword ? (
                <AiFillEyeInvisible
                  className="form-section__form-input-password-eye"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              ) : (
                <AiFillEye
                  className="form-section__form-input-password-eye"
                  onClick={() => setShowPassword((prevState) => !prevState)}
                />
              )}
            </div>
            <div className="form-section__other-detail">
              <p className="form-section__account-signing">
                Don't have a account?
                <Link to="/sign-up">Register</Link>
              </p>
              <p className="form-section__forgot-password">
                <Link to="/forgot-password">Forgot password?</Link>
              </p>
            </div>
            <button className="form-section__btn-signing" type="submit">
              {isLoading ? "Signing In..." : "Sign in"}
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
export default SignIn;
