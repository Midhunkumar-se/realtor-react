import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.scss";
import Home from "./pages/Home";
import RootLayout from "./pages/Root";
// import { Offers } from "./pages/Offers";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Offers from "./pages/Offers";
import { Fragment } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import { ErrorPage } from "./pages/Error";
import CreateListing from "./pages/CreateListing";
import EditListing from "./pages/EditListing";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "profile",
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <Profile />,
          },
        ],
      },
      {
        path: "create-listing",
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <CreateListing />,
          },
        ],
      },
      {
        path: "edit-listing/:listingId",
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: <EditListing />,
          },
        ],
      },
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "offers",
        element: <Offers />,
      },
    ],
  },
]);

function App() {
  return (
    <Fragment>
      <RouterProvider router={router} />;
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Fragment>
  );
}

export default App;
