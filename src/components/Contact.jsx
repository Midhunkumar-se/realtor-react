import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";
import "./Contact.scss";

export default function Contact({ userRef, listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    async function getLandlord() {
      const docRef = doc(db, "users", userRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error("Could not get landlord data");
      }
    }
    getLandlord();
  }, [userRef]);
  function onChange(e) {
    setMessage(e.target.value);
  }
  return (
    <>
      {landlord !== null && (
        <div className="contact">
          <p>
            Contact <span style={{ fontWeight: "600" }}>{landlord.name}</span>{" "}
            for the{" "}
            <span style={{ fontWeight: "600" }}>
              {`: ${listing.name.toLowerCase()}`}
            </span>
          </p>
          <div className="contact__textarea-wrap">
            <textarea
              name="message"
              id="message"
              rows="2"
              value={message}
              onChange={onChange}
              className="contact__textarea "
            ></textarea>
          </div>
          <a
            style={{ cursor: "none" }}
            href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
          >
            <button className="contact__send-btn" type="button">
              Send Message
            </button>
          </a>
        </div>
      )}
    </>
  );
}
