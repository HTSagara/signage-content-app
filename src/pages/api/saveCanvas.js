// src/pages/api/saveCanvas.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, content, status } = req.body;

    if (!name || !content) {
      return res
        .status(400)
        .json({ error: "Canvas name and content are required" });
    }

    try {
      await client.connect();
      const db = client.db("canvasDatabase");
      const collection = db.collection("canvases");

      const existingCanvas = await collection.findOne({ name });
      if (existingCanvas) {
        await collection.updateOne({ name }, { $set: { content, status } });
      } else {
        await collection.insertOne({ name, content, status });
      }

      res.status(200).json({ message: "Canvas saved successfully!" });
    } catch (error) {
      console.error("Error saving canvas:", error);
      res.status(500).json({ error: "Failed to save canvas" });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
