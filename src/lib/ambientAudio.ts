// Pure Web Audio API Ambient Sound Generator
// Generates soothing white/pink noise, gentle rain simulation, and session chimes without external audio assets.

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private activeNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private currentMode: 'rain' | 'whitenoise' | 'cafe' | 'off' = 'off';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public play(mode: 'rain' | 'whitenoise' | 'cafe', volume = 0.25) {
    this.stop();
    this.initContext();
    if (!this.ctx) return;

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(volume, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (mode === 'whitenoise') {
        // Pink-ish noise filter
        output[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      } else if (mode === 'rain') {
        // Brown noise simulation with soft low-pass filter
        output[i] = (lastOut + 0.015 * white) / 1.015;
        lastOut = output[i];
        output[i] *= 2.5;
      } else {
        // Cafe murmur simulation: modulated low frequency hum
        output[i] = Math.sin(i / 120) * 0.1 + (lastOut + 0.03 * white) / 1.03;
        lastOut = output[i];
      }
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to soften the frequency
    const filter = this.ctx.createBiquadFilter();
    filter.type = mode === 'rain' ? 'lowpass' : 'bandpass';
    filter.frequency.setValueAtTime(mode === 'rain' ? 800 : 1200, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    whiteNoise.start(0);

    this.activeNode = whiteNoise;
    this.currentMode = mode;
  }

  public setVolume(volume: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  public stop() {
    if (this.activeNode) {
      try {
        (this.activeNode as AudioBufferSourceNode).stop();
        this.activeNode.disconnect();
      } catch {
        // Node already stopped
      }
      this.activeNode = null;
    }
    this.currentMode = 'off';
  }

  public playChime() {
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.4); // A5

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 1.2);
  }

  public getMode() {
    return this.currentMode;
  }
}

export const ambientSound = new AmbientSoundEngine();
