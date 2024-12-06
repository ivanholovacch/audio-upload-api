import { promises as fs, createReadStream } from 'fs';
import path from 'path';
import { Readable } from 'stream';

import { logger } from '../../common/utils/logger.utils';
import { validateFilePath } from '../../common/utils/file.utils';
import { AUDIO_CONSTANTS } from '../../common/constants/audio.constants';
import { AudioFileMetadata, StreamOptions } from '../../common/types/common.types';

/**
 * Service for reading and processing audio files
 * @class AudioFileReader
 */
class AudioFileReader {
    /**
     * Read entire audio file into buffer
     * @async
     * @param {string} filepath - Path to audio file
     * @returns {Promise<Buffer>} Audio file buffer
     * @throws {Error} If file doesn't exist or read operation fails
     */
    public static async readToBuffer(filepath: string): Promise<Buffer> {
        try {
            await validateFilePath(filepath);
            const buffer = await fs.readFile(filepath);
            logger.debug(`Successfully read file to buffer: ${filepath}`);
            return buffer;
        } catch (error: any) {
            logger.error(`Error reading file to buffer: ${filepath}`, error);
            throw this.handleFileError(error, filepath);
        }
    }

    /**
     * Create a readable stream for audio file
     * @param {string} filepath - Path to audio file
     * @param {StreamOptions} options - Stream configuration options
     * @returns {Readable} Audio file stream
     * @throws {Error} If file doesn't exist or stream creation fails
     */
    public static createFileStream(filepath: string, options: Partial<StreamOptions> = {}): Readable {
        const streamOptions: StreamOptions = {
            ...AUDIO_CONSTANTS.DEFAULT_STREAM_OPTIONS,
            ...options
        };

        try {
            const stream = createReadStream(filepath, streamOptions);
            logger.debug(`Created file stream for: ${filepath}`);
            return stream;
        } catch (error: any) {
            logger.error(`Error creating file stream: ${filepath}`, error);
            throw this.handleFileError(error, filepath);
        }
    }

    /**
     * Read audio file in chunks with callback
     * @async
     * @param {string} filepath - Path to audio file
     * @param {number} chunkSize - Size of each chunk in bytes
     * @param {(chunk: Buffer) => void} onChunk - Callback for processing each chunk
     * @returns {Promise<void>}
     * @throws {Error} If reading operation fails
     */
    public static async readInChunks(
        filepath: string,
        chunkSize: number = AUDIO_CONSTANTS.DEFAULT_CHUNK_SIZE,
        onChunk?: (chunk: Buffer) => void
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const stream = this.createFileStream(filepath, { highWaterMark: chunkSize });

            stream.on('data', (chunk: Buffer) => {
                try {
                    onChunk?.(chunk);
                } catch (error) {
                    logger.error('Error in chunk processing callback', error);
                    stream.destroy();
                    reject(error);
                }
            });

            stream.on('end', () => {
                logger.debug(`Completed chunk reading for: ${filepath}`);
                resolve();
            });

            stream.on('error', (error) => {
                logger.error(`Stream error for ${filepath}`, error);
                reject(this.handleFileError(error, filepath));
            });
        });
    }

    /**
     * Get audio file metadata
     * @async
     * @param {string} filepath - Path to audio file
     * @returns {Promise<AudioFileMetadata>} File metadata
     * @throws {Error} If metadata retrieval fails
     */
    public static async getFileMetadata(filepath: string): Promise<AudioFileMetadata> {
        try {
            await validateFilePath(filepath);
            const stats = await fs.stat(filepath);

            const metadata: AudioFileMetadata = {
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime,
                extension: path.extname(filepath),
                filename: path.basename(filepath)
            };

            logger.debug(`Retrieved metadata for: ${filepath}`, metadata);
            return metadata;
        } catch (error: any) {
            logger.error(`Error getting file metadata: ${filepath}`, error);
            throw this.handleFileError(error, filepath);
        }
    }

    /**
     * Handle file-related errors
     * @private
     * @param {Error} error - Original error
     * @param {string} filepath - Path to file
     * @returns {Error} Processed error
     */
    private static handleFileError(error: NodeJS.ErrnoException, filepath: string): Error {
        if (error.code === 'ENOENT') {
            return new Error(AUDIO_CONSTANTS.ERRORS.FILE_NOT_FOUND(filepath));
        }
        return new Error(AUDIO_CONSTANTS.ERRORS.FILE_OPERATION_FAILED(filepath, error.message));
    }
}

export default AudioFileReader;