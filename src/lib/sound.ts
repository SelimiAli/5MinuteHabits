import { Audio } from 'expo-av';

let completionSound: Audio.Sound | null = null;

/**
 * Initialize and load the completion sound
 */
export const initializeSound = async (): Promise<void> => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
  } catch (error) {
    console.error('Error initializing audio:', error);
  }
};

/**
 * Play a completion sound effect
 * Uses a simple beep sound generated programmatically
 */
export const playCompletionSound = async (): Promise<void> => {
  try {
    // Create a simple success sound using expo-av
    const { sound } = await Audio.Sound.createAsync(
      // Using a built-in system sound for completion
      { uri: 'https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3' },
      { shouldPlay: true, volume: 0.5 }
    );
    
    // Unload sound after playing
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.error('Error playing completion sound:', error);
  }
};

/**
 * Clean up sound resources
 */
export const cleanupSound = async (): Promise<void> => {
  try {
    if (completionSound) {
      await completionSound.unloadAsync();
      completionSound = null;
    }
  } catch (error) {
    console.error('Error cleaning up sound:', error);
  }
};
