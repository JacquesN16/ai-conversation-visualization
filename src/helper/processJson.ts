import {ConversationI, DateGroups, HeatmapDataI, Model} from "./types.ts";
import {AppError, ErrorCode} from "./errorHandler.ts";

export function processJson (model: Model, jsonData: Array<ConversationI>): Array<HeatmapDataI> {

    try {
        const conversationCount = jsonData.map((conv: ConversationI) =>getConversationTime(model, conv))
        const dateGroups = conversationCount.reduce((acc: DateGroups, date: Date) => {
            const dateStr = date.toISOString().split("T")[0];
            acc[dateStr] = (acc[dateStr] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(dateGroups).map(([day, value]) => ({
            day,
            value,
        }));
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        console.log(error)
        throw new AppError("Error processing conversation data", ErrorCode.PROCESSING_ERROR);
    }
}


const getConversationTime = (model: Model, conversation: ConversationI): Date => {
    let timestamp: Date | number | undefined;

    switch (model) {
        case Model.Claude:
            timestamp = conversation.created_at;
            break;
        case Model.ChatGPT:
            timestamp = conversation.create_time;
            break;
        default:
            throw new AppError("Unsupported model type", ErrorCode.INVALID_MODEL);
    }

    if (!timestamp) {
        throw new AppError("Invalid conversation data format", ErrorCode.INVALID_FILE);
    }

    return new Date(typeof timestamp === 'number' ? timestamp * 1000 : timestamp);
}