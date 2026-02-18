<script lang="ts">
	import { projects } from '$lib/data/projects';
	import { onMount } from 'svelte';
	import { getGsap } from '$lib/utils/gsap';
	import ProjectDetail from './ProjectDetail.svelte';
	import TimelineDot from './TimelineDot.svelte';

	let { onGoBack = () => {} }: { onGoBack?: () => void } = $props();

	let activeIndex = $state(0);
	let isAnimating = $state(false);
	let isMobile = $state(false);
	let detailEl: HTMLDivElement;
	let containerEl: HTMLDivElement;
	let gsap: Awaited<ReturnType<typeof getGsap>>;
	let prefersReduced = false;

	const itemsPerRow = $derived(isMobile ? 3 : 5);

	const activeProject = $derived(projects[activeIndex]);
	const rows = $derived(
		Array.from({ length: Math.ceil(projects.length / itemsPerRow) }, (_, i) =>
			projects.slice(i * itemsPerRow, (i + 1) * itemsPerRow)
		)
	);

	function goTo(index: number) {
		if (index === activeIndex || isAnimating || index < 0 || index >= projects.length) return;

		if (prefersReduced) {
			activeIndex = index;
			return;
		}

		isAnimating = true;
		gsap.to(detailEl, {
			opacity: 0,
			y: -8,
			duration: 0.2,
			ease: 'power2.in',
			onComplete: () => {
				activeIndex = index;
				gsap.fromTo(
					detailEl,
					{ opacity: 0, y: 8 },
					{
						opacity: 1,
						y: 0,
						duration: 0.3,
						ease: 'power2.out',
						onComplete: () => {
							isAnimating = false;
						}
					}
				);
			}
		});
	}

	function handleWheel(e: WheelEvent) {
		e.preventDefault();
		if (isAnimating) return;

		const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
		if (Math.abs(delta) < 10) return;

		if (delta > 0) {
			goTo(activeIndex + 1);
		} else {
			if (activeIndex === 0) {
				onGoBack();
			} else {
				goTo(activeIndex - 1);
			}
		}
	}

	let touchStartX = 0;
	function handleTouchStart(e: TouchEvent) {
		touchStartX = e.touches[0].clientX;
	}

	function handleTouchEnd(e: TouchEvent) {
		const dx = e.changedTouches[0].clientX - touchStartX;
		if (Math.abs(dx) < 50) return;
		if (dx < 0) {
			goTo(activeIndex + 1);
		} else {
			if (activeIndex === 0) {
				onGoBack();
			} else {
				goTo(activeIndex - 1);
			}
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
			e.preventDefault();
			goTo(activeIndex + 1);
		} else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
			e.preventDefault();
			if (activeIndex === 0) {
				onGoBack();
			} else {
				goTo(activeIndex - 1);
			}
		}
	}

	onMount(() => {
		prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const mql = window.matchMedia('(max-width: 640px)');
		isMobile = mql.matches;
		const handleResize = (e: MediaQueryListEvent) => { isMobile = e.matches; };
		mql.addEventListener('change', handleResize);

		getGsap().then((g) => {
			gsap = g;
			gsap.fromTo(detailEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
		});

		window.addEventListener('keydown', handleKeydown, { capture: true });
		containerEl.addEventListener('wheel', handleWheel, { passive: false });
		return () => {
			mql.removeEventListener('change', handleResize);
			window.removeEventListener('keydown', handleKeydown, { capture: true });
			containerEl.removeEventListener('wheel', handleWheel);
		};
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	bind:this={containerEl}
	class="flex flex-1 flex-col touch-pan-y"
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
	role="region"
	aria-label="프로젝트 타임라인"
>
	<!-- Detail panel -->
	<div bind:this={detailEl} class="flex flex-1 justify-center overflow-y-auto px-4 pt-[6vh] sm:pt-[15vh]">
		{#key activeProject.name}
			<ProjectDetail project={activeProject} />
		{/key}
	</div>

	<!-- S-shaped Timeline -->
	<nav class="shrink-0 px-2 pb-6 pt-2 sm:px-6 sm:pb-12" aria-label="타임라인 네비게이션">
		{#each rows as row, rowIndex}
			{@const isEven = rowIndex % 2 === 0}
			{@const isReversed = !isEven}
			{@const textAbove = isEven}
			{@const hasNext = rowIndex < rows.length - 1}
			{@const hasPrev = rowIndex > 0}
			{@const trimRight = (hasNext && isEven) || (hasPrev && (rowIndex - 1) % 2 === 0)}
			{@const trimLeft = (hasNext && !isEven) || (hasPrev && (rowIndex - 1) % 2 !== 0)}

			<!-- Row -->
			<div class="relative z-10 flex items-start justify-between" class:flex-row-reverse={isReversed}>
				<!-- Horizontal line -->
				{#if textAbove}
					<div
						class="absolute bottom-[8px] h-0.5 bg-border"
						class:right-0={!trimRight} class:right-6={trimRight}
						class:left-0={!trimLeft} class:left-6={trimLeft}
					></div>
				{:else}
					<div
						class="absolute top-[8px] h-0.5 bg-border"
						class:right-0={!trimRight} class:right-6={trimRight}
						class:left-0={!trimLeft} class:left-6={trimLeft}
					></div>
				{/if}


				{#each row as project, i}
					{@const globalIndex = rowIndex * itemsPerRow + i}
					<TimelineDot {project} {textAbove} {isMobile} isActive={globalIndex === activeIndex} onclick={() => goTo(globalIndex)} />
				{/each}
			</div>

			<!-- Rounded connector between rows -->
			{#if hasNext}
				<div
					class="pointer-events-none relative z-0 flex {isEven ? '-my-[10px]' : '-my-[27px] sm:-my-[10px]'}"
					class:justify-end={isEven}
					class:justify-start={!isEven}
				>
					<div
						class="w-6 border-y-2 border-border sm:h-20 sm:w-8 {isEven ? 'h-12' : 'h-[82px]'}"
						class:border-r-2={isEven}
						class:rounded-r-3xl={isEven}
						class:border-l-2={!isEven}
						class:rounded-l-3xl={!isEven}
					></div>
				</div>
			{/if}
		{/each}
	</nav>
</div>
