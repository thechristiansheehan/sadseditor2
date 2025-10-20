import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log(`Created uploads directory: ${uploadDir}`);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`Destination: ${uploadDir}`);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    console.log(`Received file: ${file.originalname}`);
    console.log(`Saving as: ${file.originalname}`);
    cb(null, file.originalname); // Use original file name
  },
});

const upload = multer({ storage });
app.get("/", (req, res) => {
  res.send("Server is running! 🚀");
});

// Log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Upload route
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    console.log("No file received");
    return res.status(400).json({ message: "No file uploaded." });
  }
  console.log(`Uploaded: ${req.file.originalname}`);
  console.log(`Saved as: ${req.file.filename}`);
  console.log(`Path: ${req.file.path}`);
  res.json({ filename: req.file.originalname });
});

// Delete route
app.delete("/delete/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadDir, filename);

  console.log(`Deleting: ${filePath}`);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return res.status(404).json({ message: "File not found." });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Delete error: ${err.message}`);
      return res.status(500).json({ message: "Error deleting file." });
    }
    console.log(`Deleted: ${filename}`);
    res.json({ message: "File deleted successfully." });
  });
});

// Serve uploaded files
app.use("/uploads", express.static(uploadDir));

// Start server
app.listen(5000, () => console.log("Server running on http://localhost:5000"));
