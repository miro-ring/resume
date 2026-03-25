import type { Highlight } from './types/highlight';

const STORAGE_KEY = 'blog-highlights';

export function getHighlights(slug: string): Highlight[] {
	if (typeof window === 'undefined') return [];

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return [];

		const all: Highlight[] = JSON.parse(stored);
		return all.filter((h) => h.slug === slug);
	} catch {
		return [];
	}
}

export function saveHighlight(highlight: Highlight): void {
	if (typeof window === 'undefined') return;

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		const all: Highlight[] = stored ? JSON.parse(stored) : [];
		all.push(highlight);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
	} catch {
		console.error('Failed to save highlight');
	}
}

export function removeHighlight(slug: string, id: string): void {
	if (typeof window === 'undefined') return;

	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return;

		const all: Highlight[] = JSON.parse(stored);
		const filtered = all.filter((h) => !(h.slug === slug && h.id === id));
		localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
	} catch {
		console.error('Failed to remove highlight');
	}
}

export interface SelectionInfo {
	text: string;
	prefix: string;
	suffix: string;
	range: Range;
}

export function getSelectionInfo(proseElement: HTMLElement): SelectionInfo | null {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) return null;

	const range = selection.getRangeAt(0);
	const text = selection.toString().trim();

	if (!text) return null;

	// Check if selection is within prose element
	if (!proseElement.contains(range.commonAncestorContainer)) return null;

	// Check if selection is inside code block
	const ancestor = range.commonAncestorContainer;
	const node =
		ancestor.nodeType === Node.TEXT_NODE ? ancestor.parentElement : (ancestor as Element);
	if (node?.closest('pre, code')) return null;

	// Get context
	const fullText = proseElement.textContent || '';
	const rangeText = text;

	// Find position in full text
	const textBefore = getTextBefore(range, proseElement);
	const startIndex = textBefore.length;

	const prefix = fullText.slice(Math.max(0, startIndex - 30), startIndex);
	const suffix = fullText.slice(startIndex + rangeText.length, startIndex + rangeText.length + 30);

	return { text, prefix, suffix, range };
}

function getTextBefore(range: Range, container: HTMLElement): string {
	const preRange = document.createRange();
	preRange.setStart(container, 0);
	preRange.setEnd(range.startContainer, range.startOffset);
	return preRange.toString();
}

export function generateId(): string {
	return crypto.randomUUID();
}

export function wrapWithHighlight(range: Range, id: string): HTMLElement {
	const mark = document.createElement('mark');
	mark.className = 'highlight-mark';
	mark.dataset.highlightId = id;

	try {
		range.surroundContents(mark);
	} catch {
		// Selection spans multiple elements - wrap each text node individually
		const textNodes = getTextNodesInRange(range);
		for (const { node, start, end } of textNodes) {
			const text = node.textContent || '';
			if (start >= text.length || text.slice(start, end).trim() === '') continue;

			const wrappingRange = document.createRange();
			wrappingRange.setStart(node, start);
			wrappingRange.setEnd(node, end);

			const m = document.createElement('mark');
			m.className = 'highlight-mark';
			m.dataset.highlightId = id;
			wrappingRange.surroundContents(m);
		}
		return mark;
	}

	return mark;
}

function getTextNodesInRange(range: Range): { node: Text; start: number; end: number }[] {
	const result: { node: Text; start: number; end: number }[] = [];
	const container = range.commonAncestorContainer;

	if (container.nodeType === Node.TEXT_NODE) {
		result.push({ node: container as Text, start: range.startOffset, end: range.endOffset });
		return result;
	}

	const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
	let node: Text | null;
	let started = false;

	while ((node = walker.nextNode() as Text | null)) {
		if (node === range.startContainer) {
			started = true;
			result.push({ node, start: range.startOffset, end: node.textContent?.length || 0 });
		} else if (node === range.endContainer) {
			result.push({ node, start: 0, end: range.endOffset });
			break;
		} else if (started) {
			result.push({ node, start: 0, end: node.textContent?.length || 0 });
		}
	}

	return result;
}

export function restoreHighlights(container: HTMLElement, highlights: Highlight[]): void {
	for (const highlight of highlights) {
		const found = findTextWithContext(
			container,
			highlight.text,
			highlight.prefix,
			highlight.suffix
		);
		if (found) {
			wrapWithHighlight(found, highlight.id);
		}
	}
}

function findTextWithContext(
	container: HTMLElement,
	text: string,
	prefix: string,
	suffix: string
): Range | null {
	const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
		acceptNode: (node) => {
			// Skip code blocks
			if (node.parentElement?.closest('pre, code')) {
				return NodeFilter.FILTER_REJECT;
			}
			return NodeFilter.FILTER_ACCEPT;
		}
	});

	const textNodes: Text[] = [];
	let node: Text | null;
	while ((node = walker.nextNode() as Text | null)) {
		textNodes.push(node);
	}

	// Build full text and position map
	let fullText = '';
	const nodePositions: { node: Text; start: number; end: number }[] = [];

	for (const textNode of textNodes) {
		const start = fullText.length;
		const content = textNode.textContent || '';
		fullText += content;
		nodePositions.push({ node: textNode, start, end: fullText.length });
	}

	// Find text with context
	let searchIndex = 0;
	let matchStart = -1;

	while ((matchStart = fullText.indexOf(text, searchIndex)) !== -1) {
		const candidatePrefix = fullText.slice(Math.max(0, matchStart - prefix.length), matchStart);
		const candidateSuffix = fullText.slice(
			matchStart + text.length,
			matchStart + text.length + suffix.length
		);

		// Check if context matches (allow partial matches for edge cases)
		const prefixMatch = prefix.length === 0 || candidatePrefix.endsWith(prefix.slice(-10));
		const suffixMatch = suffix.length === 0 || candidateSuffix.startsWith(suffix.slice(0, 10));

		if (prefixMatch && suffixMatch) {
			const range = document.createRange();
			const startPos = matchStart;
			const endPos = matchStart + text.length;

			// Find start node and offset
			for (const pos of nodePositions) {
				if (startPos >= pos.start && startPos < pos.end) {
					range.setStart(pos.node, startPos - pos.start);
					break;
				}
			}

			// Find end node and offset
			for (const pos of nodePositions) {
				if (endPos > pos.start && endPos <= pos.end) {
					range.setEnd(pos.node, endPos - pos.start);
					break;
				}
			}

			return range;
		}

		searchIndex = matchStart + 1;
	}

	return null;
}
