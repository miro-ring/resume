<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	let pullY = $state(0);
	let isRefreshing = $state(false);
	let isPulling = $state(false);
	let hasInteracted = $state(false);

	let startY = 0;
	let startX = 0;
	let directionLocked = false;
	let isVerticalPull = false;
	let mouseDown = false;

	const THRESHOLD = 80;

	const spinnerRotation = $derived((pullY / THRESHOLD) * 360);
	const reachedThreshold = $derived(pullY >= THRESHOLD);
	const transition = $derived(isPulling ? 'none' : 'all 0.3s ease');

	function startPull(x: number, y: number) {
		if (isRefreshing) return;
		startY = y;
		startX = x;
		directionLocked = false;
		isVerticalPull = false;
	}

	function movePull(x: number, y: number, e: Event) {
		if (isRefreshing) return;

		const dy = y - startY;
		const dx = x - startX;

		if (!directionLocked && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
			directionLocked = true;
			isVerticalPull = Math.abs(dy) > Math.abs(dx);
		}

		if (!isVerticalPull || dy <= 0) return;

		e.preventDefault();
		e.stopPropagation();
		isPulling = true;
		pullY = dy / 2.5;
	}

	function endPull(e: Event) {
		if (!isPulling) return;
		e.stopPropagation();

		const didReach = reachedThreshold;

		// 먼저 transition 활성화 (isPulling=false → transition: 'all 0.3s ease')
		isPulling = false;

		// 다음 프레임에서 값 변경 → 브라우저가 transition을 인식하고 애니메이션 실행
		requestAnimationFrame(() => {
			if (didReach) {
				isRefreshing = true;
				pullY = 48;

				setTimeout(() => {
					isRefreshing = false;
					pullY = 0;
					hasInteracted = true;
				}, 1500);
			} else {
				pullY = 0;
				hasInteracted = true;
			}
		});
	}

	// Touch
	function handleTouchStart(e: TouchEvent) {
		startPull(e.touches[0].clientX, e.touches[0].clientY);
	}

	function handleTouchMove(e: TouchEvent) {
		movePull(e.touches[0].clientX, e.touches[0].clientY, e);
	}

	function handleTouchEnd(e: TouchEvent) {
		endPull(e);
	}

	// Mouse
	function handleMouseDown(e: MouseEvent) {
		mouseDown = true;
		startPull(e.clientX, e.clientY);
	}

	function handleMouseMove(e: MouseEvent) {
		if (!mouseDown) return;
		movePull(e.clientX, e.clientY, e);
	}

	function handleMouseUp(e: MouseEvent) {
		if (!mouseDown) return;
		mouseDown = false;
		endPull(e);
	}
</script>

<svelte:window onmousemove={handleMouseMove} onmouseup={handleMouseUp} />

<div
	class="relative select-none touch-pan-x"
	ontouchstart={handleTouchStart}
	ontouchmove={handleTouchMove}
	ontouchend={handleTouchEnd}
	onmousedown={handleMouseDown}
	role="presentation"
	style="cursor: {isPulling ? 'grabbing' : 'grab'};"
>
	<!-- Hint (before interaction) -->
	<div class="grid transition-all duration-300 {hasInteracted ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}">
		<div class="overflow-hidden">
			<p class="pointer-events-none mb-3 text-center text-xs text-muted-foreground/40 transition-opacity duration-200 {isPulling || isRefreshing || hasInteracted ? 'opacity-0' : ''}">
				<span class="inline-block animate-bounce">↓</span> 당겨서 체험해보세요
			</p>
		</div>
	</div>

	<!-- Spinner (during/after interaction) -->
	<div
		class="pointer-events-none absolute inset-x-0 flex justify-center"
		style="top: {Math.min(pullY - 36, 16)}px; opacity: {Math.min(pullY / 40, 1)}; transition: {transition};"
	>
		<div
			class="h-5 w-5 rounded-full border-2 {reachedThreshold || isRefreshing
				? 'border-primary/30 border-t-primary'
				: 'border-muted-foreground/20 border-t-muted-foreground/60'}"
			class:ptr-spinning={isRefreshing}
			style="transform: rotate({spinnerRotation}deg); {isPulling ? '' : 'transition: transform 0.3s ease;'}"
		></div>
	</div>

	<!-- Content -->
	<div style="transform: translateY({pullY}px); transition: {transition};">
		{@render children()}
	</div>
</div>

<style>
	.ptr-spinning {
		animation: ptr-spin 0.5s linear infinite !important;
	}

	@keyframes ptr-spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
