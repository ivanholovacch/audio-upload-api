// utils/response.utils.ts
import { Response } from 'express';
import { ApiResponse } from '../../controllers/audio/types';
import { logger } from './logger.utils';

export const handleAsyncError = async (res: Response, fn: () => Promise<Response>): Promise<Response> => {
    try {
        return await fn();
    } catch (error) {
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
