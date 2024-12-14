// src/app/components/Toolbar.js
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Canvas, Rect, Circle, Textbox } from "fabric";
import { CircleIcon, SquareIcon, TextIcon } from "sebikostudio-icons";
import "./styles.scss";
import Settings from "./settings";
import Image from "./image";

import dynamic from "next/dynamic";
const IconButton = dynamic(
  () => import("blocksin-system").then((mod) => mod.IconButton),
  { ssr: false }
);

export default function Toolbar() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    if (canvasRef.current && typeof document !== "undefined") {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 500,
        height: 500,
      });
      initCanvas.backgroundColor = "#fff";
      initCanvas.renderAll();
      setCanvas(initCanvas);
      return () => {
        initCanvas.dispose();
      };
    }
  }, []);

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

  return (
    <div>
      <div className="Toolbar darkmode">
        <IconButton onClick={addRectangle} variant="ghost" size="medium">
          <SquareIcon />
        </IconButton>
        <IconButton onClick={addCircle} variant="ghost" size="medium">
          <CircleIcon />
        </IconButton>
        <IconButton onClick={addText} variant="ghost" size="medium">
          <TextIcon />
        </IconButton>
        <Image canvas={canvas} canvasRef={canvasRef} />
      </div>
      <canvas id="canvas" ref={canvasRef} />
      <Settings canvas={canvas} />
    </div>
  );
}
