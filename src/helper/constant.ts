import {Model, ModelI} from "./types.ts";
import {ColorScheme} from "../component/ColorSchemeSelector.tsx";


export const models: Array<ModelI> = [
    { name: 'Claude', value: Model.Claude, disabled: false },
    { name: 'ChatGPT', value: Model.ChatGPT, disabled: false },
    { name: 'MistralAI', value: Model.MistralAI, disabled: true },
    { name: 'Gemini', value: Model.Gemini, disabled: true }
];


export const colorSchemes: ColorScheme[] = [
    {
        id: 'cosmic-twilight',
        name: 'Cosmic Twilight',
        colors: [
            '#eeeeee',
            '#400554',
            '#693699',
            '#7c40a9',
            '#9570dd'
        ]
    },
    {
        id: 'forest-commits',
        name: 'Forest Commits',
        colors: [
            '#ebedf0',
            '#9be9a8',
            '#40c463',
            '#30a14e',
            '#216e39'
        ]
    },
    {
        id: 'autumn-accessible',
        name: 'Autumn Accessible',
        colors: [
            '#f7f7f7',
            '#fee0d2',
            '#fc9272',
            '#de2d26',
            '#a50f15'
        ]
    },
    {
        id: 'ocean-depths',
        name: 'Ocean Depths',
        colors: [
            '#f7fbff',
            '#deebf7',
            '#9ecae1',
            '#4292c6',
            '#084594'
        ]
    }
];