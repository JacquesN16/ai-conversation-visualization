import React from 'react';
import {models} from "../helper/constant.ts";
import {Model} from "../helper/types.ts";
interface ModelSelectProps {
    selectedModel: Model | null;
    onModelChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}
const ModelSelect : React.FC<ModelSelectProps> = ({ selectedModel, onModelChange }) => {

    return (
        <div className="w-full max-w-xs">
            <label
                htmlFor="model-select"
                className="block text-md font-medium text-gray-700 mb-2 dark:text-gray-100"
            >
                Select your AI Model
            </label>
            <div className="relative">
                <select
                    id="model-select"
                    value={selectedModel || ""}
                    onChange={onModelChange}
                    className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                >
                    <option value="" disabled>Select a model...</option>
                    {models.map((model) => (
                        <option
                            key={model.value}
                            value={model.value}
                            disabled={model.disabled}
                            className={`${model.disabled ? 'text-gray-400' : 'text-gray-900'}`}
                        >
                            {model.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default ModelSelect;