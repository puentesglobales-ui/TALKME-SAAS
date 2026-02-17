
export async function playPcmAudio(data: Uint8Array) {
  // Google Translate TTS returns MP3, not PCM
  try {
    const blob = new Blob([data.buffer as ArrayBuffer], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);

    return new Promise<void>((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      audio.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };
      audio.play().catch(reject);
    });
  } catch (error) {
    console.error("Audio playback error:", error);
    throw error;
  }
}
