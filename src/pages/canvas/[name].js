import Toolbar from "@/app/components/canvas/toolbar";
import path from "path";
import fs from "fs/promises";
import "@/styles/styles.scss";
import Navbar from "@/app/components/navbar/navbar";

export async function getServerSideProps(context) {
  const { name } = context.params;

  const filePath = path.join(process.cwd(), "src/app/database/memory-db.json");
  let canvasData = null;

  try {
    const fileData = await fs.readFile(filePath, "utf8");
    console.log("File data:", fileData); // Debug log
    const canvases = JSON.parse(fileData);
    console.log("Parsed canvases:", canvases); // Debug log
    canvasData = canvases.find((canvas) => canvas.name === name) || null;
    console.log("Found canvasData:", canvasData); // Debug log
  } catch (error) {
    console.error("Error reading memory-db.json:", error);
  }

  if (!canvasData) {
    console.error(`Canvas with name "${name}" not found.`);
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
    <div>
      <Navbar />
      <div className="App">
        <Toolbar initialCanvasData={canvasData.content} />
      </div>
    </div>
  );
}
