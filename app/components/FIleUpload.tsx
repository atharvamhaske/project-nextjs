"use client" // This component must be a client component

import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

interface FileUploadProps {
    onSuccess: (res: any) => void
    onProgress?: (progress : number) => void
    fileType?: "Image" | "Video"
}

// UploadExample component demonstrates file uploading using ImageKit's Next.js SDK.
const FileUpload = ({
    onSuccess,
    onProgress,
    fileType,
}: FileUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File) => {
        setError(null);
        
        if (fileType === "Image" && !file.type.startsWith("image/")) {
            setError("Please upload a valid image file");
            return false;
        }
        if (fileType === "Video" && !file.type.startsWith("video/")) {
            setError("Please upload a valid video file");
            return false;
        }
        if (file.size > 100 * 1024 * 1024) {
            setError("File size is too large (max 100MB)");
            return false;
        }

        return true;
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (validateFile(file)) {
                setSelectedFile(file);
                setError(null);
            } else {
                setSelectedFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setError(null);
        setProgress(0);

        try {
            console.log("Starting upload process...");
            
            // Get upload authorization
            const authResp = await fetch("/api/imagekit-auth");
            console.log("Auth response status:", authResp.status);
            
            if (!authResp.ok) {
                const errorText = await authResp.text();
                console.error("Auth response error:", errorText);
                throw new Error(`Failed to get upload authorization: ${authResp.status} ${errorText}`);
            }
            
            const auth = await authResp.json();
            console.log("Auth response:", auth);

            if (!auth.authParams) {
                throw new Error("Invalid auth response: missing authParams");
            }

            // Check if required environment variables are available
            const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
            if (!publicKey) {
                throw new Error("ImageKit Public key not configured");
            }

            console.log("Starting file upload...");
            const res = await upload({
                file: selectedFile,
                fileName: selectedFile.name,
                publicKey: publicKey,
                signature: auth.authParams.signature,
                expire: auth.authParams.expire,
                token: auth.authParams.token,
                onProgress: (event) => {
                    if (event.lengthComputable) {
                        const percent = (event.loaded / event.total) * 100;
                        const roundedPercent = Math.round(percent);
                        setProgress(roundedPercent);
                        if (onProgress) {
                            onProgress(roundedPercent);
                        }
                    }
                },
            });

            console.log("Upload successful:", res);

            onSuccess({
                ...res,
                name: selectedFile.name,
                fileType: fileType,
                size: selectedFile.size,
                uploadedAt: new Date().toISOString()
            });

            // Reset form
            setSelectedFile(null);
            setProgress(0);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error("File Upload Failed", error);
            
            if (error instanceof ImageKitAbortError) {
                setError("Upload was cancelled");
            } else if (error instanceof ImageKitInvalidRequestError) {
                setError("Invalid upload request - please check your file");
            } else if (error instanceof ImageKitServerError) {
                setError("ImageKit server error - please try again later");
            } else if (error instanceof ImageKitUploadNetworkError) {
                setError("Network error - please check your connection");
            } else if (error instanceof Error) {
                setError(`Upload failed: ${error.message}`);
            } else {
                setError("Upload failed. Please try again.");
            }
        } finally {
            setUploading(false);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            if (validateFile(file)) {
                setSelectedFile(file);
                setError(null);
            }
        }
    };

    return (
        <div className="w-full">
            {/* File Selection Area */}
            <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    selectedFile 
                        ? 'border-green-400 bg-green-50' 
                        : 'border-gray-300 hover:border-blue-400 bg-gray-50'
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {!selectedFile ? (
                    <div>
                        <div className="mb-4">
                            {fileType === "Image" ? (
                                <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            ) : (
                                <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            )}
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-2">
                            Select {fileType === "Image" ? "an image" : "a video"} to upload
                        </p>
                        <p className="text-gray-600 mb-4">
                            Drag and drop your {fileType === "Image" ? "image" : "video"} here, or click to browse
                        </p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept={fileType === "Video" ? "video/*" : "image/*"}
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Choose File
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="mb-4">
                            <svg className="w-12 h-12 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-lg font-medium text-gray-900 mb-2">
                            File Selected: {selectedFile.name}
                        </p>
                        <p className="text-gray-600 mb-4">
                            Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <div className="flex space-x-2 justify-center">
                            <button
                                type="button"
                                onClick={handleUpload}
                                disabled={uploading}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {uploading ? "Uploading..." : "Upload File"}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedFile(null);
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                    }
                                }}
                                disabled={uploading}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Change File
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            {uploading && (
                <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Uploading...</span>
                        <span className="text-sm text-gray-500">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUpload;