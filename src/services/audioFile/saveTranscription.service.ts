import fs from 'fs';
import path from 'path';

export async function saveTranscribedText(transcribedText: string) {
  const filePath = path.join(__dirname, '../../transcripts', 'transcription.txt');

  try {
    await fs.promises.writeFile(filePath, transcribedText);
    console.log('Transcribed text saved to audioFile:', filePath);
  } catch (error) {
    console.error('Error saving transcribed text:', error);
    throw error;
  }
}