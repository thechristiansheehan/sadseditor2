import React from "react";
import { Routes, Route } from "react-router-dom";
import Resources from "./Resources";
import Images from "./images";
import Home from "./Home";

function App() {
<<<<<<< HEAD
=======
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const fileInputRef = useRef(null);

  const allowedFiles = [
    "banner1.jpg",
    "banner2.jpg",
    "banner3.jpg",
    "about.jpg",
    "nia.jpg",
    "sarah.jpg",
    "mara.jpg",
    "hillary.jpg",
    "radha.jpg",
    "christian.jpg",
    "ameen.jpg",
  ];

  const isValidFile = (file) => {
    const validType =
      file.type === "image/jpeg" || file.name.toLowerCase().endsWith(".jpg");
    const validName = allowedFiles.includes(file.name.toLowerCase());
    return validType && validName;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (isValidFile(selectedFile)) {
        console.log("File selected via input:", selectedFile.name);
        setFile(selectedFile);
        setMessage("");
      } else {
        setMessage("Invalid file. Please select one of the allowed .jpg files.");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (isValidFile(droppedFile)) {
        console.log("File dropped:", droppedFile.name);
        setFile(droppedFile);
        setMessage("");
      } else {
        setMessage("Invalid file. Please drop one of the allowed .jpg files.");
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select or drop a valid .jpg file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://sadseditor-production.up.railway.app/upload", {
  method: "POST",
  body: formData,
});

      const data = await response.json();

      if (response.ok) {
         setMessage("Upload successful!");
        setImageUrl(`https://sadseditor-production.up.railway.app/uploads/${data.filename}`);
        setDeleteInput(file.name);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setMessage(`Upload failed: ${data.message || "Server error"}`);
      }
    } catch (error) {
      console.error("Upload error:", error.message);
      setMessage(`Upload failed: ${error.message}`);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    const filename = deleteInput.trim();
    if (!filename) {
      setDeleteMessage("Please enter a file name.");
      return;
    }

    if (!allowedFiles.includes(filename.toLowerCase())) {
      setDeleteMessage("That filename is not in the allowed list.");
      setDeleteInput("");
      return;
    }

    const baseUrl =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://sadseditor-production.up.railway.app";

    try {
      const response = await fetch(
        `${baseUrl}/delete/${encodeURIComponent(filename)}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setDeleteMessage(data.message || "File deleted successfully.");
        if (imageUrl && imageUrl.endsWith(filename)) {
          setImageUrl("");
          setUploadDone(false);
        }
      } else {
        setDeleteMessage(
          data.message || `Delete failed (status ${response.status})`
        );
      }
    } catch (error) {
      console.error("Delete error:", error.message);
      setDeleteMessage(`Delete failed: ${error.message}`);
    }

    setDeleteInput("");
  };

>>>>>>> ace65c38caf1e0f16a04d9710950ce6908cfa1c5
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/images" element={<Images />} />
        <Route path="/resources" element={<Resources />} />
      </Routes>
    </div>
  );
}

export default App;
