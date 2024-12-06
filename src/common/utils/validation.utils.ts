// utils/validation.utils.ts
import { AUDIO_CONSTANTS } from '../constants/audio.constants';

export function validateBuffer(buffer: Buffer): void {
    if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
        throw new Error(AUDIO_CONSTANTS.ERRORS.EMPTY_BUFFER);
    }
}
