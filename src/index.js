import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Footer from "./components/Footer";

import "bootstrap/dist/css/bootstrap.min.css";

// Create a root element for rendering the React app
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the React app wrapped in a StrictMode component
root.render(
  <React.StrictMode>
    <App />
    <Footer />
  </React.StrictMode>
);
