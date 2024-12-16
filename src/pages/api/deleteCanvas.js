import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ error: "Canvas name is required" });
      return;
    }

    const filePath = path.resolve("./src/app/database/memory-db.json");

    try {
      const fileData = await fs.readFile(filePath, "utf8");
      const canvases = JSON.parse(fileData);

      const updatedCanvases = canvases.filter((canvas) => canvas.name !== name);

      await fs.writeFile(
        filePath,
        JSON.stringify(updatedCanvases, null, 2),
        "utf8"
      );

      res.status(200).json({ message: "Canvas deleted successfully!" });
    } catch (error) {
      console.error("Error deleting canvas:", error);
      res.status(500).json({ error: "Failed to delete canvas" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
