// utils/mimeType.utils.ts
export const validateMimeType = (mimeType: string | false): boolean => {
    return Boolean(mimeType && mimeType.startsWith('audio/'));
};
