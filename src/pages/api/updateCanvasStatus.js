// pages/api/updateCanvasStatus.js
import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { name, status } = req.body;
  if (!name || !status) {
    return res
      .status(400)
      .json({ error: "Canvas name and status are required." });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db("canvasDatabase");
    const collection = db.collection("canvases");

    const result = await collection.updateOne({ name }, { $set: { status } });

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ error: "Canvas not found. Update operation failed." });
    }

    return res.status(200).json({ message: "Canvas status updated." });
  } catch (error) {
    console.error("Error updating canvas status:", error);
    return res.status(500).json({ error: "Failed to update canvas status." });
  }
}
