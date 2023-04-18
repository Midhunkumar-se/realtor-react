import React, { useState } from "react";
import "./SignIn.scss";
import { Link, useNavigate } from "react-router-dom";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { OAuth } from "../components/OAuth";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validate, setValidate] = useState({
    emailValidate: true,
    passwordValidate: true,
    nameValidate: true,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;

  const { emailValidate, passwordValidate, nameValidate } = validate;

  const emailIsValid = email.includes("@") && email.trim() !== "";
  const passwordIsValid = password.length >= 6 && password.trim() !== "";
  const nameIsValid = name.length >= 6 && name.trim() !== "";

  const navigate = useNavigate();

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!emailIsValid) {
      setValidate((prevState) => ({
        ...prevState,
        emailValidate: false,
      }));
    }
    if (!passwordIsValid) {
      setValidate((prevState) => ({
        ...prevState,
        passwordValidate: false,
      }));
    }
    if (!nameIsValid) {
      setValidate((prevState) => ({
        ...prevState,
        nameValidate: false,
      }));
    }
    setIsLoading(true);
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      updateProfile(auth.currentUser, {
        displayName: name,
      });
      const user = userCredential.user;
      const formDataCopy = { ...formData };
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      await setDoc(doc(db, "users", user.uid), formDataCopy);
      toast.success("Sign up was successfull");
      navigate("/");
      setIsLoading(false);
    } catch (error) {
      if (emailIsValid) {
        setValidate((prevState) => ({
          ...prevState,
          emailValidate: true,
        }));
      }
      if (passwordIsValid) {
        setValidate((prevState) => ({
          ...prevState,
          passwordValidate: true,
        }));
      }
      if (nameIsValid) {
        setValidate((prevState) => ({
          ...prevState,
          nameValidate: true,
        }));
      }
      toast.error("Something went wrong with the registration");
      setIsLoading(false);
    }
  }

  return (
    <section className="form-section">
      <h1 className=" form-section__title">Sign Up</h1>
      <div className=" form-section__form-wrapper">
        <div className="form-section__image-wrap">
          <img
            src="https://wallpapers.com/images/hd/real-estate-house-keys-h79pvlxway8mwu2p.jpg"
            alt="key"
          />
        </div>
        <div className="form-section__form-wrap">
          <form onSubmit={onSubmit} className="form-section__form">
            {!nameValidate && (
              <span className="input--warning">
                *name length should be greater than or equal to 3
              </span>
            )}
            <input
              type="text"
              id="name"
              value={name}
              onChange={onChange}
              placeholder="Full name"
              className={`form-section__form-input ${
                !nameValidate ? "form-section__form-input--warning" : ""
              }`}
            />
            {!emailValidate && (
              <span className="input--warning">*this is not a valid email</span>
            )}
            <input
              type="email"
              id="email"
              placeholder="Email address"
              className={`form-section__form-input ${
                !emailValidate ? "form-section__form-input--warning" : ""
              }`}
              value={email}
              onChange={onChange}
            />
            {!passwordValidate && (
              <span className="input--warning">
                *password length should be greater than or equal to 6
              </span>
            )}
            <div className="form-section__form-input-wrap">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                className={`form-section__form-input ${
                  !passwordValidate ? "form-section__form-input--warning" : ""
                }`}
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
                <Link to="/sign-in">Sign in</Link>
              </p>
              <p className="form-section__forgot-password">
                <Link to="/forgot-password">Forgot password?</Link>
              </p>
            </div>
            <button className="form-section__btn-signing" type="submit">
              {isLoading ? "Signing Up..." : "Sign up"}
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
export default SignUp;
