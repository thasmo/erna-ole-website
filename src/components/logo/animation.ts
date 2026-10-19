const START_EVENT = 'logo:start';

export const EASE = [0.16, 1, 0.3, 1] as const;

export function onLogoStart(callback: () => void) {
	document.addEventListener(START_EVENT, callback, { once: true });
}

export function startLogo() {
	document.dispatchEvent(new CustomEvent(START_EVENT));
}
