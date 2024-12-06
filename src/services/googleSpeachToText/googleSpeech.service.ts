import { SpeechClient } from '@google-cloud/speech';
import GoogleSpeechClientConfig from './googleSpeechClient';
import { CONFIG, SpeechRecognitionResult, WordInfo } from './googleSpeechToText.config';

export interface TranscriptionResult {
    text: string;
    confidence?: number;
    wordTimings?: Array<{
        word: string;
        startTime: number;
        endTime: number;
    }>;
}

class GoogleSpeechService {
    private speechClient: SpeechClient;

    constructor() {
        this.speechClient = GoogleSpeechClientConfig.getClient();
    }


    /**
     * Transcribe audio buffer to text
     * @param audioBuffer - Audio buffer to transcribe
     * @returns Promise with transcription result
     */
    async transcribeAudio(audioBuffer: Buffer): Promise<TranscriptionResult> {
        try {
            const [response] = await this.speechClient.recognize({
                audio: {
                    content: audioBuffer.toString('base64'),
                },
                config: CONFIG
            });

            if (!response.results || response.results.length === 0) {
                throw new Error('No transcription results received');
            }

            const firstResult = response.results[0];
            const firstAlternative = firstResult.alternatives?.[0];

            if (!firstAlternative) {
                throw new Error('No transcription alternatives received');
            }

            return {
                text: response.results
                    .map((result: SpeechRecognitionResult) =>
                        result.alternatives?.[0]?.transcript || '')
                    .join('\n'),
                confidence: firstAlternative.confidence || 0,
                wordTimings: firstAlternative.words?.map((word: WordInfo) => ({
                    word: word.word || '',
                    startTime: Number(word.startTime?.seconds || 0),
                    endTime: Number(word.endTime?.seconds || 0)
                }))
            };
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Speech-to-Text API error:', error);
                throw new Error(`Speech-to-Text API error: ${error.message}`);
            }
            throw new Error('Unknown Speech-to-Text API error');
        }
    }
}

export default new GoogleSpeechService();