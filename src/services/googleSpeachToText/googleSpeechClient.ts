import { SpeechClient } from '@google-cloud/speech';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Google Speech Client configuration
 */
class GoogleSpeechClientConfig {
    private static instance: SpeechClient;

    /**
     * Get Speech Client instance (Singleton pattern)
     */
    public static getClient(): SpeechClient {
        if (!this.instance) {
            this.instance = new SpeechClient({
                keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
            });
        }
        return this.instance;
    }
}

export default GoogleSpeechClientConfig;