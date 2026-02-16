<script lang="ts">
	import ProjectTimeline from '$lib/components/ProjectTimeline.svelte';
	import { onMount } from 'svelte';
	import { getGsap } from '$lib/utils/gsap';

	let started = $state(false);
	let transitioning = $state(false);
	let introEl: HTMLDivElement;
	let mainEl: HTMLDivElement;

	function enter() {
		if (started || transitioning) return;
		transitioning = true;

		getGsap().then((gsap) => {
			gsap.to(introEl, {
				opacity: 0,
				y: -30,
				duration: 0.5,
				ease: 'power2.in',
				onComplete: () => {
					introEl.style.display = 'none';
					mainEl.style.display = 'flex';
					started = true;
					gsap.fromTo(
						mainEl,
						{ opacity: 0, y: 20 },
						{
							opacity: 1,
							y: 0,
							duration: 0.5,
							ease: 'power2.out',
							onComplete: () => {
								transitioning = false;
							}
						}
					);
				}
			});
		});
	}

	function goBack() {
		if (!started || transitioning) return;
		transitioning = true;

		getGsap().then((gsap) => {
			gsap.to(mainEl, {
				opacity: 0,
				y: 20,
				duration: 0.5,
				ease: 'power2.in',
				onComplete: () => {
					mainEl.style.display = 'none';
					introEl.style.display = 'flex';
					started = false;
					gsap.fromTo(
						introEl,
						{ opacity: 0, y: -30 },
						{
							opacity: 1,
							y: 0,
							duration: 0.5,
							ease: 'power2.out',
							onComplete: () => {
								transitioning = false;
							}
						}
					);
				}
			});
		});
	}

	function handleWheel(e: WheelEvent) {
		if (started) return;
		e.preventDefault();
		const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
		if (Math.abs(delta) < 10) return;
		enter();
	}

	let touchStartY = 0;
	function handleTouchStart(e: TouchEvent) {
		if (started) return;
		touchStartY = e.touches[0].clientY;
	}
	function handleTouchEnd(e: TouchEvent) {
		if (started) return;
		const dy = e.changedTouches[0].clientY - touchStartY;
		if (Math.abs(dy) > 50) enter();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (started) return;
		if (['ArrowDown', 'ArrowRight', ' '].includes(e.key)) {
			e.preventDefault();
			enter();
		}
	}

	onMount(() => {
		introEl.addEventListener('wheel', handleWheel, { passive: false });
		return () => {
			introEl.removeEventListener('wheel', handleWheel);
		};
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	class="-m-4 h-dvh overflow-hidden p-4 focus:outline-none sm:p-6"
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
	onkeydown={handleKeydown}
	tabindex="0"
>
	<!-- Intro -->
	<div
		bind:this={introEl}
		class="flex h-full flex-col items-center justify-center gap-4 pb-[20vh] text-center"
	>
		<p class="text-sm font-medium tracking-widest text-muted-foreground uppercase">Portfolio</p>
		<h1 class="text-3xl font-bold tracking-tight sm:text-5xl">FE 개발자 장동균입니다.</h1>
		<p class="mt-2 text-base text-muted-foreground sm:text-lg">
			저에 대해 더 알고 싶다면 스크롤을 해주세요.
		</p>
		<div class="mt-6 animate-bounce text-muted-foreground/50">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 5v14" /><path d="m19 12-7 7-7-7" />
			</svg>
		</div>
	</div>

	<!-- Main content (hidden initially) -->
	<div
		bind:this={mainEl}
		class="hidden h-full flex-col"
	>
		<ProjectTimeline onGoBack={goBack} />
	</div>
</div>
