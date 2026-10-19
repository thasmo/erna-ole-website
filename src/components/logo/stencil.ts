export interface Glyph {
	text: string;
	font: string;
	x: number;
	y: number;
	opacity: number;
	transform?: DOMMatrix;
}

export interface Border {
	rect: DOMRect;
	width: number;
	color: string;
}

// Paints the page background over the video and cuts the glyphs out of it,
// so the natively playing video only shows through the text.
export function createStencil(canvas: HTMLCanvasElement, background: string) {
	const context = canvas.getContext('2d')!;
	let ratio = 1;
	let width = 0;
	let height = 0;

	function resize() {
		ratio = window.devicePixelRatio || 1;
		width = canvas.clientWidth;
		height = canvas.clientHeight;
		canvas.width = Math.round(width * ratio);
		canvas.height = Math.round(height * ratio);
	}

	function xHeight(font: string) {
		context.font = font;
		return context.measureText('x').actualBoundingBoxAscent;
	}

	function paint(glyphs: Glyph[], border?: Border) {
		context.globalCompositeOperation = 'source-over';
		context.globalAlpha = 1;
		context.setTransform(ratio, 0, 0, ratio, 0, 0);
		context.fillStyle = background;
		context.fillRect(0, 0, width, height);

		if (border) {
			const { rect, width: inset, color } = border;
			context.fillStyle = color;
			context.beginPath();
			context.rect(rect.left, rect.top, rect.width, rect.height);
			context.rect(rect.left + inset, rect.top + inset, rect.width - inset * 2, rect.height - inset * 2);
			context.fill('evenodd');
		}

		context.globalCompositeOperation = 'destination-out';
		context.fillStyle = '#000';
		context.textAlign = 'center';

		for (const glyph of glyphs) {
			context.setTransform(ratio, 0, 0, ratio, 0, 0);
			if (glyph.transform) {
				const { a, b, c, d, e, f } = glyph.transform;
				context.transform(a, b, c, d, e, f);
			}

			context.globalAlpha = glyph.opacity;
			context.font = glyph.font;
			context.fillText(glyph.text, glyph.x, glyph.y);
		}
	}

	return { resize, xHeight, paint };
}
