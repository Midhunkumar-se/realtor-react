import React, { Fragment } from "react";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <Fragment>
      <main>
        <Outlet />
      </main>
    </Fragment>
  );
};

export default RootLayout;
