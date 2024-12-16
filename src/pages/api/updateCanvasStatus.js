import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = "canvasDatabase";
const collectionName = "canvases";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { name, status } = req.body;

    if (!name || !status) {
      return res
        .status(400)
        .json({ error: "Canvas name and status are required." });
    }

    const client = new MongoClient(uri);

    try {
      await client.connect();
      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      const result = await collection.updateOne(
        { name }, // Find canvas by name
        { $set: { status } } // Update the status
      );

      if (result.matchedCount === 0) {
        return res
          .status(404)
          .json({ error: "Canvas not found. Update operation failed." });
      }

      return res.status(200).json({ message: "Canvas status updated." });
    } catch (error) {
      console.error("Error updating canvas status:", error);
      return res.status(500).json({ error: "Failed to update canvas status." });
    } finally {
      await client.close();
    }
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
