// src/pages/menu.js
import Link from "next/link";
import path from "path";
import fs from "fs/promises";

export async function getStaticProps() {
  // Path to the JSON database
  const filePath = path.join(
    process.cwd(),
    "src",
    "app",
    "database",
    "memory-db.json"
  );

  let canvasList = [];
  try {
    const fileData = await fs.readFile(filePath, "utf8");
    canvasList = JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading memory-db.json:", error);
  }

  return {
    props: { canvasList },
  };
}

export default function Menu({ canvasList }) {
  return (
    <div className="Menu">
      <header>
        <h1>Saved Canvases</h1>
      </header>
      <main>
        {canvasList.length > 0 ? (
          <ul>
            {canvasList.map((canvas, index) => (
              <li key={index} className="CanvasItem">
                <div>
                  <h3>{canvas.name}</h3>
                  <p>Objects: {canvas.content.objects.length}</p>
                </div>
                <div>
                  {/* Link to the canvas editor page */}
                  <Link href={`/canvas/${canvas.name}`}>
                    <button>Load</button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No canvases found. Start by creating one!</p>
        )}
      </main>
      <footer>
        <Link href="/">
          <button>Back to Home</button>
        </Link>
      </footer>

      <style jsx>{`
        .Menu {
          font-family: Arial, sans-serif;
          padding: 20px;
          text-align: center;
        }

        ul {
          list-style: none;
          padding: 0;
        }

        .CanvasItem {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border: 1px solid #ddd;
          margin-bottom: 10px;
          border-radius: 5px;
        }

        button {
          background: #6200ea;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 5px;
          cursor: pointer;
        }

        button:hover {
          background: #3700b3;
        }
      `}</style>
    </div>
  );
}
