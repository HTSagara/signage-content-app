import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { name, status } = req.body;

    if (!name || !status) {
      return res
        .status(400)
        .json({ error: "Canvas name and status are required." });
    }

    const filePath = path.resolve("./src/app/database/memory-db.json");

    try {
      const fileData = await fs.readFile(filePath, "utf8");
      const canvases = JSON.parse(fileData);

      const updatedCanvases = canvases.map((canvas) =>
        canvas.name === name ? { ...canvas, status } : canvas
      );

      await fs.writeFile(
        filePath,
        JSON.stringify(updatedCanvases, null, 2),
        "utf8"
      );

      return res.status(200).json({ message: "Canvas status updated." });
    } catch (error) {
      console.error("Error updating canvas status:", error);
      return res.status(500).json({ error: "Failed to update canvas status." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
