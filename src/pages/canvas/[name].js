// src/pages/canvas/[name].js
import Toolbar from "@/app/components/canvas/toolbar";
import "@/styles/styles.scss";
import Navbar from "@/app/components/navbar/navbar";
import styles from "@/styles/name.module.scss";
import { connectToDatabase } from "@/lib/mongodb";

export async function getServerSideProps(context) {
  const { name } = context.params;
  let canvasData = null;

  try {
    const client = await connectToDatabase();
    const db = client.db("canvasDatabase");
    const collection = db.collection("canvases");

    canvasData = await collection.findOne({ name });
    if (canvasData) {
      canvasData = JSON.parse(JSON.stringify(canvasData));
    }
  } catch (error) {
    console.error("Error fetching canvas data from MongoDB:", error);
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
      <Navbar />
      <div className="App">
        <Toolbar initialCanvasData={canvasData} />
      </div>
    </div>
  );
}
