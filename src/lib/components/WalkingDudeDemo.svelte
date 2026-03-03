<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { getGsap } from '../utils/gsap';
	import dudeSvg from '$lib/assets/walking-dude.svg?raw';
	import brideSvg from '$lib/assets/walking-bride.svg?raw';
	import bouquetSvg from '$lib/assets/bouquet.svg?raw';

	let { children }: { children: Snippet } = $props();

	let animAreaEl: HTMLDivElement;
	let dudeEl: HTMLDivElement;
	let brideEl: HTMLDivElement;
	let bouquetEl: HTMLDivElement;

	let masterTl: gsap.core.Timeline;
	let bodyTl: gsap.core.Timeline;
	let backCycle: gsap.core.Timeline;
	let frontCycle: gsap.core.Timeline;
	let brideTl: gsap.core.Timeline;

	let progress = 0;
	let hasInteracted = $state(false);
	const SCROLL_DISTANCE = 1200;

	let touchStartY = 0;
	let touchStartProgress = 0;

	onMount(() => {
		initAnimation();

		animAreaEl.addEventListener('wheel', handleWheel, { passive: false, capture: true });
		animAreaEl.addEventListener('touchstart', handleTouchStart, { passive: true });
		animAreaEl.addEventListener('touchmove', handleTouchMove, { passive: false });

		return () => {
			animAreaEl.removeEventListener('wheel', handleWheel, { capture: true });
			animAreaEl.removeEventListener('touchstart', handleTouchStart);
			animAreaEl.removeEventListener('touchmove', handleTouchMove);
			masterTl?.kill();
			bodyTl?.kill();
			backCycle?.kill();
			frontCycle?.kill();
			brideTl?.kill();
		};
	});

	async function initAnimation() {
		const gsap = await getGsap();

		// --- Male figure setup ---
		const dudeSvgEl = dudeEl.querySelector('svg.new-man') as SVGSVGElement;
		if (!dudeSvgEl) return;
		dudeSvgEl.setAttribute('width', '80');
		dudeSvgEl.setAttribute('height', '120');

		const head = dudeSvgEl.querySelector('.head') as SVGElement;
		const legs = Array.from(dudeSvgEl.querySelectorAll(':scope > .leg')) as SVGElement[];
		const leftArm = dudeSvgEl.querySelector('.left-arm') as SVGElement;
		const rightArm = dudeSvgEl.querySelector('.right-arm') as SVGElement;
		const legBottoms = Array.from(dudeSvgEl.querySelectorAll('.leg-bottom')) as SVGElement[];
		const armBottoms = Array.from(dudeSvgEl.querySelectorAll('.arm-bottom')) as SVGElement[];
		const leftLegCircle = dudeSvgEl.querySelector('.left_leg_circle') as SVGElement;
		const leftArmCircle = dudeSvgEl.querySelector('.left_arm_circle') as SVGElement;
		const rightArmCircle = dudeSvgEl.querySelector('.right_arm_circle') as SVGElement;

		if (!head || legs.length < 2 || !leftArm || !rightArm) return;

		gsap.set(leftArm, { svgOrigin: '100 -20' });
		gsap.set(rightArm, { svgOrigin: '100 2' });
		gsap.set(head, { svgOrigin: '140 -50' });
		gsap.set(armBottoms, { svgOrigin: '100 40' });
		gsap.set(legs, { svgOrigin: '100 106' });
		gsap.set(legBottoms, { svgOrigin: '133 184' });

		// --- Bride figure setup ---
		const brideSvgEl = brideEl.querySelector('svg') as SVGSVGElement;
		if (brideSvgEl) {
			brideSvgEl.setAttribute('width', '80');
			brideSvgEl.setAttribute('height', '120');
		}
		const brideHead = brideEl.querySelector('.bride-head') as SVGElement;
		const leftFrontArm = brideEl.querySelector('.left-front-arm') as SVGElement;
		const leftBottomArm = brideEl.querySelector('.left-bottom-arm') as SVGElement;
		const leftFrontHand = brideEl.querySelector('.left-front-hand') as SVGElement;

		if (brideHead) gsap.set(brideHead, { svgOrigin: '100 10' });
		if (leftFrontArm) gsap.set(leftFrontArm, { svgOrigin: '116 36' });
		if (leftBottomArm) gsap.set(leftBottomArm, { svgOrigin: '120 20' });
		if (leftFrontHand) gsap.set(leftFrontHand, { svgOrigin: '118 38' });

		// --- Bouquet setup ---
		gsap.set(bouquetEl, { opacity: 0 });

		// --- Walking cycle timelines ---
		const halfBodyTimeline = (leg: SVGElement, arm: SVGElement) => {
			const legBottom = leg.querySelector('.leg-bottom') as SVGElement;
			const armBottom = arm.querySelector('.arm-bottom') as SVGElement;

			return gsap
				.timeline({ repeat: -1, paused: true })
				.fromTo(leg, { rotation: -20 }, { duration: 0.5, rotation: 15, ease: 'sine.inOut' }, 0)
				.to(leg, { duration: 0.25, rotation: -20, ease: 'sine.in' }, '>')
				.to(legBottom, { duration: 0.25, rotation: 15, ease: 'sine.inOut' }, 0.25)
				.to(legBottom, { duration: 0.25, rotation: 50, ease: 'sine.in' }, '>')
				.to(legBottom, { duration: 0.25, rotation: 0, ease: 'sine.out' }, '>')
				.fromTo(
					arm,
					{ rotation: -12 },
					{ duration: 0.5, rotation: 12, ease: 'sine.inOut', yoyo: true, repeat: 1 },
					0
				)
				.fromTo(
					armBottom,
					{ rotation: -15 },
					{ duration: 0.5, rotation: 10, ease: 'sine.inOut', yoyo: true, repeat: 1 },
					0
				);
		};

		backCycle = halfBodyTimeline(legs[0], rightArm);
		frontCycle = halfBodyTimeline(legs[1], leftArm);

		bodyTl = gsap
			.timeline({ paused: true })
			.to(dudeSvgEl, { duration: 0.25, y: '-=1', repeat: -1, yoyo: true, ease: 'sine.inOut' }, 0)
			.fromTo(
				head,
				{ rotation: -3 },
				{ duration: 0.25, rotation: 1, repeat: -1, yoyo: true, ease: 'sine.inOut' },
				0
			);

		const NUM_CYCLES = 3;

		// --- Master timeline: walking → kneeling → bouquet → bride reaction ---
		masterTl = gsap
			.timeline({ paused: true })
			// Walking phase
			.fromTo(bodyTl, { time: 0.7 }, { time: 0.75 + NUM_CYCLES }, 0)
			.fromTo(backCycle, { time: 1.0 }, { time: 1.05 + NUM_CYCLES }, 0)
			.fromTo(frontCycle, { time: 0.5 }, { time: 0.55 + NUM_CYCLES }, 0)
			// Kneeling phase (원본 "end" 레이블)
			.to(head, { duration: 0.5, rotation: -15 }, 'end')
			.to(dudeSvgEl, { duration: 0.5, y: '+=30', ease: 'power2.inOut' }, 'end')
			.to(legs[0], { duration: 0.5, rotation: -70, ease: 'sine.inOut' }, 'end')
			.to(legBottoms[0], { duration: 0.5, rotation: 70, ease: 'sine.inOut' }, 'end')
			.to(legs[1], { duration: 0.5, rotation: 20, ease: 'sine.inOut' }, 'end')
			.to(legBottoms[1], { duration: 0.5, rotation: 50, ease: 'sine.inOut' }, 'end')
			.to(leftArm, { duration: 0.5, rotation: -60 }, 'end')
			.to(armBottoms[0], { duration: 0.5, rotation: -40 }, 'end')
			.to(rightArm, { duration: 0.5, rotation: -55 }, 'end')
			.to(armBottoms[1], { duration: 0.5, rotation: -30 }, 'end');

		// Circle joint adjustments (if elements exist)
		if (leftLegCircle) {
			masterTl
				.to(leftLegCircle, { duration: 0.5, x: -16, ease: 'sine.inOut' }, 'end')
				.to(leftLegCircle, { duration: 0.5, y: 46, ease: 'sine.inOut' }, 'end');
		}
		if (leftArmCircle) {
			masterTl.to(leftArmCircle, { duration: 0.5, x: 9, ease: 'sine.inOut' }, 'end');
		}
		if (rightArmCircle) {
			masterTl.to(rightArmCircle, { duration: 0.5, x: 20, ease: 'sine.inOut' }, 'end');
		}

		// Bouquet appears
		masterTl.to(bouquetEl, { duration: 0.5, opacity: 1 }, '+=0.1');

		// Bride reaction
		if (brideHead && leftFrontArm && leftBottomArm && leftFrontHand) {
			brideTl = gsap
				.timeline({ paused: true })
				.to(leftBottomArm, { duration: 0.2, rotation: 35 }, 0)
				.to(leftFrontArm, { duration: 0.2, rotation: 55 }, 0)
				.to(leftFrontHand, { duration: 0.2, rotation: 55 }, 0)
				.to(brideHead, { duration: 0.2, rotation: -15 }, 0);

			masterTl.fromTo(brideTl, { time: 0 }, { time: 0.2 }, 'end+=0.3');
		}
	}

	function handleWheel(e: WheelEvent) {
		if (!masterTl) return;

		const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
		if (Math.abs(delta) < 2) return;

		const newProgress = Math.max(0, Math.min(1, progress + delta / SCROLL_DISTANCE));

		if ((delta > 0 && progress < 1) || (delta < 0 && progress > 0)) {
			e.stopPropagation();
			e.preventDefault();
			progress = newProgress;
			masterTl.progress(progress);
			if (!hasInteracted) hasInteracted = true;
		}
	}

	function handleTouchStart(e: TouchEvent) {
		if (!masterTl) return;
		touchStartY = e.touches[0].clientY;
		touchStartProgress = progress;
	}

	function handleTouchMove(e: TouchEvent) {
		if (!masterTl) return;

		const deltaY = touchStartY - e.touches[0].clientY;
		const newProgress = Math.max(0, Math.min(1, touchStartProgress + deltaY / 300));

		if (newProgress !== progress) {
			e.stopPropagation();
			e.preventDefault();
			progress = newProgress;
			masterTl.progress(progress);
			if (!hasInteracted) hasInteracted = true;
		}
	}
</script>

<div>
	<!-- Animation area (이 영역에서만 스크롤 시 애니메이션 동작) -->
	<div bind:this={animAreaEl} class="anim-area relative flex items-end justify-center gap-2 py-4">
		<!-- Scroll arrow -->
		<span class="scroll-arrow absolute right-[calc(50%-120px)] top-1/2 text-sm text-muted-foreground/60">↓</span>

		<!-- Male figure -->
		<div bind:this={dudeEl} class="h-[120px] w-[80px]">
			{@html dudeSvg}
		</div>

		<!-- Bouquet (positioned at male's hands) -->
		<div bind:this={bouquetEl} class="absolute bottom-[70px] left-1/2 -translate-x-[30px]">
			{@html bouquetSvg}
		</div>

		<!-- Bride figure -->
		<div bind:this={brideEl} class="h-[120px] w-[80px]">
			{@html brideSvg}
		</div>
	</div>

	<!-- Content -->
	<div>
		{@render children()}
	</div>
</div>

<style>
	.anim-area :global([fill='#F1EBE5']) {
		fill: hsl(var(--muted));
	}
	.anim-area :global([fill='black']) {
		fill: hsl(var(--foreground));
	}
	.anim-area :global([stroke='black']) {
		stroke: hsl(var(--foreground));
	}

	.scroll-arrow {
		pointer-events: none;
		animation: arrow-bounce-down 1.2s ease-in-out infinite;
	}

	@keyframes arrow-bounce-down {
		0%,
		100% {
			transform: translateY(-50%);
		}
		50% {
			transform: translateY(calc(-50% + 4px));
		}
	}
</style>
