import { useState } from "react";
import Spinner from "../components/Spinner";
import "./CreateListing.scss";
import { toast } from "react-toastify";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const navigate = useNavigate();
  const auth = getAuth();
  const [geolocationEnabled, setGeoLocationEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 13.095631,
    longitude: 80.20762,
    images: {},
  });
  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    address,
    furnished,
    description,
    offer,
    regularPrice,
    discountedPrice,
    latitude,
    longitude,
    images,
  } = formData;

  function onChange(e) {
    let boolean = null;
    if (e.target.value === "true") {
      boolean = true;
    }
    if (e.target.value === "false") {
      boolean = false;
    }

    // Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    // Text and Boolean
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    if (+discountedPrice >= +regularPrice) {
      setLoading(false);
      toast.error("Discounted price needs to be less than regular price");
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error("Maximum 6 images are allowed");
      return;
    }

    let geolocation = {};

    if (geolocationEnabled) {
      return;
    } else {
      geolocation.lat = +latitude;
      geolocation.lng = +longitude;
    }

    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;
    delete formDataCopy.latitude;
    delete formDataCopy.longitude;
    const docRef = await addDoc(collection(db, "listings"), formDataCopy);
    setLoading(false);
    toast.success("Listing created");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className="create-listing">
      <h1 className="create-listing__heading">Create a Listing</h1>
      <form onSubmit={onSubmit} className="create-listing__form">
        <p className="create-listing__form-sub-heading">Sell / Rent</p>
        <div className="create-listing__form-toggle-btn-wrap">
          <button
            type="button"
            id="type"
            value="sale"
            onClick={onChange}
            className={`create-listing__form-toggle-btn ${
              type === "rent"
                ? "create-listing__form-toggle-btn--white"
                : "create-listing__form-toggle-btn--black"
            }`}
          >
            sell
          </button>
          <button
            type="button"
            id="type"
            value="rent"
            onClick={onChange}
            className={`create-listing__form-toggle-btn ${
              type === "sale"
                ? "create-listing__form-toggle-btn--white"
                : "create-listing__form-toggle-btn--black"
            }`}
          >
            rent
          </button>
        </div>
        <p className="create-listing__form-sub-heading">Name</p>
        <input
          type="text"
          id="name"
          value={name}
          onChange={onChange}
          placeholder="Name"
          maxLength="32"
          minLength="10"
          required
          className="create-listing__form-input"
        />
        <div className="create-listing__form-small-input-wrap">
          <div>
            <p className="create-listing__form-sub-heading">Beds</p>
            <input
              type="number"
              id="bedrooms"
              value={bedrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className=" create-listing__form-input"
            />
          </div>
          <div>
            <p className="create-listing__form-sub-heading">Baths</p>
            <input
              type="number"
              id="bathrooms"
              value={bathrooms}
              onChange={onChange}
              min="1"
              max="50"
              required
              className="create-listing__form-input"
            />
          </div>
        </div>
        <p className=" create-listing__form-sub-heading">Parking spot</p>
        <div className="create-listing__form-toggle-btn-wrap">
          <button
            type="button"
            id="parking"
            value={true}
            onClick={onChange}
            className={`create-listing__form-toggle-btn ${
              !parking
                ? "create-listing__form-toggle-btn--white"
                : "create-listing__form-toggle-btn--black"
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            id="parking"
            value={false}
            onClick={onChange}
            className={`create-listing__form-toggle-btn ${
              parking
                ? "create-listing__form-toggle-btn--white"
                : "create-listing__form-toggle-btn--black"
            }`}
          >
            no
          </button>
        </div>
        <p className=" create-listing__form-sub-heading">Furnished</p>
        <div className="create-listing__form-toggle-btn-wrap">
          <button
            type="button"
            id="furnished"
            value={true}
            onClick={onChange}
            className={`create-listing__form-toggle-btn ${
              !furnished
                ? "create-listing__form-toggle-btn--white"
                : "create-listing__form-toggle-btn--black"
            }`}
          >
            yes
          </button>
          <button
            type="button"
            id="furnished"
            value={false}
            onClick={onChange}
            className={`create-listing__form-toggle-btn ${
              furnished
                ? "create-listing__form-toggle-btn--white"
                : "create-listing__form-toggle-btn--black"
            }`}
          >
            no
          </button>
        </div>
        <p className="create-listing__form-sub-heading">Address</p>
        <textarea
          type="text"
          id="address"
          value={address}
          onChange={onChange}
          placeholder="Address"
          required
          className="create-listing__form-input"
        />
        {!geolocationEnabled && (
          <div className="create-listing__form-rent">
            <div className="">
              <p className="create-listing__form-sub-heading">Latitude</p>
              <input
                type="number"
                id="latitude"
                value={latitude}
                onChange={onChange}
                required
                min="-90"
                max="90"
                step="any"
                className="create-listing__form-input"
                placeholder="Ex: 13.095631"
              />
            </div>
            <div className="" style={{ marginLeft: "1.4rem" }}>
              <p className="create-listing__form-sub-heading">Longitude</p>
              <input
                type="number"
                id="longitude"
                value={longitude}
                onChange={onChange}
                required
                min="-180"
                max="180"
                step="any"
                className="create-listing__form-input"
                placeholder="Ex: 80.207620"
              />
            </div>
          </div>
        )}
        <p className="create-listing__form-sub-heading">Description</p>
        <textarea
          type="text"
          id="description"
          value={description}
          onChange={onChange}
          placeholder="Description"
          required
          className="create-listing__form-input"
        />
        <p className="create-listing__form-sub-heading">Offer</p>
        <div className="create-listing__form-toggle-btn-wrap">
          <button
            type="button"
            id="offer"
            value={true}
            onClick={onChange}
            className={`create-listing__form-toggle-btn ${
              !offer
                ? "create-listing__form-toggle-btn--white"
                : "create-listing__form-toggle-btn--black"
            }`}
          >
            yes
          </button>
          <button
            type="button"
            id="offer"
            value={false}
            onClick={onChange}
            className={`create-listing__form-toggle-btn ${
              offer
                ? "create-listing__form-toggle-btn--white"
                : "create-listing__form-toggle-btn--black"
            }`}
          >
            no
          </button>
        </div>
        <div className="create-listing__form-rent">
          <div className="">
            <p className="create-listing__form-sub-heading">Regular price</p>
            <div className="create-listing__form-toggle-rent-btn-wrap">
              <input
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onChange}
                min="50"
                max="400000000"
                required
                className="create-listing__form-input"
              />
              {type === "rent" && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginLeft: "1.4rem",
                  }}
                >
                  <p
                    className="create-listing__form-rent-month"
                    style={{ width: "100px", fontSize: "1.2rem" }}
                  >
                    ₹ / Month
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        {offer && (
          <div className="create-listing__form-rent">
            <div className="">
              <p className="create-listing__form-sub-heading">
                Discounted price
              </p>
              <div className="create-listing__form-toggle-rent-btn-wrap">
                <input
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onChange}
                  min="50"
                  max="400000000"
                  required={offer}
                  className="create-listing__form-input"
                />
                {type === "rent" && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginLeft: "1.4rem",
                    }}
                  >
                    <p
                      className="create-listing__form-rent-month"
                      style={{ width: "100px", fontSize: "1.2rem" }}
                    >
                      ₹ / Month
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div style={{ marginBottom: "3rem" }}>
          <p className="create-listing__form-sub-heading">Images</p>
          <p
            style={{
              color: "rgb(76 74 74)",
              fontSize: "12px",
              marginBottom: "5px",
            }}
          >
            The first image will be the cover (max 6) / image file size should
            be less than 2mb/image file
          </p>
          <input
            type="file"
            id="images"
            onChange={onChange}
            accept=".jpg,.png,.jpeg"
            multiple
            required
            className="create-listing__form-input"
            style={{ fontSize: "20px" }}
          />
        </div>
        <button type="submit" className="create-listing__btn-signing">
          Create Listing
        </button>
      </form>
    </main>
  );
}
