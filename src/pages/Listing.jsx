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
import { FaShare } from "react-icons/fa";
import * as Scroll from "react-scroll";

export const Listing = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
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
    console.log(listing);
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
        // onClick={() => {
        //   navigator.clipboard.writeText(window.location.href);
        //   setShareLinkCopied(true);
        //   setTimeout(() => {
        //     setShareLinkCopied(false);
        //   }, 2000);
        // }}
      >
        <FaShare className="copy-share-link__icon" />
      </div>
      {false && <p className="copied-share-link">Link Copied</p>}
      <a smooth="true" href="detail" onClick={scrollTo} className="arrow">
        <span></span>
      </a>
      <div title="detail" style={{ height: "100vh" }}></div>
    </main>
  );
};
