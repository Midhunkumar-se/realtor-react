import { Link, useNavigate } from "react-router-dom";
import { FcHome } from "react-icons/fc";
import "./Profile.scss";
import { useState } from "react";
import { getAuth } from "firebase/auth";

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  return (
    <>
      <section className=" profile">
        <h1 className=" profile__header">My Profile</h1>
        <div className="profile__form-btn-wrap">
          <form className="profile__form">
            {/* Name Input */}

            <input
              type="text"
              id="name"
              value={name}
              disabled
              className={`profile__form-input ${
                false ? "profile__form-input--modifier" : ""
              }`}
            />

            {/* Email Input */}

            <input
              type="email"
              id="email"
              disabled
              className="profile__form-input"
              value={email}
            />

            <div className="profile__form-links">
              <p className="profile__form-name-change-link">
                Do you want to change your name?
                <span className="profile__form-name-change-link-name">
                  edit
                </span>
              </p>
              <p onClick={onLogout} className="profile__form-sign-out">
                Sign out
              </p>
            </div>
          </form>
          <button type="submit" className="profile__home-sell-btn">
            <Link to="/create-listing" className="profile__home-sell-btn-link">
              <FcHome className="profile__home-sell-btn-logo" />
              Sell or rent your home
            </Link>
          </button>
        </div>
      </section>
      {/* <div className="max-w-6xl px-3 mt-6 mx-auto">
        {!loading && listings.length > 0 && (
          <>
            <h2 className="text-2xl text-center font-semibold mb-6">
              My Listings
            </h2>
            <ul className="sm:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {listings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  id={listing.id}
                  listing={listing.data}
                  onDelete={() => onDelete(listing.id)}
                  onEdit={() => onEdit(listing.id)}
                />
              ))}
            </ul>
          </>
        )}
      </div> */}
    </>
  );
}
