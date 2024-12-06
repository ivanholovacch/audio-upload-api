export interface SavedFileResult {
    filepath: string;
    filename: string;
    extension: string;
}

export interface MulterConfig {
    fileSize: number;
    mimeTypes: string[];
}