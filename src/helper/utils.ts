import {Model} from "./types.ts";
import {colorSchemes, models} from "./constant.ts";
import {ColorScheme} from "../component/ColorSchemeSelector.tsx";

export class Utils {
    public static getModelName (value: Model|null) {
        if(value){
            const res = models.find((model)=>model.value === value)
            if(res){
                return res.name
            }
        }
        return ''
    }

    public static getColorSchemeById = (id: ColorScheme['id']): ColorScheme => {
        const scheme = colorSchemes.find(scheme => scheme.id === id);
        if (!scheme) {
            throw new Error(`Color scheme with id "${id}" not found`);
        }
        return scheme;
    };


    public static getColorRanges = (schemeId: ColorScheme['id']) => {
        const scheme = this.getColorSchemeById(schemeId);
        return {
            ranges: scheme.colors.map((color, index) => ({
                from: index,
                to: index === 4 ? Infinity : index,
                color
            }))
        };
    };
}