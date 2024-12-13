import React, { useEffect, useRef, useState } from "react";
import { Canvas, Rect, Circle, Textbox } from "fabric";
import { IconButton } from "blocksin-system";
import { CircleIcon, SquareIcon, TextIcon } from "sebikostudio-icons";
import "../../styles/styles.scss";
import Settings from "./settings";

export default function Toolbar() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
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
      </div>
      <canvas id="canvas" ref={canvasRef} />
      <Settings canvas={canvas} />
    </div>
  );
}
