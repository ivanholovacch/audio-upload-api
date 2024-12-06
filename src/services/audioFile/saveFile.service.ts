import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import multer, { Multer, Options } from 'multer';
import { AUDIO_CONSTANTS } from '../../common/constants/audio.constants';
import { AudioExtension, SavedFileResult } from './audioFile.types';
import { logger } from '../../common/utils/logger.utils';
import { validateBuffer } from '../../common/utils/validation.utils';
import { createDirectory } from '../../common/utils/file.utils';

/**
 * Configure multer for file uploads with memory storage
 * @returns {Multer} Configured multer instance
 */
export const createUploadMiddleware = (): Multer => {
    const multerConfig: Options = {
        storage: multer.memoryStorage(),
        limits: {
            fileSize: AUDIO_CONSTANTS.MAX_FILE_SIZE,
        },
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith(AUDIO_CONSTANTS.AUDIO_MIME_PREFIX)) {
                cb(null, true);
            } else {
                cb(new Error(AUDIO_CONSTANTS.ERRORS.INVALID_FILE_TYPE));
            }
        },
    };

    return multer(multerConfig);
};

/**
 * Service class for handling audio file operations
 */
export class AudioFileService {
    /**
     * Save audio buffer to file system
     * @param {Buffer} buffer - The file buffer to save
     * @param {string} originalname - Original filename
     * @param {string} [directory] - Target directory (default: tmp)
     * @returns {Promise<SavedFileResult>} Saved file information
     * @throws {Error} If file saving fails
     */
    public static async saveAudioFile(
        buffer: Buffer,
        originalname: string,
        directory: string = AUDIO_CONSTANTS.DEFAULT_DIRECTORY
    ): Promise<SavedFileResult> {
        try {
            // Validate inputs
            validateBuffer(buffer);
            await this.validateFileName(originalname);

            // Ensure directory exists
            await createDirectory(directory);

            const fileInfo = await this.generateFileInfo(originalname);
            const filepath = path.join(directory, fileInfo.filename);

            // Save file
            await fs.writeFile(filepath, buffer);

            logger.info(`Successfully saved audio file: ${filepath}`);

            return {
                filepath,
                filename: fileInfo.filename,
                extension: fileInfo.extension
            };
        } catch (error: any) {
            logger.error('Error saving audio file:', error);
            throw new Error(
                `${AUDIO_CONSTANTS.ERRORS.SAVE_FAILED}: ${error.message}`
            );
        }
    }

    /**
     * Generate unique file information
     * @private
     * @param {string} originalname - Original filename
     * @returns {Promise<{filename: string, extension: string}>}
     */
    private static async generateFileInfo(originalname: string) {
        const extension = path.extname(originalname);
        const uniqueId = uuidv4();
        const filename = `${uniqueId}${extension}`;

        return {
            filename,
            extension
        };
    }

    /**
     * Validate filename
     * @private
     * @param {string} filename - Filename to validate
     * @throws {Error} If filename is invalid
     */

    private static async validateFileName(filename: string): Promise<void> {
        if (!filename || typeof filename !== 'string') {
            throw new Error(AUDIO_CONSTANTS.ERRORS.INVALID_FILENAME);
        }
        const extension = path.extname(filename).toLowerCase();

        if (!AUDIO_CONSTANTS.ALLOWED_EXTENSIONS.includes(extension as AudioExtension)) {
            throw new Error(AUDIO_CONSTANTS.ERRORS.INVALID_EXTENSION);
        }
    }
}

export default AudioFileService;