import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";

export default function Settings({ canvas }) {
  const [selectedObject, setSelectedObject] = useState(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [diameter, setDiameter] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", (event) =>
        handleObjectSelection(event.selected[0])
      );
      canvas.on("selection:updated", (event) =>
        handleObjectSelection(event.selected[0])
      );
      canvas.on("selection:cleared", clearSettings);
    }
  }, [canvas]);

  const handleObjectSelection = (object) => {
    if (!object) return;
    setSelectedObject(object);

    if (object.type === "rect") {
      setWidth(Math.round(object.width * object.scaleX));
      setHeight(Math.round(object.height * object.scaleY));
      setColor(object.fill);
    } else if (object.type === "circle") {
      setDiameter(Math.round(object.radius * 2 * object.scaleX));
      setColor(object.fill);
    }
  };

  const clearSettings = () => {
    setWidth("");
    setHeight("");
    setDiameter("");
    setColor("");
  };

  const updateObject = (key, value) => {
    if (!selectedObject) return;
    selectedObject.set({ [key]: value });
    canvas.renderAll();
  };

  return (
    <div className="Settings darkmode">
      {selectedObject && selectedObject.type === "rect" && (
        <>
          <TextField
            label="Width"
            value={width}
            onChange={(e) => {
              setWidth(e.target.value);
              updateObject("width", parseInt(e.target.value, 10));
            }}
          />
          <TextField
            label="Height"
            value={height}
            onChange={(e) => {
              setHeight(e.target.value);
              updateObject("height", parseInt(e.target.value, 10));
            }}
          />
        </>
      )}
      {selectedObject && selectedObject.type === "circle" && (
        <TextField
          label="Diameter"
          value={diameter}
          onChange={(e) => {
            setDiameter(e.target.value);
            updateObject("radius", parseInt(e.target.value, 10) / 2);
          }}
        />
      )}
      <TextField
        label="Color"
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
          updateObject("fill", e.target.value);
        }}
      />
    </div>
  );
}
