import { Request, Response } from 'express';
import mime from 'mime-types';
import { parseBuffer } from 'music-metadata';

import { validateMimeType } from '../../common/utils/mimeType.utils';
import AudioFileService from '../../services/audioFile/saveFile.service';
import { audioFileRemovalService } from '../../services/audioFile/removeFile.service';
import GoogleSpeechService from '../../services/googleSpeachToText/googleSpeech.service';
import { saveTranscribedText } from '../../services/audioFile/saveTranscription.service';
import AudioNormalizerService from '../../services/audioNormalizing/normalizeAudio.service';
import { handleAsyncError, createSuccessResponse, createErrorResponse } from '../../common/utils/response.utils';

import { logger } from '../../common/utils/logger.utils';
import { AUDIO_CONSTANTS } from '../../common/constants/audio.constants';
import { MIME_TYPES } from '../../common/constants/mimeTypes.constants';

import AudioFileReader from "../../services/audioFile/readFile.service";
import { AudioMetadata, ProcessedAudio, AudioEncoding, AudioMimeType } from './types';


/**
 * Controller responsible for handling audio file operations and transcription
 * @class AudioController
 */
class AudioController {
    constructor() {
        this.bindMethods();
    }

    /**
     * Bind class methods to maintain correct 'this' context
     * @private
     */
    private bindMethods(): void {
        this.handleAudioUpload = this.handleAudioUpload.bind(this);
        this.validateAudioFile = this.validateAudioFile.bind(this);
        this.processAudioFile = this.processAudioFile.bind(this);
    }

    /**
     * Handle audio file upload and process it for transcription
     * @async
     * @param {Request} req - Express request object containing the audio file
     * @param {Response} res - Express response object
     * @returns {Promise<Response>} JSON response with transcription results
     * @throws {Error} If file processing or transcription fails
     */
    public async handleAudioUpload(req: Request, res: Response): Promise<Response> {
        return handleAsyncError(res, async () => {
            if (!req.file) {
                return createErrorResponse(res, 'No audio file provided', 400);
            }

            const { buffer, originalname, size, mimetype } = req.file;

            logger.info(`Processing audio file: ${originalname}`);

            const metadata = await this.validateAudioFile(buffer, originalname);
            const processedAudio = await this.processAudioFile(buffer, originalname);
            const transcription = await GoogleSpeechService.transcribeAudio(processedAudio.buffer);

            await saveTranscribedText(transcription.text);

            logger.info(`Successfully processed audio file: ${originalname}`);

            return createSuccessResponse(res, {
                metadata,
                transcription,
                originalFile: { name: originalname, size, mimeType: mimetype }
            });
        });
    }

    /**
     * Validate audio file and extract its metadata
     * @async
     * @param {Buffer} buffer - File buffer to validate
     * @param {string} filename - Original filename
     * @returns {Promise<AudioMetadata>} Extracted audio metadata
     * @throws {Error} If file format is invalid
     */
    private async validateAudioFile(buffer: Buffer, filename: string): Promise<AudioMetadata> {
        const mimeType = mime.lookup(filename) || undefined;

        // Explicitly check for valid mime type
        if (!mimeType || !validateMimeType(mimeType)) {
            logger.error(`Invalid mime type for file: ${filename}`);
            throw new Error(AUDIO_CONSTANTS.ERRORS.INVALID_FORMAT);
        }

        try {
            const metadata = await parseBuffer(buffer, { mimeType: mimeType });

            return {
                encoding: this.getEncodingFromMimeType(mimeType),
                sampleRate: metadata.format.sampleRate || AUDIO_CONSTANTS.DEFAULT_SAMPLE_RATE,
                mimeType: mimeType
            };
        } catch (error: unknown) {
            if (error instanceof Error) {
                logger.error(`File validation failed for ${filename}: ${error.message}`);
                throw new Error(`${AUDIO_CONSTANTS.ERRORS.VALIDATION_FAILED}: ${error.message}`);
            }
            throw new Error(AUDIO_CONSTANTS.ERRORS.VALIDATION_FAILED);
        }
    }

    /**
     * Process audio file by saving and converting to WAV format
     * @async
     * @param {Buffer} buffer - File buffer to process
     * @param {string} filename - Original filename
     * @returns {Promise<ProcessedAudio>} Processed audio data
     * @throws {Error} If processing fails
     */
    private async processAudioFile(buffer: Buffer, filename: string): Promise<ProcessedAudio> {
        try {
            const { filepath } = await AudioFileService.saveAudioFile(buffer, filename);
            const ffmpegAvailable = await AudioNormalizerService.checkFfmpeg();

            if (!ffmpegAvailable) {
                throw new Error('FFmpeg is required but not installed');
            }

            const { path: wavPath } = await AudioNormalizerService.convertToWav(filepath);
            const wavBuffer = await AudioFileReader.readToBuffer(wavPath);

            // Clean up temporary files
            await audioFileRemovalService.removeMultipleFiles([wavPath, filepath]);

            return { buffer: wavBuffer, path: wavPath };
        } catch (error: any) {
            logger.error(`File processing failed for ${filename}: ${error.message}`);
            throw new Error(`${AUDIO_CONSTANTS.ERRORS.PROCESSING_FAILED}: ${error.message}`);
        }
    }

    /**
     * Get encoding type from MIME type
     * @private
     * @param {string} mimeType - MIME type of the audio file
     * @returns {AudioEncoding} Corresponding encoding type
     */
    private getEncodingFromMimeType(mimeType: string): AudioEncoding {
        return (MIME_TYPES.ENCODING_MAP[mimeType as AudioMimeType] || MIME_TYPES.DEFAULT_ENCODING);
    }
}

export default new AudioController();