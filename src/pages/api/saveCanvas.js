// pages/api/saveCanvas.js
import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, content, status } = req.body;
  if (!name || !content) {
    return res
      .status(400)
      .json({ error: "Canvas name and content are required" });
  }

  try {
    const client = await connectToDatabase();
    const db = client.db("canvasDatabase");
    const collection = db.collection("canvases");

    // Use updateOne with upsert option
    const result = await collection.updateOne(
      { name }, // find by name
      {
        $set: {
          content,
          status,
          updatedAt: new Date(), // Add timestamp
          ...(!(await collection.findOne({ name })) && {
            createdAt: new Date(),
          }), // Add creation date for new canvases
        },
      },
      { upsert: true } // Create if doesn't exist, update if does
    );

    return res.status(200).json({
      message:
        result.upsertedCount > 0
          ? "Canvas created successfully!"
          : "Canvas updated successfully!",
      operation: result.upsertedCount > 0 ? "created" : "updated",
    });
  } catch (error) {
    console.error("Error saving canvas:", error);
    return res.status(500).json({ error: "Failed to save canvas" });
  }
}
