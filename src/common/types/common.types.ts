// services/audioFile/common.types.ts
export interface AudioFileMetadata {
    size: number;
    created: Date;
    modified: Date;
    extension: string;
    filename: string;
}

export interface StreamOptions {
    highWaterMark: number;
    encoding: BufferEncoding;
    flags?: string;
    mode?: number;
    autoClose?: boolean;
    emitClose?: boolean;
    start?: number;
    end?: number;
}