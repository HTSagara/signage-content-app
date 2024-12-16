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

      // Load existing canvas data if available
      if (initialCanvasData?.objects) {
        initCanvas
          .loadFromJSON(initialCanvasData) // Directly use the JSON object
          .then(() => {
            console.log("Canvas successfully loaded.");
            initCanvas.requestRenderAll(); // Ensure rendering happens after loading
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

    const canvasJSON = canvas.toJSON();
    try {
      const response = await fetch("/api/saveCanvas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: canvasName,
          content: canvasJSON,
          status: postImmediately ? "posted" : "draft", // Persist checkbox status
        }),
      });

      if (response.ok) {
        alert("Canvas saved successfully!");
      } else {
        const errorData = await response.json();
        alert(`Failed to save canvas: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error saving canvas:", error);
      alert("An error occurred while saving the canvas.");
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
          label="Post immediately"
        />
      </div>
      <canvas id="canvas" ref={canvasRef} />
      <Settings canvas={canvas} />
    </div>
  );
}
