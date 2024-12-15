import Toolbar from "@/app/components/canvas/toolbar";
import path from "path";
import fs from "fs/promises";
import "@/styles/styles.scss";
import Navbar from "@/app/components/navbar/navbar";
import styles from "./name.module.scss"; // Import the SCSS module

export async function getServerSideProps(context) {
  const { name } = context.params;

  const filePath = path.join(process.cwd(), "src/app/database/memory-db.json");
  let canvasData = null;

  try {
    const fileData = await fs.readFile(filePath, "utf8");
    const canvases = JSON.parse(fileData);
    canvasData = canvases.find((canvas) => canvas.name === name) || null;
  } catch (error) {
    console.error("Error reading memory-db.json:", error);
  }

  if (!canvasData) {
    return { notFound: true };
  }

  return {
    props: {
      canvasData,
    },
  };
}

export default function CanvasPage({ canvasData }) {
  if (!canvasData) {
    return <h1>Canvas not found</h1>;
  }

  return (
    <div className={styles.page}>
      {" "}
      {/* Apply the styles here */}
      <Navbar />
      <div className="App">
        <Toolbar initialCanvasData={canvasData.content} />
      </div>
    </div>
  );
}
