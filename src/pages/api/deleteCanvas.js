// src/pages/api/deleteCanvas.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Canvas name is required" });
    }

    try {
      await client.connect();
      const db = client.db("canvasDatabase");
      const collection = db.collection("canvases");

      const result = await collection.deleteOne({ name });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Canvas not found" });
      }

      res.status(200).json({ message: "Canvas deleted successfully!" });
    } catch (error) {
      console.error("Error deleting canvas:", error);
      res.status(500).json({ error: "Failed to delete canvas" });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
