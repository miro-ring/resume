<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { page } from '$app/state';
	import type { Highlight } from '$lib/types/highlight';
	import {
		getHighlights,
		saveHighlight,
		removeHighlight,
		getSelectionInfo,
		generateId,
		wrapWithHighlight,
		restoreHighlights
	} from '$lib/highlight';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let proseElement: HTMLElement;
	let deleteTooltipVisible = $state(false);
	let deleteTooltipX = $state(0);
	let deleteTooltipY = $state(0);
	let selectedHighlightId = $state<string | null>(null);

	function getSlug(): string {
		return page.params.slug || '';
	}

	onMount(() => {
		// Restore saved highlights
		const highlights = getHighlights(getSlug());
		if (highlights.length > 0) {
			restoreHighlights(proseElement, highlights);
		}

		// Add click listener for existing highlights
		proseElement.addEventListener('click', handleHighlightClick);

		return () => {
			proseElement.removeEventListener('click', handleHighlightClick);
		};
	});

	function handleMouseUp() {
		// Small delay to ensure selection is complete
		setTimeout(() => {
			const info = getSelectionInfo(proseElement);
			if (info && info.text.length > 0) {
				applyHighlight(info);
			}
		}, 10);
	}

	function handleHighlightClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		const mark = target.closest('.highlight-mark') as HTMLElement | null;

		if (mark && mark.dataset.highlightId) {
			event.preventDefault();
			selectedHighlightId = mark.dataset.highlightId;
			const rect = mark.getBoundingClientRect();
			deleteTooltipX = rect.left + rect.width / 2;
			deleteTooltipY = rect.top - 10;
			deleteTooltipVisible = true;
		} else {
			deleteTooltipVisible = false;
			selectedHighlightId = null;
		}
	}

	function applyHighlight(info: ReturnType<typeof getSelectionInfo>) {
		if (!info) return;

		const id = generateId();
		const highlight: Highlight = {
			id,
			slug: getSlug(),
			text: info.text,
			prefix: info.prefix,
			suffix: info.suffix,
			createdAt: Date.now()
		};

		wrapWithHighlight(info.range, id);
		saveHighlight(highlight);

		// Clear selection
		window.getSelection()?.removeAllRanges();
	}

	function deleteHighlight() {
		if (!selectedHighlightId) return;

		const mark = proseElement.querySelector(
			`[data-highlight-id="${selectedHighlightId}"]`
		) as HTMLElement | null;

		if (mark) {
			// Unwrap the mark element
			const parent = mark.parentNode;
			while (mark.firstChild) {
				parent?.insertBefore(mark.firstChild, mark);
			}
			parent?.removeChild(mark);

			removeHighlight(getSlug(), selectedHighlightId);
		}

		deleteTooltipVisible = false;
		selectedHighlightId = null;
	}

	function handleDocumentClick(event: MouseEvent) {
		const target = event.target as HTMLElement;

		// Hide delete tooltip if clicking outside
		if (!target.closest('.delete-tooltip') && !target.closest('.highlight-mark')) {
			deleteTooltipVisible = false;
			selectedHighlightId = null;
		}
	}
</script>

<svelte:document onmousedown={handleDocumentClick} />

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div bind:this={proseElement} onmouseup={handleMouseUp} role="article">
	{@render children()}
</div>

<!-- Delete tooltip -->
{#if deleteTooltipVisible}
	<div
		class="delete-tooltip fixed z-50 -translate-x-1/2 -translate-y-full transform"
		style="left: {deleteTooltipX}px; top: {deleteTooltipY}px;"
	>
		<button
			onclick={deleteHighlight}
			class="flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white shadow-lg transition-colors hover:bg-red-600"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<path d="M3 6h18" />
				<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
				<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
			</svg>
			Remove
		</button>
		<div
			class="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-red-500"
		></div>
	</div>
{/if}
