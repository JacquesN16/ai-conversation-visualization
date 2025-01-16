export enum Model {
    Claude = 'claude',
    ChatGPT = 'chatgpt',
    MistralAI = 'mistral',
    Gemini = 'gemini',
}

export interface ModelI {
    name: string,
    value: Model,
    disabled: boolean
}
export interface HeatmapDataI {
    day: string;
    value: number;
}

export interface DateGroups {
    [key: string]: number;
}

export interface ConversationI {
    // Claude
    created_at?: Date;
    //ChatGPT
    create_time?: number;

    // other fields are not used
}




export interface ConversationData {
    day: string;
    value: number;
}

export interface YearStats {
    totalConversations: number;
    mostActiveDay: ConversationData | null;
}

export interface HeatMapProps {
    data: ConversationData[];
    model: Model | null
}

export interface FormattedData {
    name: string;
    data: Array<{ x: string; y: number }>;
}
