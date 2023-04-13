import React, { useEffect, useState } from "react";
import "./Header.scss";
import { Link, NavLink } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Header = () => {
  const [pageState, setPageState] = useState({
    path: "sign-in",
    menuName: "Sign in",
  });
  const { path, menuName } = pageState;

  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setPageState({
          path: "profile",
          menuName: "Profile",
        });
      } else {
        setPageState({
          path: "sign-in",
          menuName: "Sign in",
        });
      }
    });
  }, [auth]);

  return (
    <div className="header">
      <header className="header__container">
        <Link to="/" className="header__logo">
          <img
            src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
            alt="logo"
          ></img>
        </Link>
        <nav>
          <ul className="header__menus">
            <NavLink to="/" className="header__menu">
              Home
            </NavLink>

            <NavLink to="/offers" className="header__menu">
              Offers
            </NavLink>

            <NavLink to={`/${path}`} className="header__menu">
              {menuName}
            </NavLink>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;
