// utils/file.utils.ts
import { promises as fs } from 'fs';
import { existsSync } from 'fs';
import { logger } from './logger.utils';
import { AUDIO_CONSTANTS } from '../constants/audio.constants';

export async function createDirectory(directory: string): Promise<void> {
    try {
        await fs.mkdir(directory, { recursive: true });
        logger.debug(`Directory created/verified: ${directory}`);
    } catch (error) {
        logger.error(`Failed to create directory: ${directory}`, error);
        throw new Error(AUDIO_CONSTANTS.ERRORS.DIRECTORY_CREATE_FAILED);
    }
}


export async function validateFilePath(filepath: string): Promise<void> {
    if (!filepath || !existsSync(filepath)) {
        throw new Error(AUDIO_CONSTANTS.ERRORS.INVALID_INPUT);
    }
}

export async function ensureDirectoryExists(directory: string): Promise<void> {
    try {
        await fs.mkdir(directory, { recursive: true });
    } catch (error) {
        throw new Error(AUDIO_CONSTANTS.ERRORS.DIRECTORY_CREATE_FAILED);
    }
}