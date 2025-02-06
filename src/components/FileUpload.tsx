"use client";
import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";
import { Loader2 } from "lucide-react";

interface FileUploadProps {
    onSuccess: (res: IKUploadResponse) => void
    onProgress?: (progess: number) => void
    fileType?: 'image' | 'video'
}

export default function FileUpload({
    onSuccess,
    onProgress,
    fileType = 'image'
}: FileUploadProps) {

    const [uploading , setUploading] = useState(false)
    const [error , setError] = useState<string | null>(null)

    const onError = (err: {message: string}) => {
        console.log("Error", err);
        setError(err.message)
        setUploading(false)
    }; 
  
    const handleSuccess = (response: IKUploadResponse) => {
        console.log("Success", response);
        setUploading(false)
        setError(null)
        onSuccess(response)
    };
  
    const handleProgress = (evt: ProgressEvent) => {
        if(evt.lengthComputable && onProgress){
            const percentComplete = (evt.loaded / evt.total) * 100;
            onProgress(Math.round(percentComplete))
        }
    };

  
    const handleStartUpload = () => {
        setUploading(true)
        setError(null)
    };

    const validateFile = (file: File) => {
        if(fileType === 'video'){
            if(!file.type.startsWith("video/")){
                setError('Please Upload a video File')
                return false
            }
            if(file.size > 100*1024*1024){
                setError('Video Must be less than 100mb')
                return false
            }

        }else{
            const validTypes = ["image/jpeg" , "image/png" , "image/webp"]
            if(!validTypes.includes(file.type)){
                setError("Please upload a valid file (JPEG, PNG, webP)")
                return false
            }
            if(file.size > 5 * 1024 * 1024){
                setError("Video Must be less than 5 mb")
                return false
            }
        }
        return false
        
             
    }
  return (
    <div className="App">
      <h1>ImageKit Next.js quick start</h1>
        <p>Upload an image with advanced options</p>
        <IKUpload
          fileName="test-upload.jpg"
          tags={["sample-tag1", "sample-tag2"]}
          customCoordinates={"10,10,10,10"}
          isPrivateFile={false}
          useUniqueFileName={true}
          responseFields={["tags"]}
          accept={fileType === "video" ? "video/*" : "image/*" }
          validateFile={validateFile}
          folder={fileType === "video"? "/videos": "/images"}
          
          webhookUrl="https://www.example.com/imagekit-webhook" // replace with your webhookUrl
          overwriteFile={true}
          overwriteAITags={true}
          overwriteTags={true}
          overwriteCustomMetadata={true}
          
          onError={onError}
          onSuccess={handleSuccess}
          onUploadProgress={handleProgress}
          onUploadStart={handleStartUpload}
          transformation={{
            pre: "l-text,i-Imagekit,fs-50,l-end",
            post: [
              {
                type: "transformation",
                value: "w-100",
              },
            ],
          }}
          style={{display: 'none'}} // hide the default input and use the custom upload button
        />
        {
            uploading && (
                <div className="flex items-center gap-2 text-sm text-primary">
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>Uploading...</span>
                </div>
            )
        }
        {
            error && (
                <div className="text-error text-sm">{error}</div>
            )
        }
    </div>
  );
}