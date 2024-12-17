//src/app/components/canvas/toolbar.js
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Canvas, Rect, Circle, Textbox } from "fabric";
import { FaSquare, FaCircle, FaFont, FaSave } from "react-icons/fa"; // Icons
import Button from "@mui/material/Button"; // Material-UI Button
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import "./styles.scss";
import Settings from "./settings";
import Image from "./image";

export default function Toolbar({ initialCanvasData }) {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [postImmediately, setPostImmediately] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      // Initialize Fabric.js Canvas
      const initCanvas = new Canvas(canvasRef.current, {
        width: 500,
        height: 500,
        backgroundColor: initialCanvasData?.background || "#fff",
      });

      // Log initialCanvasData for debugging
      console.log("Initial Canvas Data:", initialCanvasData);

      // Set checkbox state based on status
      if (initialCanvasData?.status === "posted") {
        console.log("status: " + initialCanvasData?.status);
        setPostImmediately(true); // Set the checkbox to checked if status is 'posted'
      }

      // Load existing canvas data if available
      if (initialCanvasData?.content.objects) {
        // Ensure images are loaded with valid URLs
        const canvasJSON = {
          ...initialCanvasData.content,
          objects: initialCanvasData.content.objects.map((obj) => {
            if (obj.type === "image" && obj.src.startsWith("blob:")) {
              obj.src = "/uploads/default-image.png"; // Replace invalid URLs with defaults
            }
            return obj;
          }),
        };

        initCanvas
          .loadFromJSON(canvasJSON) // Directly use the JSON object
          .then(() => {
            console.log("Canvas successfully loaded.");
            initCanvas.requestRenderAll(); // Ensure rendering happens after loading
            console.log(initCanvas);
          })
          .catch((error) => {
            console.error("Error loading canvas JSON:", error);
          });
      } else {
        console.warn("No valid initialCanvasData provided.");
        initCanvas.requestRenderAll(); // Render an empty canvas
      }

      setCanvas(initCanvas);

      return () => {
        initCanvas.dispose();
      };
    }
  }, [initialCanvasData]);

  const addRectangle = () => {
    if (canvas) {
      const rect = new Rect({
        top: 100,
        left: 50,
        width: 100,
        height: 60,
        fill: "#D84D42",
      });
      canvas.add(rect);
    }
  };

  const addCircle = () => {
    if (canvas) {
      const circ = new Circle({
        top: 100,
        left: 50,
        radius: 60,
        fill: "#0000FF",
      });
      canvas.add(circ);
    }
  };

  const addText = () => {
    if (canvas) {
      const textBox = new Textbox("Enter text here", {
        left: 100,
        top: 300,
        fill: "black",
        fontSize: 24,
      });
      canvas.add(textBox);
    }
  };

  const saveCanvas = async () => {
    if (!canvas) {
      alert("No canvas to save!");
      return;
    }

    const canvasName = prompt("Enter a name for your canvas:");
    if (!canvasName) {
      alert("Canvas name is required!");
      return;
    }

    try {
      const objects = canvas.getObjects();
      const imageUploadPromises = [];

      // Step 1: Replace blob URLs with Cloudinary URLs
      objects.forEach((obj) => {
        if (obj.type === "image" && obj._element) {
          const imageElement = obj._element;

          const promise = new Promise((resolve, reject) => {
            // Create a temporary canvas to extract the image data
            const tempCanvas = document.createElement("canvas");
            const context = tempCanvas.getContext("2d");

            tempCanvas.width = imageElement.naturalWidth || imageElement.width;
            tempCanvas.height =
              imageElement.naturalHeight || imageElement.height;

            context.drawImage(imageElement, 0, 0);

            // Convert to Blob and upload to Cloudinary
            tempCanvas.toBlob(async (blob) => {
              if (!blob) {
                console.error("Failed to create image blob");
                return reject("Failed to create image blob");
              }

              const formData = new FormData();
              formData.append("file", blob);

              // Upload the image to Cloudinary
              try {
                const uploadResponse = await fetch("/api/uploadImage", {
                  method: "POST",
                  body: formData,
                });

                const uploadResult = await uploadResponse.json();

                if (uploadResponse.ok) {
                  console.log("Uploaded image URL:", uploadResult.url);
                  obj.set("src", uploadResult.url); // Replace the src with the Cloudinary URL
                  obj._element.src = uploadResult.url;
                  console.log("Uploaded src", obj._element.src);
                  resolve();
                } else {
                  console.error("Failed to upload image:", uploadResult.error);
                  reject(uploadResult.error);
                }
              } catch (error) {
                console.error("Error uploading image:", error);
                reject(error);
              }
            }, "image/png");
          });

          imageUploadPromises.push(promise);
        }
      });

      // Wait for all image uploads to complete
      await Promise.all(imageUploadPromises);

      // Step 2: Convert canvas to JSON
      const canvasJSON = canvas.toJSON();

      // Step 3: Save canvas JSON to the database
      const response = await fetch("/api/saveCanvas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: canvasName,
          content: canvasJSON,
          status: postImmediately ? "posted" : "draft",
        }),
      });

      if (response.ok) {
        alert("Canvas and images saved successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to save canvas: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error saving canvas or images:", error);
      alert("An error occurred while saving.");
    }
  };

  return (
    <div>
      <div className="Toolbar darkmode">
        <Button
          onClick={addRectangle}
          variant="outlined"
          startIcon={<FaSquare />}
        ></Button>
        <Button
          onClick={addCircle}
          variant="outlined"
          startIcon={<FaCircle />}
        ></Button>
        <Button
          onClick={addText}
          variant="outlined"
          startIcon={<FaFont />}
        ></Button>
        <Image canvas={canvas} canvasRef={canvasRef} />
        <Button
          onClick={saveCanvas}
          variant="contained"
          startIcon={<FaSave />}
        ></Button>

        <FormControlLabel
          control={
            <Checkbox
              checked={postImmediately}
              onChange={(e) => setPostImmediately(e.target.checked)}
            />
          }
          label="Post"
        />
      </div>
      <canvas id="canvas" ref={canvasRef} />
      <Settings canvas={canvas} />
    </div>
  );
}
