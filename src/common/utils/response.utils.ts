// utils/response.utils.ts
import { Response } from 'express';

import { logger } from './logger.utils';
import { ApiResponse } from '../../controllers/audio/types';

interface ErrorWithMessage {
    message: string;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as Record<string, unknown>).message === 'string'
    );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
    if (isErrorWithMessage(maybeError)) return maybeError;

    try {
        return new Error(JSON.stringify(maybeError));
    } catch {
        // fallback in case there's an error stringifying the maybeError
        return new Error(String(maybeError));
    }
}

export const handleAsyncError = async (
    res: Response,
    fn: () => Promise<Response>
): Promise<Response> => {
    try {
        return await fn();
    } catch (maybeError: unknown) {
        const error = toErrorWithMessage(maybeError);
        logger.error('Error in async operation:', error);
        return createErrorResponse(res, error.message);
    }
};
export const createSuccessResponse = <T>(res: Response, data: T, status = 200): Response => {
    const response: ApiResponse<T> = {
        success: true,
        data
    };
    return res.status(status).json(response);
};

export const createErrorResponse = (res: Response, message: string, status = 500): Response => {
    const response: ApiResponse<null> = {
        success: false,
        error: message
    };
    return res.status(status).json(response);
};
