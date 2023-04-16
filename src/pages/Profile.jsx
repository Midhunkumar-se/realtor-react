import { Link, useNavigate } from "react-router-dom";
import { FcHome } from "react-icons/fc";
import "./Profile.scss";
import { useEffect, useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import ListingItem from "../components/ListingItem";

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listIsLoading, setListIsLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function onSubmit() {
    setIsLoading(true);
    try {
      if (auth.currentUser.displayName !== name) {
        // update display name in firebase auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // update name in firestore

        const docRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(docRef, {
          name: name,
        });
      }
      toast.success("Profile details updated");
      setIsLoading(false);
    } catch (error) {
      toast.error("Could not update the profile details");
    }
  }

  useEffect(() => {
    async function fetchUserListings() {
      const listingRef = collection(db, "listings");
      const q = query(
        listingRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setListIsLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  async function onDelete(listingId) {
    if (window.confirm("Are you sure you want to delete?")) {
      await deleteDoc(doc(db, "listings", listingId));
      const updatedListings = listings.filter(
        (listing) => listing.id !== listingId
      );
      setListings(updatedListings);
      toast.success("Successfully deleted the listing");
    }
  }

  function onEdit(listingId) {
    navigate(`/edit-listing/${listingId}`);
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
              disabled={!changeDetail}
              onChange={onChange}
              className={`profile__form-input ${
                changeDetail ? "profile__form-input--modifier" : ""
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
                <span
                  onClick={() => {
                    changeDetail && onSubmit();
                    setChangeDetail((prevState) => !prevState);
                  }}
                  className="profile__form-name-change-link-name"
                >
                  {!isLoading && changeDetail ? (
                    "Apply change"
                  ) : isLoading ? (
                    <div className="loader"></div>
                  ) : (
                    "Edit"
                  )}
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
      <div className="user-listings-section">
        {listIsLoading && <div className="loader loader--big"></div>}
        {!listIsLoading && listings.length > 0 && (
          <>
            <h2 className="user-listings-section__header">My Listings</h2>
            <ul className="user-listings-section__listing">
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
      </div>
    </>
  );
}
