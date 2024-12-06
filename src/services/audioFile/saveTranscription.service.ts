import fs from 'fs';

const TRANSCRIPTION_PATH = 'transcripts/transcription.txt';

export async function saveTranscribedText(transcribedText: string) {
  try {
    await fs.promises.writeFile(TRANSCRIPTION_PATH, transcribedText);
    console.log('Transcribed text saved to audioFile:', TRANSCRIPTION_PATH);
  } catch (error) {
    console.error('Error saving transcribed text:', error);
    throw error;
  }
}