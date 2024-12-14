import React, { useRef, useState } from "react";
import { FabricImage } from "fabric";
import { FaImage } from "react-icons/fa";
import Button from "@mui/material/Button";

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
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />
      <Button
        startIcon={<FaImage />}
        variant="outlined"
        onClick={handleImageUploadButtonClick}
      ></Button>
    </div>
  );
}
