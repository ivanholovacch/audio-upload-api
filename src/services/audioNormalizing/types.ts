export interface AudioFormat {
    encoding: string;
    sampleRateHertz: number;
    audioChannelCount: number;
    languageCode: string;
}

export interface AudioConversionResult {
    result: string;
    path: string;
    format: AudioFormat;
}

export interface FfmpegOptions {
    format: string;
    sampleRate: string;
    channels: string;
    codec: string;
    quality: string;
    flags: string;
}