import './App.css'
import React, {useState} from "react";
import FileUpload from "./component/FileUpload.tsx";
import ModelSelect from "./component/ModelSelector.tsx";
import {AppError, ErrorCode, handleError} from "./helper/errorHandler.ts";
import {processJson} from "./helper/processJson.ts";
import {HeatmapDataI, Model} from "./helper/types.ts";
import HeatMap from "./component/HeatMap.tsx";
import {Github, Info,  Shield} from "lucide-react";
import {ThemeToggle} from "./helper/context/ThemeContext.tsx";

function App() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [heatmapData, setHeatmapData] = useState<Array<HeatmapDataI>>([])

    const [selectedModel, setSelectedModel] = useState<Model | null>(null);

    const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setHeatmapData([])
        setSelectedModel(e.target.value as Model);
    };

    const handleFileUpload = async (file: File) => {
        if(!selectedModel){
            return
        }

        setLoading(true);
        setError(null);

        try {
            if (!file.name.endsWith(".json")) {
                throw new AppError(
                    "Please upload a valid JSON file",
                    ErrorCode.INVALID_FILE_TYPE
                );
            }

            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const jsonData = JSON.parse(e.target?.result as string);
                    const processedData = processJson(selectedModel, jsonData);
                    setHeatmapData(processedData);
                } catch (error) {
                    setError(handleError(error).message);
                } finally {
                    setLoading(false);
                }
            };

            reader.onerror = () => {
                setError(
                    handleError(
                        new AppError("Error reading file", ErrorCode.UPLOAD_ERROR)
                    ).message
                );
                setLoading(false);
            };

            reader.readAsText(file);
        } catch (error) {
            setError(handleError(error).message);
            setLoading(false);
        }
    };

    return (
        <>
            <main className={"w-full dark:bg-gray-900"} >
                <div className="min-h-screen p-8 max-w-6xl mx-auto flex flex-col gap-6 dark:bg-gray-900">
                    <div className="flex flex-1 flex-col gap-2">
                        <div className='w-full flex justify-between'>
                            <h1 className="text-3xl font-bold dark:text-white">AI Chat Visualization</h1>
                            <ThemeToggle/>
                        </div>


                        <div className="prose prose-sm dark:prose-invert">
                            <p className="text-gray-600 dark:text-gray-300">
                                A web-based adaptation of {" "}
                                <a
                                    href="https://huyenchip.com/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline dark:text-green-400"
                                >
                                    Chip Huyen's{" "}
                                </a>
                                <a
                                    href="https://github.com/chiphuyen/aie-book/blob/main/scripts/ai-heatmap.ipynb"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline dark:text-green-400"
                                >
                                    AI Heatmap python script
                                </a>.
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                                Create visual patterns of your AI conversations, transforming
                                timestamps into an elegant,
                                easy-to-read display of your interaction history.
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 mt-4">
                            <div className="flex">
                                <ModelSelect selectedModel={selectedModel} onModelChange={handleModelChange}/>
                            </div>
                        </div>

                        {selectedModel && <div className="flex flex-col gap-2 mt-4">
                            <div className="flex">
                                <FileUpload selectedModel={selectedModel} onUpload={handleFileUpload}/>
                            </div>
                        </div>}

                        {error && <div className="text-red-500 dark:text-red-400 mb-4">{error}</div>}

                        {loading && (
                            <div className="text-gray-500 dark:text-gray-400">Processing file...</div>
                        )}

                        {heatmapData.length > 0 && (
                            <div className="w-full mt-4">
                                <HeatMap data={heatmapData} model={selectedModel}/>
                            </div>
                        )}
                    </div>

                    <div
                        className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-4">
                            <Info className="w-5 h-5 text-gray-700 dark:text-gray-300"/>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Disclaimer</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Shield className="w-5 h-5 text-green-500 mt-1 flex-shrink-0"/>
                                <p className="text-gray-700 dark:text-gray-300">
                                    All data processing happens locally in your browser - your conversations and
                                    personal
                                    information never leave your device.
                                </p>
                            </div>
                            <div className="flex items-start gap-3">
                                <Github className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0"/>
                                <p className="text-gray-700 dark:text-gray-300">
                                    Check the source {" "}
                                    <a
                                        href="https://github.com/JacquesN16/ai-heatmap-display"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-700 dark:text-green-400 dark:hover:text-blue-300 hover:underline font-medium transition-colors"
                                    >
                                        code
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </>
    )
}

export default App
