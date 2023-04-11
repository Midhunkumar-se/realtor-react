import React from "react";
import "./Header.scss";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
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

            <NavLink to="/sign-in" className="header__menu">
              Sign In
            </NavLink>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;
