import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { logger } from '../../common/utils/logger.utils';
import { AUDIO_CONSTANTS } from '../../common/constants/audio.constants';
import { validateFilePath, ensureDirectoryExists } from '../../common/utils/file.utils';
import {
    AudioConversionResult
} from './types';

/**
 * Service for normalizing audio files to WAV format
 */
export class AudioNormalizerService {
    /**
     * Convert audio file to WAV format optimized for speech recognition
     * @param {string} inputPath - Path to input audio file
     * @param {string} [outputPath] - Optional custom output path
     * @returns {Promise<AudioConversionResult>} Conversion result with file info
     * @throws {Error} If conversion fails
     */
    public static async convertToWav(
        inputPath: string,
        outputPath?: string
    ): Promise<AudioConversionResult> {
        try {
            await validateFilePath(inputPath);

            const finalOutputPath = this.generateOutputPath(inputPath, outputPath);
            await ensureDirectoryExists(path.dirname(finalOutputPath));

            const result = await this.performConversion(inputPath, finalOutputPath);

            return {
                result,
                path: finalOutputPath,
                format: AUDIO_CONSTANTS.SPEECH_RECOGNITION_FORMAT
            };
        } catch (error: any) {
            logger.error('Audio conversion failed:', error);
            throw new Error(
                `${AUDIO_CONSTANTS.ERRORS.CONVERSION_FAILED}: ${error.message}`
            );
        }
    }

    /**
     * Check if ffmpeg is installed and available
     * @returns {Promise<boolean>} Whether ffmpeg is available
     */
    public static async checkFfmpeg(): Promise<boolean> {
        return true; //TODO: FIx
    }

    /**
     * Generate output path for converted file
     * @private
     */
    private static generateOutputPath(inputPath: string, outputPath?: string): string {
        if (outputPath) return outputPath;

        const inputFileName = path.basename(inputPath, path.extname(inputPath));
        return path.join(
            path.dirname(inputPath),
            `${inputFileName}_${AUDIO_CONSTANTS.OUTPUT_SUFFIX}.wav`
        );
    }

    private static async performConversion(
        inputPath: string,
        outputPath: string
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .toFormat(AUDIO_CONSTANTS.OUTPUT_FORMAT)
                .outputOptions([...AUDIO_CONSTANTS.FFMPEG_OPTIONS])
                .audioFilters([...AUDIO_CONSTANTS.AUDIO_FILTERS])
                .on('start', (commandLine) => {
                    logger.info(`Starting conversion: ${commandLine}`);
                })
                .on('progress', (progress) => {
                    logger.debug(`Processing: ${progress.percent}% done`);
                })
                .on('end', () => {
                    logger.info(`Successfully converted: ${inputPath}`);
                    resolve(outputPath);
                })
                .on('error', (error) => {
                    logger.error('Conversion error:', error);
                    reject(error);
                })
                .save(outputPath);
        });
    }
}

export default AudioNormalizerService;
