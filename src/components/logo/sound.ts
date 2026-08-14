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

const BASS_NOTES = TRACK.map(([note]) => Tone.Frequency(note).transpose(-12).toNote());
const TREBLE_NOTES = TRACK.map(([note]) => Tone.Frequency(note).transpose(12).toNote());

const MASTER_VOLUME_DB = -6;
const RAMP_TIME = 0.05;
const FILTER_MIN_HZ = 400;
const FILTER_MAX_HZ = 8000;

export function createLogoSound() {
	let noteIndex = 0;

	const master = new Tone.Volume(MASTER_VOLUME_DB).toDestination();
	const reverb = new Tone.Reverb({ decay: 3, wet: 0.4 }).connect(master);
	const delay = new Tone.FeedbackDelay('8n', 0.1).connect(reverb);
	delay.wet.value = 0.12;
	const chorus = new Tone.Chorus({ frequency: 1.5, delayTime: 3.5, depth: 0.6, wet: 0.35 }).connect(delay).start();
	const panner = new Tone.Panner(0).connect(chorus);
	const filter = new Tone.Filter({ type: 'lowpass', frequency: 4000, Q: 0.7 }).connect(panner);

	function createVoice(Voice: typeof Tone.Synth | typeof Tone.FMSynth, options: object, volume: number) {
		const voice = new Tone.PolySynth(Voice as any, options).connect(filter);
		voice.set({ volume });
		return voice;
	}

	const synth = createVoice(Tone.FMSynth, {
		harmonicity: 2.5,
		modulationIndex: 4,
		envelope: { attack: 0.005, decay: 0.25, sustain: 0.08, release: 0.5 },
		modulationEnvelope: { attack: 0.01, decay: 0.2, sustain: 0, release: 0.2 },
	}, -4);

	const pad = createVoice(Tone.Synth, {
		oscillator: { type: 'sine' },
		envelope: { attack: 0.02, decay: 0.4, sustain: 0.15, release: 1.2 },
	}, -14);

	const shimmer = createVoice(Tone.Synth, {
		oscillator: { type: 'triangle' },
		envelope: { attack: 0.05, decay: 0.6, sustain: 0, release: 1.5 },
	}, -18);

	function playNote(px: number, py: number) {
		Tone.start();

		// X position pans left/right, Y position controls filter brightness.
		const normX = px / window.innerWidth;
		const normY = py / window.innerHeight;
		panner.pan.rampTo(normX * 2 - 1, RAMP_TIME);
		filter.frequency.rampTo(FILTER_MIN_HZ + (1 - normY) * (FILTER_MAX_HZ - FILTER_MIN_HZ), RAMP_TIME);

		const index = noteIndex++ % TRACK.length;
		const [note, duration] = TRACK[index]!;
		synth.triggerAttackRelease(note, duration);
		pad.triggerAttackRelease(BASS_NOTES[index]!, duration);
		shimmer.triggerAttackRelease(TREBLE_NOTES[index]!, '8n');
	}

	function reset() {
		noteIndex = 0;
	}

	return { playNote, reset };
}
