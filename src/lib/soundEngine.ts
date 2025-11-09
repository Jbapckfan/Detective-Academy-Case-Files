// Web Audio API based sound engine for generating professional sounds without audio files
// This creates a lightweight, premium audio experience with noir-themed sounds

class SoundEngine {
  private audioContext: AudioContext | null = null;
  private masterVolume: GainNode | null = null;
  private musicVolume: GainNode | null = null;
  private sfxVolume: GainNode | null = null;
  private isMuted: boolean = false;
  private currentMusic: OscillatorNode[] = [];
  private settings: { music: number; sfx: number; enabled: boolean } = {
    music: 0.3,
    sfx: 0.6,
    enabled: true
  };

  constructor() {
    // Initialize on first user interaction to comply with browser autoplay policies
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

      // Create master gain node
      this.masterVolume = this.audioContext.createGain();
      this.masterVolume.connect(this.audioContext.destination);

      // Create music and SFX gain nodes
      this.musicVolume = this.audioContext.createGain();
      this.musicVolume.connect(this.masterVolume);
      this.musicVolume.gain.value = this.settings.music;

      this.sfxVolume = this.audioContext.createGain();
      this.sfxVolume.connect(this.masterVolume);
      this.sfxVolume.gain.value = this.settings.sfx;
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  // Ensure audio context is resumed (required for browser autoplay policies)
  private async resumeContext() {
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // === VOLUME CONTROLS ===
  setMusicVolume(volume: number) {
    if (!this.musicVolume) return;
    this.settings.music = Math.max(0, Math.min(1, volume));
    this.musicVolume.gain.value = this.isMuted ? 0 : this.settings.music;
  }

  setSFXVolume(volume: number) {
    if (!this.sfxVolume) return;
    this.settings.sfx = Math.max(0, Math.min(1, volume));
    this.sfxVolume.gain.value = this.isMuted ? 0 : this.settings.sfx;
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterVolume) {
      this.masterVolume.gain.value = this.isMuted ? 0 : 1;
    }
    return this.isMuted;
  }

  setEnabled(enabled: boolean) {
    this.settings.enabled = enabled;
    if (!enabled) {
      this.stopMusic();
    }
  }

  // === MUSIC GENERATION ===
  // Noir jazz ambient background music using additive synthesis
  startNoirAmbience() {
    if (!this.audioContext || !this.musicVolume || !this.settings.enabled) return;
    this.resumeContext();

    this.stopMusic();

    const now = this.audioContext.currentTime;

    // Create a moody, atmospheric noir jazz chord progression
    // Using low frequencies and minor tonalities
    const baseFreq = 55; // A1 - deep bass note
    const chordNotes = [
      [1, 1.2, 1.5], // Am chord (A, C, E)
      [0.9, 1.1, 1.35], // Gm chord
      [0.84, 1.05, 1.26], // Fm chord
      [0.75, 0.94, 1.125] // Dm chord
    ];

    // Create subtle oscillators for ambient pad sound
    chordNotes.forEach((chord, chordIndex) => {
      chord.forEach((ratio, noteIndex) => {
        const osc = this.audioContext!.createOscillator();
        const gain = this.audioContext!.createGain();

        // Use sine waves for smooth, warm tones
        osc.type = 'sine';
        osc.frequency.value = baseFreq * ratio;

        // Very subtle volume, layered for richness
        gain.gain.value = 0;
        gain.gain.setTargetAtTime(0.02 / (noteIndex + 1), now + chordIndex * 4, 2);

        osc.connect(gain);
        gain.connect(this.musicVolume!);

        osc.start(now + chordIndex * 4);
        this.currentMusic.push(osc);
      });
    });

    // Add subtle vinyl crackle effect
    this.addVinylCrackle();
  }

  private addVinylCrackle() {
    if (!this.audioContext || !this.musicVolume) return;

    // Create white noise for vinyl texture
    const bufferSize = this.audioContext.sampleRate * 2;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.01; // Very subtle
    }

    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const noiseGain = this.audioContext.createGain();
    noiseGain.gain.value = 0.008;

    // Low-pass filter for warm crackle
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;

    noise.connect(noiseGain);
    noiseGain.connect(filter);
    filter.connect(this.musicVolume);

    noise.start();
    this.currentMusic.push(noise as any);
  }

  stopMusic() {
    this.currentMusic.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.currentMusic = [];
  }

  // === SOUND EFFECTS ===

  // UI Click sound - short, satisfying pop
  playClick() {
    if (!this.settings.enabled) return;
    this.playTone(800, 0.05, 'sine', 0.15, this.sfxVolume);
  }

  // Hover sound - subtle high frequency
  playHover() {
    if (!this.settings.enabled) return;
    this.playTone(1200, 0.03, 'sine', 0.08, this.sfxVolume);
  }

  // Success sound - ascending triumphant tones
  playSuccess() {
    if (!this.settings.enabled) return;
    this.resumeContext();
    if (!this.audioContext || !this.sfxVolume) return;

    const now = this.audioContext.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 - major chord

    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.2, 'sine', 0.3, this.sfxVolume);
      }, i * 80);
    });
  }

  // Perfect solve - extra special sound
  playPerfect() {
    if (!this.settings.enabled) return;
    this.resumeContext();
    if (!this.audioContext || !this.sfxVolume) return;

    const now = this.audioContext.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.25, 'sine', 0.35, this.sfxVolume);
        // Add harmonic
        this.playTone(freq * 2, 0.25, 'sine', 0.15, this.sfxVolume);
      }, i * 60);
    });
  }

  // Error sound - descending dissonant tone
  playError() {
    if (!this.settings.enabled) return;
    this.resumeContext();
    if (!this.audioContext || !this.sfxVolume) return;

    const now = this.audioContext.currentTime;
    this.playTone(400, 0.08, 'sawtooth', 0.25, this.sfxVolume);
    setTimeout(() => {
      this.playTone(300, 0.12, 'sawtooth', 0.25, this.sfxVolume);
    }, 80);
  }

  // Hint sound - curious, questioning tone
  playHint() {
    if (!this.settings.enabled) return;
    this.resumeContext();
    if (!this.audioContext || !this.sfxVolume) return;

    const frequencies = [440, 554.37, 659.25]; // A4, C#5, E5
    frequencies.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.15, 'triangle', 0.2, this.sfxVolume);
      }, i * 100);
    });
  }

  // Companion speak - friendly chirp/beep
  playCompanionSpeak(personality: 'owl' | 'fox' | 'robot') {
    if (!this.settings.enabled) return;
    this.resumeContext();
    if (!this.audioContext || !this.sfxVolume) return;

    let baseFreq: number;
    let waveType: OscillatorType;

    switch (personality) {
      case 'owl':
        baseFreq = 400; // Lower, wise tone
        waveType = 'sine';
        break;
      case 'fox':
        baseFreq = 600; // Mid, clever tone
        waveType = 'triangle';
        break;
      case 'robot':
        baseFreq = 500; // Robotic tone
        waveType = 'square';
        break;
    }

    this.playTone(baseFreq, 0.08, waveType, 0.15, this.sfxVolume);
    setTimeout(() => {
      this.playTone(baseFreq * 1.2, 0.06, waveType, 0.12, this.sfxVolume);
    }, 60);
  }

  // Achievement unlock - celebratory fanfare
  playAchievementUnlock() {
    if (!this.settings.enabled) return;
    this.resumeContext();
    if (!this.audioContext || !this.sfxVolume) return;

    const melody = [
      { freq: 523.25, duration: 0.12 }, // C5
      { freq: 659.25, duration: 0.12 }, // E5
      { freq: 783.99, duration: 0.12 }, // G5
      { freq: 1046.50, duration: 0.25 }, // C6
    ];

    let time = 0;
    melody.forEach(note => {
      setTimeout(() => {
        this.playTone(note.freq, note.duration, 'sine', 0.4, this.sfxVolume);
        // Add sparkle with higher harmonic
        this.playTone(note.freq * 3, note.duration * 0.5, 'sine', 0.15, this.sfxVolume);
      }, time);
      time += note.duration * 1000;
    });
  }

  // Puzzle move sound - subtle mechanical click
  playPuzzleMove() {
    if (!this.settings.enabled) return;
    this.playTone(220, 0.04, 'square', 0.12, this.sfxVolume);
  }

  // Timer tick - subtle reminder
  playTimerTick() {
    if (!this.settings.enabled) return;
    this.playTone(880, 0.02, 'sine', 0.1, this.sfxVolume);
  }

  // Page transition - whoosh sound
  playPageTransition() {
    if (!this.settings.enabled) return;
    this.resumeContext();
    if (!this.audioContext || !this.sfxVolume) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, this.audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);

    gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.sfxVolume);

    osc.start();
    osc.stop(this.audioContext.currentTime + 0.3);
  }

  // === HELPER METHODS ===
  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType,
    volume: number,
    destination: GainNode | null
  ) {
    if (!this.audioContext || !destination) return;
    this.resumeContext();

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = type;
    osc.frequency.value = frequency;

    gain.gain.value = volume;
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    osc.connect(gain);
    gain.connect(destination);

    osc.start();
    osc.stop(this.audioContext.currentTime + duration);
  }
}

// Export singleton instance
export const soundEngine = new SoundEngine();
