import { SpeechClient } from '@google-cloud/speech';
import GoogleSpeechClientConfig from './googleSpeechClient';
import { CONFIG } from './googleSpeechToText.config';

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
     * Perform transcription using Google Speech-to-Text
     * @param audioBuffer - WAV format audio buffer
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

            return {
                text: response.results
                    .map(result => result.alternatives[0].transcript)
                    .join('\n'),
                confidence: response.results[0].alternatives[0].confidence,
                wordTimings: response.results[0].alternatives[0].words?.map(word => ({
                    word: word.word,
                    startTime: Number(word.startTime.seconds || 0),
                    endTime: Number(word.endTime.seconds || 0)
                }))
            };
        } catch (error) {
            console.error('Speech-to-Text API error:', error);
            throw new Error(`Speech-to-Text API error: ${error.message}`);
        }
    }
}

export default new GoogleSpeechService();