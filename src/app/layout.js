// src/app/layout.js
"use client";

import { useEffect } from "react";
import Navbar from "./components/navbar/navbar";

export default function RootLayout({ children }) {
  useEffect(() => {
    // Ensure the code only runs in the browser
    if (typeof window !== "undefined" && window.electronAPI) {
      window.electronAPI.onCanvasUpdate((data) => {
        console.log("Canvas update received:", data);
        // Handle the canvas update globally, e.g., update a context or global state
      });
    }
  }, []);

  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="main-content">{children}</main>
      </body>
    </html>
  );
}
