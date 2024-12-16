// src/app/pages/api/saveCanvas.js
import fs from "fs/promises";
import path from "path";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, content, status } = req.body;
    if (!name || !content) {
      res.status(400).json({ error: "Canvas name and content are required" });
      return;
    }

    const filePath = path.resolve("./src/app/database/memory-db.json");

    try {
      // Read the existing data from memory-db.json
      const fileData = await fs.readFile(filePath, "utf8");
      const jsonData = fileData ? JSON.parse(fileData) : [];

      // Append the new canvas data with the status
      jsonData.push({ name, content, status });

      // Write the updated data back to the file
      await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), "utf8");

      res.status(200).json({ message: "Canvas saved successfully!" });
    } catch (error) {
      console.error("Error saving canvas:", error);
      res.status(500).json({ error: "Failed to save canvas" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
