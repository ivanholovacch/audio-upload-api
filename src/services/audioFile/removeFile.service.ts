import fs from 'fs/promises';
import path from 'path';
import winston, { createLogger, Logger } from 'winston';

/**
 * Interface for file removal result
 */
interface RemoveFileResult {
    success: boolean;
    path: string;
    error?: string;
}

/**
 * Interface for batch removal result
 */
interface BatchRemovalResult {
    totalFiles: number;
    removed: number;
    failed: RemoveFileResult[];
}

/**
 * Service for managing audio file removal
 */
class AudioFileRemovalService {
    private logger: Logger;

    constructor() {
        this.logger = createLogger({
            level: 'info',
            format: winston.format.json(),
            transports: [
                new winston.transports.File({ filename: 'logs/audio-removal-error.log', level: 'error' }),
                new winston.transports.File({ filename: 'logs/audio-removal.log' })
            ]
        });

        // Add console logging if not in production
        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new winston.transports.Console({
                format: winston.format.simple()
            }));
        }
    }

    /**
     * Remove a single audio file
     * @param {string} filepath - Path to the audio file
     * @returns {Promise<RemoveFileResult>} Result of the removal operation
     */
    public async removeFile(filepath: string): Promise<RemoveFileResult> {
        try {
            // Check if file exists
            await fs.access(filepath);

            // Remove the file
            await fs.unlink(filepath);

            this.logger.info(`Successfully removed file: ${filepath}`);

            return {
                success: true,
                path: filepath
            };
        } catch (error) {
            const errorMessage = `Failed to remove file ${filepath}: ${error.message}`;
            this.logger.error(errorMessage);

            return {
                success: false,
                path: filepath,
                error: errorMessage
            };
        }
    }

    /**
     * Remove multiple audio files
     * @param {string[]} filepaths - Array of file paths to remove
     * @returns {Promise<BatchRemovalResult>} Results of the batch removal
     */
    public async removeMultipleFiles(filepaths: string[]): Promise<BatchRemovalResult> {
        const results = await Promise.all(
            filepaths.map(filepath => this.removeFile(filepath))
        );

        const failedResults = results.filter(result => !result.success);

        return {
            totalFiles: filepaths.length,
            removed: filepaths.length - failedResults.length,
            failed: failedResults
        };
    }

    /**
     * Remove all files in a directory matching a pattern
     * @param {string} directory - Directory path
     * @param {string} pattern - File pattern to match (e.g., '*.wav')
     * @returns {Promise<BatchRemovalResult>} Results of the pattern-based removal
     */
    public async removeFilesByPattern(directory: string, pattern: string): Promise<BatchRemovalResult> {
        try {
            const files = await fs.readdir(directory);
            const matchingFiles = files.filter(file =>
                this.matchesPattern(file, pattern)
            ).map(file => path.join(directory, file));

            return this.removeMultipleFiles(matchingFiles);
        } catch (error) {
            this.logger.error(`Failed to remove files by pattern: ${error.message}`);
            throw new Error(`Directory operation failed: ${error.message}`);
        }
    }

    /**
     * Remove files older than specified date
     * @param {string} directory - Directory path
     * @param {Date} olderThan - Date threshold
     * @returns {Promise<BatchRemovalResult>} Results of the date-based removal
     */
    public async removeOldFiles(directory: string, olderThan: Date): Promise<BatchRemovalResult> {
        try {
            const files = await fs.readdir(directory);
            const filesToRemove: string[] = [];

            for (const file of files) {
                const filepath = path.join(directory, file);
                const stats = await fs.stat(filepath);

                if (stats.mtime < olderThan) {
                    filesToRemove.push(filepath);
                }
            }

            return this.removeMultipleFiles(filesToRemove);
        } catch (error) {
            this.logger.error(`Failed to remove old files: ${error.message}`);
            throw new Error(`Directory cleanup failed: ${error.message}`);
        }
    }

    /**
     * Check if filename matches pattern
     * @param {string} filename - Name of the file
     * @param {string} pattern - Pattern to match
     * @returns {boolean} Whether the file matches the pattern
     */
    private matchesPattern(filename: string, pattern: string): boolean {
        const regexPattern = pattern
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.*')
            .replace(/\?/g, '.');

        return new RegExp(`^${regexPattern}$`).test(filename);
    }
}

export const audioFileRemovalService = new AudioFileRemovalService();