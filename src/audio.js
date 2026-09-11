// All sound is synthesized locally; no downloaded or third-party recordings.
export class AudioLayer {
  constructor() { this.context = null; this.volume = 0.25; this.lastAmbient = 0; }
  start() { if (!this.context) this.context = new AudioContext(); if (this.context.state === 'suspended') this.context.resume(); }
  tone(kind = 'click') {
    if (!this.context || !this.volume) return;
    const c = this.context, o = c.createOscillator(), g = c.createGain();
    const tones = { click: [420, 680, 0.07], build: [260, 530, 0.2], warning: [170, 310, 0.65], shot: [110, 45, 0.08], ambient: [74, 77, 2], work: [240, 160, 0.08] };
    const [a, b, duration] = tones[kind] || tones.click;
    o.type = kind === 'shot' ? 'triangle' : 'sine'; o.frequency.setValueAtTime(a, c.currentTime); o.frequency.exponentialRampToValueAtTime(b, c.currentTime + duration);
    g.gain.setValueAtTime(0.001, c.currentTime); g.gain.linearRampToValueAtTime(this.volume * (kind === 'ambient' ? 0.045 : 0.12), c.currentTime + 0.01); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + duration);
  }
  update(s) {
    if (s.time - this.lastAmbient > 9) { this.lastAmbient = s.time; this.tone(s.people.some(p => ['build', 'gather'].includes(p.job?.type)) ? 'work' : 'ambient'); }
  }
}
