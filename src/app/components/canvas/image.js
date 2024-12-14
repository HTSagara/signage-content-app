import { FabricImage } from "fabric";
import React, { useState, useRef } from "react";
import { ImageIcon } from "sebikostudio-icons";

import dynamic from "next/dynamic";
const IconButton = dynamic(
  () => import("blocksin-system").then((mod) => mod.IconButton),
  { ssr: false }
);

export default function Image({ canvas }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && typeof document !== "undefined") {
      const url = URL.createObjectURL(file);
      setImageSrc(url);

      const imageElement = document.createElement("img");
      imageElement.src = url;
      imageElement.crossOrigin = "anonymous";

      imageElement.addEventListener("load", () => {
        const imageWidth = imageElement.naturalWidth;
        const imageHeight = imageElement.naturalHeight;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const scale = Math.min(
          canvasWidth / imageWidth,
          canvasHeight / imageHeight
        );

        const fabricImage = new FabricImage(imageElement, {
          left: 0,
          top: 0,
          scaleX: scale,
          scaleY: scale,
        });

        canvas.add(fabricImage);
        canvas.renderAll();
        setUploadMessage("Uploaded successfully!");
        setTimeout(() => setUploadMessage(""), 3000);
      });

      imageElement.addEventListener("error", (error) => {
        console.error("Image load error:", error);
        setUploadMessage("Failed to upload image.");
      });
    }
  };

  const handleImageUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      {/* <button onClick={handleImageUploadButtonClick}>Upload Image</button> */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
      <IconButton
        onClick={handleImageUploadButtonClick}
        variant="ghost"
        size="medium"
      >
        <ImageIcon />
      </IconButton>
    </div>
  );
}
