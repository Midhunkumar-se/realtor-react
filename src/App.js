import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.scss";
import Home from "./pages/Home";
import RootLayout from "./pages/Root";
import { Fragment, Suspense, lazy } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import FallbackSpinner from "./components/FallbackSpinner";

const SignIn = lazy(() => import("./pages/SignIn"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Offers = lazy(() => import("./pages/Offers"));
const Profile = lazy(() => import("./pages/Profile"));
const CreateListing = lazy(() => import("./pages/CreateListing"));
const EditListing = lazy(() => import("./pages/EditListing"));
const Listing = lazy(() => import("./pages/Listing"));
const Category = lazy(() => import("./pages/Category"));
const ErrorPage = lazy(() => import("./pages/Error"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: (
      <Suspense fallback={<FallbackSpinner />}>
        <ErrorPage />
      </Suspense>
    ),
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
            element: (
              <Suspense fallback={<FallbackSpinner />}>
                <Profile />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "create-listing",
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<FallbackSpinner />}>
                <CreateListing />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "edit-listing/:listingId",
        element: <PrivateRoute />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<FallbackSpinner />}>
                <EditListing />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: "sign-in",
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <SignIn />
          </Suspense>
        ),
      },
      {
        path: "sign-up",
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <SignUp />
          </Suspense>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <ForgotPassword />
          </Suspense>
        ),
      },
      {
        path: "category/:categoryName/:listingId",
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <Listing />
          </Suspense>
        ),
      },
      {
        path: "offers",
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <Offers />
          </Suspense>
        ),
      },
      {
        path: "category/:categoryName",
        element: (
          <Suspense fallback={<FallbackSpinner />}>
            <Category />
          </Suspense>
        ),
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
