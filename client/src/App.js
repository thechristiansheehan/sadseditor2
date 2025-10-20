import React, { useState, useRef } from "react";
import "./App.css";

function App() {
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

  return (
    <div
      style={{
        backgroundColor: "#252525",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: '"Riona Sans W01 Medium", sans-serif',
        fontSize: "1rem",
      }}
    >
      <img
        src="https://sads.club/static/media/sads_logo.88d07e896311a6f9aa80.png"
        alt="SADS Logo"
        style={{
          height: "125px",
          display: "block",
          margin: "0 auto 15px auto",
        }}
      />
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{
          backgroundColor: isDragging ? "#505050" : "#404040",
          padding: "15px",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <input
          type="file"
          accept="image/jpeg,.jpg"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{
            color: "white",
            width: "100%",
            marginBottom: "10px",
          }}
        />
        <button
          onClick={handleUpload}
          style={{
            backgroundColor: "#606060",
            color: "white",
            padding: "8px 16px",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
            filter: "brightness(100%)",
          }}
          onMouseEnter={(e) => (e.target.style.filter = "brightness(85%)")}
          onMouseLeave={(e) => (e.target.style.filter = "brightness(100%)")}
        >
          Upload
        </button>
      </div>
      {!uploadDone && (
        <div
          style={{
            marginTop: "0px",
            textAlign: "center",
            color: "#aaa",
            fontSize: "0.9rem",
            maxWidth: "400px",
          }}
        >
          <p>Allowed file names:</p>
          <p style={{ whiteSpace: "pre-line", margin: 0 }}>
            {allowedFiles.join("\n")}
          </p>
        </div>
      )}
      {message && (
        <p style={{ marginTop: "15px", marginBottom: "0px", color: "white" }}>
          {message}
        </p>
      )}
      {imageUrl && (
        <div style={{ marginTop: "0px", textAlign: "center" }}>
          <p style={{ marginBottom: "5px" }}>Uploaded image:</p>
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1e90ff", marginTop: "0px" }}
          >
            {imageUrl}
          </a>
          <div>
            <img
              src={imageUrl}
              alt="Uploaded file"
              style={{
                width: "300px",
                marginTop: "10px",
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "0px",
              }}
            />
          </div>
        </div>
      )}
      <div
        style={{
          marginTop: "20px",
          backgroundColor: "#404040",
          padding: "15px",
          width: "100%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <form onSubmit={handleDelete}>
          <input
            type="text"
            placeholder="Type file name to delete (e.g. banner1.jpg)"
            value={deleteInput}
            onChange={(e) => setDeleteInput(e.target.value)}
            style={{
              width: "90%",
              padding: "8px",
              marginBottom: "10px",
              border: "none",
              outline: "none",
              backgroundColor: "#555",
              color: "white",
              textAlign: "center",
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: "#c0392b",
              color: "white",
              padding: "8px 16px",
              border: "none",
              cursor: "pointer",
              fontSize: "1rem",
              filter: "brightness(100%)",
            }}
            onMouseEnter={(e) => (e.target.style.filter = "brightness(85%)")}
            onMouseLeave={(e) => (e.target.style.filter = "brightness(100%)")}
          >
            Delete
          </button>
        </form>
        {deleteMessage && (
          <p style={{ marginTop: "10px", marginBottom: "0px", color: "white" }}>
            {deleteMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
