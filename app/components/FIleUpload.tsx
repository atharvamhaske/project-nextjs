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

    const validateFile = (file: File) => {
      if (fileType === "Image" && !file.type.startsWith("image/")) {
        setError("please upload a valid image file");
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("File size is too large");
      }
      if (fileType === "Video" && !file.type.startsWith("video/")) {
        setError("please upload a valid video file"); 
      }
      if(file.size > 100 * 1024 * 1024) {
        setError("Video File size is too large");
      }

      return true;
    };
    

   const handleFileChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if(!file || !validateFile(file)) return

    setUploading(true);
    setError(null);

    try {
        const authResp = await fetch("/api/auth/imagekit-auth")
        const auth = await authResp.json()

       const res = await upload({
            file,
            fileName: file.name,
            publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
            signature: auth.signature,
            expire: auth.expire,
            token: auth.token,

            onProgress :(event) => {
                if(event.lengthComputable && onProgress) {

                    const percent = (event.loaded / event.total) * 100;
                    onProgress(Math.round(percent));
                }
                
            },

        });
        onSuccess(res)
    } catch (error) {
        console.error("File Upload Failed", error);
    } finally {
        setUploading(false);
    }

};

return (
    <>
        {/* File input element using React ref */}
        <input type="file" 
        accept={fileType === "Video" ? "video/*" : "image/*"} 
        onChange={handleFileChange}
        />
        {uploading && (
            <span>Loading ....</span>
        )}
        
    </>
);
}

export default FileUpload;