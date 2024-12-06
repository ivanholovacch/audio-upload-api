// controllers/audio/types.ts
export interface AudioMetadata {
    encoding: string;
    sampleRate: number;
    mimeType: string;
}

export interface ProcessedAudio {
    buffer: Buffer;
    path: string;
}

export interface ApiResponse<T> {
    success: boolean;
    error?: string;
    data?: T;
}

export type AudioMimeType = 'audio/ogg' | 'audio/wav' | 'audio/flac' | 'audio/mpeg' | 'audio/mp3';

export type AudioEncoding = 'OGG_OPUS' | 'LINEAR16' | 'FLAC' | 'MP3';

export type EncodingMap = {
    [K in AudioMimeType]: AudioEncoding;
};

export const MIME_TYPES = {
    ENCODING_MAP: {
        'audio/ogg': 'OGG_OPUS',
        'audio/wav': 'LINEAR16',
        'audio/flac': 'FLAC',
        'audio/mpeg': 'MP3',
        'audio/mp3': 'MP3'
    } as EncodingMap,
    DEFAULT_ENCODING: 'MP3' as AudioEncoding
} as const;
