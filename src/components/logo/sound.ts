import * as Tone from 'tone';

const TRACK: [note: string, duration: string][] = [
	['C4', '16n'],
	['E4', '16n'],
	['G4', '16n'],
	['C5', '8n'],
	['E5', '16n'],
	['D5', '16n'],
	['C5', '16n'],
	['G4', '8n'],
	['A4', '16n'],
	['C5', '16n'],
	['E5', '16n'],
	['G5', '8n'],
	['E5', '16n'],
	['C5', '16n'],
	['A4', '16n'],
	['G4', '8n'],
];

const MASTER_VOLUME_DB = -12;
const RAMP_TIME = 0.05;
const FILTER_MIN_HZ = 400;
const FILTER_MAX_HZ = 8000;

export function createLogoSound() {
	let noteIndex = 0;
	let nextTime = 0;

	const limiter = new Tone.Limiter(-6).toDestination();
	const reverb = new Tone.Reverb({ decay: 1.2, wet: 0.2 }).connect(limiter);
	const delay = new Tone.FeedbackDelay({ delayTime: '16n', feedback: 0.2, wet: 0.18 }).connect(reverb);
	const filter = new Tone.Filter({ type: 'lowpass', frequency: 4000, Q: 0.7 }).connect(delay);
	const panner = new Tone.Panner(0).connect(filter);

	const synth = new Tone.PolySynth(Tone.Synth, {
		oscillator: { type: 'fatsawtooth', count: 3, spread: 25 },
		envelope: { attack: 0.005, decay: 0.2, sustain: 0, release: 0.3 },
	}).connect(panner);
	synth.volume.value = MASTER_VOLUME_DB;

	function playNote(px: number, py: number) {
		Tone.start();

		const normX = px / window.innerWidth;
		const normY = py / window.innerHeight;
		panner.pan.rampTo(normX * 2 - 1, RAMP_TIME);
		filter.frequency.rampTo(FILTER_MIN_HZ + (1 - normY) * (FILTER_MAX_HZ - FILTER_MIN_HZ), RAMP_TIME);

		const [baseNote, duration] = TRACK[noteIndex++ % TRACK.length]!;
		const detune = (Math.random() - 0.5) * 20;
		const velocity = 0.7 + Math.random() * 0.3;
		nextTime = Math.max(Tone.now(), nextTime + 0.001);
		synth.set({ detune });
		synth.triggerAttackRelease(baseNote, duration, nextTime, velocity);
	}

	function reset() {
		noteIndex = 0;
		nextTime = 0;
	}

	return { playNote, reset };
}
