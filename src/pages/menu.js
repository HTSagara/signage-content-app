// pages/menu.js
import Navbar from "@/app/components/navbar/navbar";
import Link from "next/link";
import "@/styles/styles.scss";
import styles from "@/styles/menu.module.scss";
import { useState } from "react";
import { connectToDatabase } from "@/lib/mongodb";

export async function getServerSideProps() {
  let canvasList = [];
  try {
    const client = await connectToDatabase();
    const db = client.db("canvasDatabase");
    const collection = db.collection("canvases");

    canvasList = await collection.find({}).toArray();
  } catch (error) {
    console.error("Error fetching canvases:", error);
  }

  return {
    props: { canvasList: JSON.parse(JSON.stringify(canvasList)) },
  };
}

export default function Menu({ canvasList }) {
  const [canvases, setCanvases] = useState(canvasList);

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
      <div className={styles.Menu}>
        <header>
          <h1>Saved Canvases</h1>
        </header>
        <main>
          {canvases.length > 0 ? (
            <ul className={styles.list}>
              {canvases.map((canvas, index) => (
                <li key={index} className={styles.CanvasItem}>
                  <div>
                    <h3>{canvas.name}</h3>
                    <p>Objects: {canvas.content.objects.length}</p>
                    <p>
                      Status:{" "}
                      <span
                        className={`${styles.status} ${
                          canvas.status === "posted"
                            ? styles.posted
                            : styles.draft
                        }`}
                      >
                        {canvas.status || "draft"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <Link href={`/canvas/${canvas.name}`}>
                      <button className={styles.button}>Edit</button>
                    </Link>
                    <button
                      className={styles.button}
                      onClick={() => postCanvas(canvas.name)}
                      disabled={canvas.status === "posted"}
                    >
                      {canvas.status === "posted" ? "Posted" : "Post"}
                    </button>
                    <button
                      className={styles.button}
                      onClick={() => deleteCanvas(canvas.name)}
                    >
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
      </div>
    </>
  );
}
