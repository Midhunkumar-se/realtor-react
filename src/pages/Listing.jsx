import { doc, getDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import "./Listing.scss";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import * as Scroll from "react-scroll";
import { getAuth } from "firebase/auth";
import Contact from "../components/Contact";
import { MapContainer, Popup, Marker, TileLayer } from "react-leaflet";

export const Listing = () => {
  const auth = getAuth();
  const [listing, setListing] = useState(null);
  const [postedBy, setPostedBy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [contactLandlord, setContactLandlord] = useState(false);
  const params = useParams();
  SwiperCore.use([Autoplay, Navigation, Pagination]);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.listingId]);

  if (loading) {
    return <Spinner />;
  }
  let scroll = Scroll.animateScroll;

  function scrollTo() {
    scroll.scrollTo(700);
  }
  return (
    <main>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <img
              src={listing.imgUrls[index]}
              alt={"house"}
              className="swiper-image"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="copy-share-link"
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <FaShare className="copy-share-link__icon" />
      </div>
      {shareLinkCopied && <p className="copied-share-link">Link Copied</p>}
      <div smooth="true" onClick={scrollTo} className="arrow">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="house-info">
        <div className="house-info__details">
          <p className="house-info__details-title">
            {listing.name} - ₹{" "}
            {listing.offer
              ? listing.discountedPrice
                  .toString()
                  .replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ",")}
            {listing.type === "rent" ? " / month" : ""}
          </p>
          <p className="house-info__details-address">
            <FaMapMarkerAlt className="house-info__details-address-icon" />
            {listing.address}
          </p>
          <div className="house-info__details-category-and-offer">
            <p className="house-info__details-category">
              For {listing.type === "rent" ? "Rent" : "Sale"}
            </p>
            {listing.offer && (
              <p className="house-info__details-offer">
                ₹
                {(+listing.regularPrice - +listing.discountedPrice)
                  .toString()
                  .replace(/\B(?=(?:(\d\d)+(\d)(?!\d))+(?!\d))/g, ",")}{" "}
                discount
              </p>
            )}
          </div>

          <p style={{ marginTop: "1rem" }}>
            <span style={{ fontWeight: "600" }}>Posted on:</span>{" "}
            {`${listing.timestamp.toDate().toDateString()}`}
          </p>
          <p className="house-info__details-description">
            <span style={{ fontWeight: 600 }}>Description - </span>
            {listing.description}
          </p>
          <ul className="house-info__details-hbk">
            <li className="house-info__details-hbk-element">
              <FaBed className=" house-info__details-hbk-element-icon" />
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </li>
            <li className="house-info__details-hbk-element">
              <FaBath className="house-info__details-hbk-element-icon" />
              {+listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </li>
            <li className="house-info__details-hbk-element">
              <FaParking className="house-info__details-hbk-element-icon" />
              {listing.parking ? "Parking spot" : "No parking"}
            </li>
            <li className="house-info__details-hbk-element">
              <FaChair className="house-info__details-hbk-element-icon" />
              {listing.furnished ? "Furnished" : "Not furnished"}
            </li>
          </ul>
          {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
            <div
              className=" house-info__details-contact-landlord-wrap"
              style={{ marginTop: "1.5rem" }}
            >
              <button
                onClick={() => setContactLandlord(true)}
                className="house-info__details-contact-landlord-btn"
              >
                Contact Landlord
              </button>
            </div>
          )}
          {contactLandlord && (
            <Contact userRef={listing.userRef} listing={listing} />
          )}
        </div>
        <div className="house-info__details-map">
          <MapContainer
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </main>
  );
};
