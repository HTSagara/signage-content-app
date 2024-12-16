import Navbar from "@/app/components/navbar/navbar";
import Link from "next/link";
import path from "path";
import fs from "fs/promises";
import "@/styles/styles.scss";
import { useState } from "react";

export async function getStaticProps() {
  const filePath = path.join(
    process.cwd(),
    "src",
    "app",
    "database",
    "memory-db.json"
  );

  let canvasList = [];
  try {
    const fileData = await fs.readFile(filePath, "utf8");
    canvasList = JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading memory-db.json:", error);
  }

  return {
    props: { canvasList },
  };
}

export default function Menu({ canvasList }) {
  const [canvases, setCanvases] = useState(canvasList);

  // Function to post a draft canvas
  const postCanvas = async (name) => {
    try {
      const response = await fetch("/api/updateCanvasStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, status: "posted" }),
      });

      if (response.ok) {
        alert("Canvas updated to posted!");
        setCanvases((prevCanvases) =>
          prevCanvases.map((canvas) =>
            canvas.name === name ? { ...canvas, status: "posted" } : canvas
          )
        );
      } else {
        const errorData = await response.json();
        alert(`Failed to update canvas: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating canvas status:", error);
      alert("An error occurred while updating the canvas.");
    }
  };

  // Function to delete a canvas
  const deleteCanvas = async (name) => {
    try {
      const response = await fetch("/api/deleteCanvas", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        alert("Canvas deleted successfully!");
        setCanvases((prevCanvases) =>
          prevCanvases.filter((canvas) => canvas.name !== name)
        );
      } else {
        const errorData = await response.json();
        alert(`Failed to delete canvas: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting canvas:", error);
      alert("An error occurred while deleting the canvas.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="Menu">
        <header>
          <h1>Saved Canvases</h1>
        </header>
        <main>
          {canvases.length > 0 ? (
            <ul>
              {canvases.map((canvas, index) => (
                <li key={index} className="CanvasItem">
                  <div>
                    <h3>{canvas.name}</h3>
                    <p>Objects: {canvas.content.objects.length}</p>
                    <p>
                      Status:{" "}
                      <span
                        className={`status ${
                          canvas.status === "posted" ? "posted" : "draft"
                        }`}
                      >
                        {canvas.status || "draft"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <Link href={`/canvas/${canvas.name}`}>
                      <button>Edit</button>
                    </Link>
                    <button
                      onClick={() => postCanvas(canvas.name)}
                      disabled={canvas.status === "posted"}
                    >
                      {canvas.status === "posted" ? "Posted" : "Post"}
                    </button>
                    <button onClick={() => deleteCanvas(canvas.name)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No canvases found. Start by creating one!</p>
          )}
        </main>

        <style jsx>{`
          .Menu {
            font-family: Arial, sans-serif;
            padding: 20px;
            text-align: center;
          }

          ul {
            list-style: none;
            padding: 0;
          }

          .CanvasItem {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            border: 1px solid #ddd;
            margin-bottom: 10px;
            border-radius: 5px;
          }

          .status {
            font-weight: bold;
          }

          .status.posted {
            color: green;
          }

          .status.draft {
            color: orange;
          }

          button {
            background: #6200ea;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            margin-left: 8px;
          }

          button:hover {
            background: #3700b3;
          }

          button:disabled {
            background: #bdbdbd;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </>
  );
}
