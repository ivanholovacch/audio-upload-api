import { AUDIO_CONSTANTS } from '../../common/constants/audio.constants';

export interface SavedFileResult {
    filepath: string;
    filename: string;
    extension: string;
}

export interface MulterConfig {
    fileSize: number;
    mimeTypes: string[];
}

export type AllowedExtension = typeof AUDIO_CONSTANTS.ALLOWED_EXTENSIONS[number];

export type AudioExtension = '.mp3' | '.wav' | '.ogg' | '.m4a' | '.flac';
