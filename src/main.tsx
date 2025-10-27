import { Fragment } from "react";
import { createRoot } from "react-dom/client";

import { AppRouter } from "./routes/app-router";
import "./index.css";

/**
 * Root component
 * @returns {JSX.Element} JSX element
 */
createRoot(document.getElementById("root")!).render(
  <Fragment>
    <AppRouter />
  </Fragment>
);
