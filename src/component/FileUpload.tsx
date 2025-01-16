import React, { ChangeEvent, useState } from "react";
import { Model } from "../helper/types";
import { Upload, AlertCircle, CheckCircle2, X } from "lucide-react";

interface FileUploadProps {
    selectedModel: string;
    onUpload: (file: File) => void;
    isLoading?: boolean;
}

interface ModelGuide {
    path: string[];
    extraSteps?: string[];
}

const MODEL_GUIDES: Record<string, ModelGuide> = {
    [Model.ChatGPT]: {
        path: ["ChatGPT Settings", "Data controls", "Export"],
    },
    [Model.Claude]: {
        path: ["Claude Settings", "Account", "Export Data"],
    },
};

export default function FileUpload({selectedModel, onUpload, isLoading = false}: FileUploadProps) {
    const [error, setError] = useState<string>("");
    const [isDragging, setIsDragging] = useState(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const validateFile = (file: File): boolean => {
        if (!file.name.endsWith('.json')) {
            setError("Please upload a JSON file");
            setUploadedFile(null);
            return false;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            setError("File size should be less than 10MB");
            setUploadedFile(null);
            return false;
        }
        setError("");
        return true;
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && validateFile(file)) {
            setUploadedFile(file);
            onUpload(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file && validateFile(file)) {
            setUploadedFile(file);
            onUpload(file);
        }
    };

    const handleRemoveFile = () => {
        setUploadedFile(null);
        setError("");

        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const renderGuide = () => {
        const guide = MODEL_GUIDES[selectedModel];

        if (!guide) return null;

        return (
            <>
                <li className="mb-2">
                    Go to{" "}
                    {guide.path.map((step, index) => (
                        <span key={step}>
              <span className="font-bold">{step}</span>
                            {index < guide.path.length - 1 ? " > " : ""}
            </span>
                    ))}
                </li>
                <li className="mb-2">Extract the zip file</li>
            </>
        );
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-100">
                <p>Upload your conversations JSON file. To export your data:</p>
                <ol className="list-decimal ml-6 mt-2">
                    {renderGuide()}
                    <li>
                        Upload the <span className="font-bold">conversations.json</span> file
                    </li>
                </ol>
            </div>

            {error && (
                <div>
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                </div>
            )}

            {uploadedFile && !error && !isLoading && (
                <div className="bg-green-50 text-green-800 border-green-200 flex gap-1 items-center">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <div className="flex items-center justify-between w-full">
                        <span>Successfully uploaded: {uploadedFile.name}</span>
                        <button
                            onClick={handleRemoveFile}
                            className="p-1 hover:bg-green-100 rounded-full transition-colors"
                            aria-label="Remove file"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors
                          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
                          ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isLoading}
                    aria-label="Upload JSON file"
                />

                <div className="flex flex-col items-center gap-2">
                    <Upload className={`h-8 w-8 ${isDragging ? "text-blue-500" : "text-gray-400"}`} />
                    <p className="text-sm text-gray-600 dark:text-gray-100">
                        {isLoading ? "Uploading..." : (
                            uploadedFile
                                ? "Upload a different file?"
                                : "Drag and drop your file here, or click to select"
                        )}
                    </p>
                    <p className="text-xs text-gray-500">
                        JSON files only, max 10MB
                    </p>
                </div>
            </div>
        </div>
    );
}