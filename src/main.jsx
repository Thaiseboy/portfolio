import React from "react";
import { createRoot } from "react-dom/client";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./assets/css/tailwind.css";
import App from "./App.jsx";
import ReplyPage from "./views/ReplyPage.jsx";

// /reply is the page behind "Reply to this message" in a reply mail; everything else is the portfolio.
const Page =
  window.location.pathname.replace(/\/+$/, "") === "/reply" ? ReplyPage : App;

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>,
);
