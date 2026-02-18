"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8000/analyze-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setResult(res.data.result);
      setConfidence(res.data.confidence);
    } catch (error) {
      console.error(error);
      alert("Backend not running or wrong URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-black to-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6">🛡️ Image Guard AI</h1>

      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        <button
          onClick={handleUpload}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg w-full"
        >
          {loading ? "Analyzing..." : "Detect AI Image"}
        </button>

        {result && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold">
              Result: {result}
            </h2>
            <p className="text-gray-300">
              Confidence: {confidence}%
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

