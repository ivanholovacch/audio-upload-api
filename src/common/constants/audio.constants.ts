// constants/audio.constants.ts
export const AUDIO_CONSTANTS = {
    DEFAULT_SAMPLE_RATE: 16000,
    DEFAULT_CHUNK_SIZE: 64 * 1024, // 64KB
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    DEFAULT_STREAM_OPTIONS: {
        highWaterMark: 64 * 1024,
        encoding: null,
        flags: 'r',
        autoClose: true,
        emitClose: true
    },
    OUTPUT_FORMAT: 'wav',
    OUTPUT_SUFFIX: 'speech',
    DEFAULT_DIRECTORY: 'tmp',
    AUDIO_MIME_PREFIX: 'audio/',
    ALLOWED_EXTENSIONS: ['.mp3', '.wav', '.ogg', '.m4a', '.flac'],
    FFMPEG_OPTIONS: [
        '-ar 16000',        // 16kHz sample rate
        '-ac 1',            // Mono channel
        '-c:a pcm_s16le',   // 16-bit depth
        '-q:a 0',           // Best quality
        '-flags +bitexact'  // Ensure exact audio quality
    ],

    AUDIO_FILTERS: [
        'highpass=f=200',    // Remove frequencies below 200Hz
        'lowpass=f=8000',    // Keep frequencies up to 8kHz
        'volume=1.5'         // Slightly increase volume
    ],

    SPEECH_RECOGNITION_FORMAT: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        audioChannelCount: 1,
        languageCode: 'en-US'
    },

    ERRORS: {
        CONVERSION_FAILED: 'Audio conversion failed',
        FFMPEG_NOT_FOUND: 'ffmpeg not found. Please install ffmpeg on your system.',
        INVALID_INPUT: 'Invalid input file path',
        INVALID_FORMAT: 'Invalid audio file format',
        VALIDATION_FAILED: 'File validation failed',
        PROCESSING_FAILED: 'File processing failed',
        FILE_NOT_FOUND: (filepath: string) => `File not found: ${filepath}`,
        FILE_OPERATION_FAILED: (filepath: string, message: string) =>
            `File operation failed for ${filepath}: ${message}`,
        INVALID_PATH: 'Invalid file path provided',
        INVALID_FILE_TYPE: 'Only audio files are allowed!',
        INVALID_FILENAME: 'Invalid filename provided',
        INVALID_EXTENSION: 'Invalid file extension',
        SAVE_FAILED: 'Failed to save audio file',
        EMPTY_BUFFER: 'Empty buffer provided',
        DIRECTORY_CREATE_FAILED: 'Failed to create directory'
    }
} as const;
