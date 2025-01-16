import React from 'react';
import {colorSchemes} from "../helper/constant.ts";

export type ColorScheme = {
    id: 'cosmic-twilight' | 'forest-commits' | 'autumn-accessible' | 'ocean-depths';
    name: string;
    colors: [string, string, string, string, string];
};

type ColorSchemeSelectProps = {
    onChange: (value: ColorScheme['id']) => void;
    value: ColorScheme['id'];
};

const ColorSchemeSelect: React.FC<ColorSchemeSelectProps> = ({ onChange, value }) => {
    return (
        <div className="flex items-center gap-4">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value as ColorScheme['id'])}
                className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-black"
            >
                {colorSchemes.map((scheme) => (
                    <option key={scheme.id} value={scheme.id}>
                        {scheme.name}
                    </option>
                ))}
            </select>

            <div className="flex gap-1">
                {colorSchemes.find(scheme => scheme.id === value)?.colors.map((color, index) => (
                    <div
                        key={index}
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: color }}
                        aria-label={`Color ${index + 1} of ${value} scheme`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ColorSchemeSelect;