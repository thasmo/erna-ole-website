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
const MAX_POLYPHONY = 8;
const MIN_NOTE_INTERVAL = 0.025;

export function createLogoSound() {
	let noteIndex = 0;
	let lastTime = 0;

	const limiter = new Tone.Limiter(-6).toDestination();
	const reverb = new Tone.Reverb({ decay: 1.2, wet: 0.2 }).connect(limiter);
	const delay = new Tone.FeedbackDelay({ delayTime: '16n', feedback: 0.2, wet: 0.18 }).connect(reverb);
	const filter = new Tone.Filter({ type: 'lowpass', frequency: 4000, Q: 0.7 }).connect(delay);
	const panner = new Tone.Panner(0).connect(filter);

	const synth = new Tone.PolySynth({
		maxPolyphony: MAX_POLYPHONY,
		voice: Tone.Synth,
		options: {
			oscillator: { type: 'fatsawtooth', count: 2, spread: 20 },
			envelope: { attack: 0.005, decay: 0.2, sustain: 0, release: 0.3 },
		},
	}).connect(panner);
	synth.volume.value = MASTER_VOLUME_DB;

	function playNote(px: number, py: number) {
		if (Tone.getContext().state !== 'running')
			Tone.start();

		const time = Tone.now();
		if (time - lastTime < MIN_NOTE_INTERVAL)
			return;
		lastTime = time;

		const normX = px / window.innerWidth;
		const normY = py / window.innerHeight;
		panner.pan.rampTo(normX * 2 - 1, RAMP_TIME);
		filter.frequency.rampTo(FILTER_MIN_HZ + (1 - normY) * (FILTER_MAX_HZ - FILTER_MIN_HZ), RAMP_TIME);

		const [baseNote, duration] = TRACK[noteIndex++ % TRACK.length]!;
		const detuneCents = (Math.random() - 0.5) * 20;
		const frequency = Tone.Frequency(baseNote).toFrequency() * 2 ** (detuneCents / 1200);
		const velocity = 0.7 + Math.random() * 0.3;
		synth.triggerAttackRelease(frequency, duration, time, velocity);
	}

	function reset() {
		noteIndex = 0;
		lastTime = 0;
	}

	return { playNote, reset };
}
