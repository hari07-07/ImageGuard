"use client";
import { useState } from "react";
import axios from "axios";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);

    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }

    // Validation
    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("Please select a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size must be less than 5MB");
      return;
    }

    setFile(selectedFile);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(`${BACKEND_URL}/predict`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResult(res.data.prediction);
      setConfidence(res.data.confidence);
    } catch (error) {
      const errorMessage = 
        error instanceof axios.AxiosError
          ? error.response?.data?.detail || error.message
          : "Error analyzing file. Please try again.";
      setError(errorMessage);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-black to-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6">🛡️ Image Guard AI</h1>

      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
        <label htmlFor="file-input" className="block mb-4 font-semibold">
          Upload an image to analyze
        </label>
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-4 w-full"
          disabled={loading}
        />

        {preview && (
          <img 
            src={preview} 
            alt="Preview" 
            className="mb-4 w-full h-48 object-cover rounded-lg"
          />
        )}

        {file && (
          <p className="text-sm text-gray-400 mb-4">
            Selected: {file.name}
          </p>
        )}

        {error && (
          <div className="bg-red-900 text-red-100 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg w-full transition"
        >
          {loading ? "Analyzing..." : "Detect AI / Deepfake"}
        </button>

        {result && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">
              Result: {result}
            </h2>
            <p className="text-gray-300">
              Confidence: {(confidence || 0).toFixed(2)}%
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
