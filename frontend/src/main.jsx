/**
 * @file Browser entry point for the React presentation client.
 *
 * The Django backend follows MVT and returns JSON through DRF Views. This file
 * mounts the separate React interface that presents those JSON responses; it
 * is not a Django HTML template.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

import App from "./App.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <FavoritesProvider>
                <App />
            </FavoritesProvider>
        </BrowserRouter>
    </StrictMode>,
);
