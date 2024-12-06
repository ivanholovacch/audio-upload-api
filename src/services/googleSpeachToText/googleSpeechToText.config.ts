import {protos} from "@google-cloud/speech";

export type RecognitionConfig = protos.google.cloud.speech.v1.IRecognitionConfig;
export type RecognizeResponse = protos.google.cloud.speech.v1.IRecognizeResponse;
export type SpeechRecognitionResult = protos.google.cloud.speech.v1.ISpeechRecognitionResult;
export type WordInfo = protos.google.cloud.speech.v1.IWordInfo;

export const CONFIG = {
  encoding: 'LINEAR16' as const,
  sampleRateHertz: 16000,             // Required for WAV files
  languageCode: 'uk-UA',              // Primary language
  alternativeLanguageCodes: [         // Additional languages
    'en-US',
    'ru-RU'
  ],
  model: 'latest_long',               // Best model for accuracy
  useEnhanced: true,                  // Enhanced speech recognition

  // Speaker detection settings
  diarizationConfig: {
    enableSpeakerDiarization: true,   // Detect different speakers
    minSpeakerCount: 1,
    maxSpeakerCount: 6                // Adjust based on your needs
  },

  // Enable all available enhancements
  enableAutomaticPunctuation: true,
  enableWordTimeOffsets: true,        // Get word timings
  enableWordConfidence: true,         // Get confidence scores

  // Audio context metadata
  metadata: {
    microphoneDistance: 'NEARFIELD',
    originalMediaType: 'AUDIO',
    recordingDeviceType: 'SMARTPHONE',
    interactionType: 'DISCUSSION'
  } as const,

  // Optional but recommended for specific terminology
  speechContexts: [{
    phrases: [],                      // Add domain-specific phrases
    boost: 20                         // Boost phrase recognition
  }]
} satisfies RecognitionConfig;