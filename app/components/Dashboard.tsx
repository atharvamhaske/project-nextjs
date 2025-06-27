"use client"

import { useState } from "react";
import FileUpload from "./FIleUpload";

interface UploadedFile {
  url: string;
  name: string;
  fileType: "Image" | "Video";
  size: number;
  uploadedAt: string;
  fileId?: string;
  thumbnailUrl?: string;
}

interface DashboardProps {
  uploadedFiles: UploadedFile[];
  onUploadSuccess: (file: UploadedFile) => void;
  onProgress: (progress: number) => void;
}

export default function Dashboard({ uploadedFiles, onUploadSuccess, onProgress }: DashboardProps) {
  const [uploadType, setUploadType] = useState<"image" | "video">("image");
  const [isUploading, setIsUploading] = useState(false);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Media Dashboard</h1>
        <p className="text-gray-600">Upload and manage your images and videos</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload New Files</h2>
        
        {/* Upload Type Selector */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setUploadType("image")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              uploadType === "image"
                ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Upload Images</span>
          </button>
          <button
            onClick={() => setUploadType("video")}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              uploadType === "video"
                ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Upload Videos</span>
          </button>
        </div>

        {/* Upload Component */}
        <FileUpload
          onSuccess={onUploadSuccess}
          fileType={uploadType === "image" ? "Image" : "Video"}
          onProgress={(progress) => {
            setIsUploading(true);
            if (progress === 100) setIsUploading(false);
          }}
        />
      </div>

      {/* Files Display */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Your Files</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              {uploadedFiles.length} {uploadedFiles.length === 1 ? 'file' : 'files'}
            </span>
          </div>
        </div>

        {uploadedFiles.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500 text-lg">No files uploaded yet</p>
            <p className="text-gray-400">Upload your first {uploadType === "image" ? "image" : "video"} to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {file.fileType === "Image" ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <video
                      src={file.url}
                      className="w-full h-48 object-cover"
                      controls
                    />
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-gray-900 truncate mb-1">
                    {file.name}
                  </p>
                  <div className="text-xs text-gray-500 space-y-1 mb-3">
                    <p>{file.fileType}</p>
                    <p>{formatFileSize(file.size)}</p>
                    <p>{formatDate(file.uploadedAt)}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(file.url)}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                    >
                      Copy URL
                    </button>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors"
                    >
                      View
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 