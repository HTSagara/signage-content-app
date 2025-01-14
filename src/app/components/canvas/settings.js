import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { Typography } from "@mui/material";

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
    <div className="Settings">
      <Typography
        variant="h6"
        sx={{ color: "var(--text-primary)", mb: 2 }}
      ></Typography>

      {selectedObject && selectedObject.type === "rect" && (
        <>
          <TextField
            fullWidth
            label="Width"
            value={width}
            type="number"
            onChange={(e) => {
              setWidth(e.target.value);
              updateObject("width", parseInt(e.target.value, 10));
            }}
            InputProps={{
              inputProps: { min: 1 },
            }}
          />
          <TextField
            fullWidth
            label="Height"
            value={height}
            type="number"
            onChange={(e) => {
              setHeight(e.target.value);
              updateObject("height", parseInt(e.target.value, 10));
            }}
            InputProps={{
              inputProps: { min: 1 },
            }}
          />
        </>
      )}

      {selectedObject && selectedObject.type === "circle" && (
        <TextField
          fullWidth
          label="Diameter"
          value={diameter}
          type="number"
          onChange={(e) => {
            setDiameter(e.target.value);
            updateObject("radius", parseInt(e.target.value, 10) / 2);
          }}
          InputProps={{
            inputProps: { min: 1 },
          }}
        />
      )}

      <TextField
        fullWidth
        label="Color"
        value={color}
        onChange={(e) => {
          setColor(e.target.value);
          updateObject("fill", e.target.value);
        }}
        InputProps={{
          endAdornment: (
            <div
              style={{
                width: 20,
                height: 20,
                backgroundColor: color,
                borderRadius: 4,
                border: "1px solid var(--border-color)",
              }}
            />
          ),
        }}
      />
    </div>
  );
}
