import Navbar from "@/app/components/navbar/navbar";
import Link from "next/link";
import path from "path";
import fs from "fs/promises";
import "@/styles/styles.scss";

export async function getStaticProps() {
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
    <>
      <Navbar />
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
                    <p>
                      Status:{" "}
                      <span
                        className={`status ${
                          canvas.status === "posted" ? "posted" : "draft"
                        }`}
                      >
                        {canvas.status || "draft"}
                      </span>
                    </p>
                  </div>
                  <div>
                    <Link href={`/canvas/${canvas.name}`}>
                      <button>Edit</button>
                    </Link>
                    <button>Post</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No canvases found. Start by creating one!</p>
          )}
        </main>

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

          .status {
            font-weight: bold;
          }

          .status.posted {
            color: green;
          }

          .status.draft {
            color: orange;
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
    </>
  );
}
