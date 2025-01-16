// src/pages/canvas/[name].js
import Toolbar from "@/app/components/canvas/toolbar";
import "@/styles/styles.scss";
import Navbar from "@/app/components/navbar/navbar";
import styles from "@/styles/name.module.scss";
import { MongoClient } from "mongodb";

export async function getServerSideProps(context) {
  const { name } = context.params;

  // MongoDB connection URI
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  let canvasData = null;

  try {
    // Connect to the database
    await client.connect();
    const db = client.db("canvasDatabase");
    const collection = db.collection("canvases");

    // Find the canvas by name
    canvasData = await collection.findOne({ name });

    if (canvasData) {
      canvasData = JSON.parse(JSON.stringify(canvasData)); // Serialize for Next.js
    }
  } catch (error) {
    console.error("Error fetching canvas data from MongoDB:", error);
  } finally {
    await client.close();
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
