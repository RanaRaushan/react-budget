import React, { useState } from "react";
import { upload_budget } from "../../utils/APIHelper";


export default function Uploadbudget() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await upload_budget(formData);

      setMessage(res.data);
    } catch (err) {
      setMessage("Upload failed. Make sure the backend is running.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-indigo-600 p-6">
      <div className="bg-blue shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Upload Excel File</h2>

        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="w-full border p-2 rounded mb-4"
        />

        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Upload
        </button>

        {message && (
          <p className="mt-4 text-center text-sm text-red-700">{message}</p>
        )}
      </div>
    </div>
  );
};
