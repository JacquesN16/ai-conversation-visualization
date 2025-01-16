export enum ErrorCode {
    INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
    INVALID_MODEL = 'INVALID_MODEL',
    INVALID_FILE = 'INVALID_FILE',
    PROCESSING_ERROR = 'PROCESSING_ERROR',
    UPLOAD_ERROR = 'UPLOAD_ERROR',
    UNEXPECTED_ERROR = 'UNEXPECTED_ERROR'
}

export class AppError extends Error {
    constructor(
        message: string,
        public readonly code: ErrorCode
    ) {
        super(message);
        this.name = 'AppError';
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export function handleError(error: unknown): { message: string; code: ErrorCode } {
    if (error instanceof AppError) {
        return {
            message: error.message,
            code: error.code
        };
    }

    return {
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        code: ErrorCode.UNEXPECTED_ERROR
    };
}