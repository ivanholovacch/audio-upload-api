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