//src/app/components/canvas/toolbar.js
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Canvas, Rect, Circle, Textbox } from "fabric";
import { FaSquare, FaCircle, FaFont, FaSave, FaExpand } from "react-icons/fa";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import "@/styles/styles.scss";
import Settings from "./settings";
import Image from "./image";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useCanvasSync } from "../../hooks/useCanvasSync";

export default function Toolbar({ initialCanvasData }) {
  // Refs and state management
  const canvasRef = useRef(null);
  const wsRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [postImmediately, setPostImmediately] = useState(false);
  const [resizeDialogOpen, setResizeDialogOpen] = useState(false);
  const [canvasSize, setCanvasSize] = useState({
    width: 500,
    height: 500,
  });

  // Use the custom hooks
  useWebSocket(wsRef);
  useCanvasSync(canvas, wsRef);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    // Create new canvas instance
    const initCanvas = new Canvas(canvasRef.current, {
      width: canvasSize.width,
      height: canvasSize.height,
      backgroundColor: initialCanvasData?.background || "#fff",
    });

    // Load existing canvas data if available
    if (initialCanvasData?.content.objects) {
      const canvasJSON = {
        ...initialCanvasData.content,
        objects: initialCanvasData.content.objects.map((obj) => ({
          ...obj,
          src:
            obj.type === "image" && obj.src.startsWith("blob:")
              ? "/uploads/default-image.png"
              : obj.src,
        })),
      };

      initCanvas
        .loadFromJSON(canvasJSON)
        .then(() => {
          console.log("Canvas successfully loaded");
          initCanvas.requestRenderAll();
        })
        .catch((error) => {
          console.error("Error loading canvas:", error);
        });
    } else {
      initCanvas.requestRenderAll();
    }

    setCanvas(initCanvas);

    return () => {
      initCanvas.dispose();
    };
  }, [initialCanvasData, canvasSize]);

  // Canvas modification handlers
  const addRectangle = () => {
    if (!canvas) return;

    const rect = new Rect({
      top: 100,
      left: 50,
      width: 100,
      height: 60,
      fill: "#D84D42",
    });
    canvas.add(rect);
    canvas.requestRenderAll();
  };

  const addCircle = () => {
    if (!canvas) return;

    const circ = new Circle({
      top: 100,
      left: 50,
      radius: 60,
      fill: "#0000FF",
    });
    canvas.add(circ);
    canvas.requestRenderAll();
  };

  const addText = () => {
    if (!canvas) return;

    const textBox = new Textbox("Enter text here", {
      left: 100,
      top: 300,
      fill: "black",
      fontSize: 24,
    });
    canvas.add(textBox);
    canvas.requestRenderAll();
  };

  // Canvas resize handlers
  const handleResizeDialogOpen = () => setResizeDialogOpen(true);
  const handleResizeDialogClose = () => setResizeDialogOpen(false);

  const handleResizeCanvas = () => {
    if (!canvas) return;

    const json = canvas.toJSON();
    canvas.setWidth(canvasSize.width);
    canvas.setHeight(canvasSize.height);
    canvas.clear();

    canvas.loadFromJSON(json, () => {
      canvas.requestRenderAll();

      // Broadcast canvas update after resize
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "canvas-update",
            data: canvas.toJSON(),
          })
        );
      }
    });

    setResizeDialogOpen(false);
  };

  // Save canvas to backend
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
      // Handle image uploads
      const objects = canvas.getObjects();
      const imageUploadPromises = objects
        .filter((obj) => obj.type === "image" && obj._element)
        .map((obj) => {
          return new Promise((resolve, reject) => {
            const imageElement = obj._element;
            const tempCanvas = document.createElement("canvas");
            const context = tempCanvas.getContext("2d");

            tempCanvas.width = imageElement.naturalWidth || imageElement.width;
            tempCanvas.height =
              imageElement.naturalHeight || imageElement.height;
            context.drawImage(imageElement, 0, 0);

            tempCanvas.toBlob(async (blob) => {
              if (!blob) {
                return reject("Failed to create image blob");
              }

              const formData = new FormData();
              formData.append("file", blob);

              try {
                const uploadResponse = await fetch("/api/uploadImage", {
                  method: "POST",
                  body: formData,
                });

                const uploadResult = await uploadResponse.json();

                if (uploadResponse.ok) {
                  obj.set("src", uploadResult.url);
                  obj._element.src = uploadResult.url;
                  resolve();
                } else {
                  reject(uploadResult.error);
                }
              } catch (error) {
                reject(error);
              }
            }, "image/png");
          });
        });

      await Promise.all(imageUploadPromises);

      // Save canvas data
      const response = await fetch("/api/saveCanvas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: canvasName,
          content: canvas.toJSON(),
          status: postImmediately ? "posted" : "draft",
        }),
      });

      if (response.ok) {
        alert("Canvas saved successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.error("Error saving canvas:", error);
      alert(`Failed to save canvas: ${error.message}`);
    }
  };

  // Render UI
  return (
    <div>
      <div className="Toolbar darkmode">
        <Button
          onClick={addRectangle}
          variant="outlined"
          startIcon={<FaSquare />}
        />
        <Button
          onClick={addCircle}
          variant="outlined"
          startIcon={<FaCircle />}
        />
        <Button onClick={addText} variant="outlined" startIcon={<FaFont />} />
        <Image canvas={canvas} canvasRef={canvasRef} />
        <Button
          onClick={handleResizeDialogOpen}
          variant="outlined"
          startIcon={<FaExpand />}
          title="Resize Canvas"
        />
        <Button
          onClick={saveCanvas}
          variant="contained"
          startIcon={<FaSave />}
        />
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

      <Dialog open={resizeDialogOpen} onClose={handleResizeDialogClose}>
        <DialogTitle>Resize Canvas</DialogTitle>
        <DialogContent>
          <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
            <TextField
              label="Width"
              type="number"
              value={canvasSize.width}
              onChange={(e) =>
                setCanvasSize((prev) => ({
                  ...prev,
                  width: parseInt(e.target.value) || prev.width,
                }))
              }
              InputProps={{
                inputProps: { min: 1 },
              }}
            />
            <TextField
              label="Height"
              type="number"
              value={canvasSize.height}
              onChange={(e) =>
                setCanvasSize((prev) => ({
                  ...prev,
                  height: parseInt(e.target.value) || prev.height,
                }))
              }
              InputProps={{
                inputProps: { min: 1 },
              }}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleResizeDialogClose}>Cancel</Button>
          <Button onClick={handleResizeCanvas} variant="contained">
            Resize
          </Button>
        </DialogActions>
      </Dialog>

      <canvas id="canvas" ref={canvasRef} />
      <Settings canvas={canvas} />
    </div>
  );
}
