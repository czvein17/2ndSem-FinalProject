// src/components/FileUpload.js
import { useState } from "react";

const FileUpload = () => {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <div>
      <button onClick={handleUpload}>Upload File</button>
      {uploadStatus && <p>{uploadStatus}</p>}
      {selectedImage && <img src={selectedImage} alt="Selected" />}
    </div>
  );
};

export default FileUpload;
