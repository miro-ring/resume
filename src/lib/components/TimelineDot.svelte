<script lang="ts">
	import type { Project } from '../../types';
	import { onMount } from 'svelte';
	import { getGsap } from '$lib/utils/gsap';

	let {
		project,
		isActive,
		onclick,
		textAbove = false
	}: { project: Project; isActive: boolean; onclick: () => void; textAbove?: boolean } = $props();

	let dotEl: HTMLButtonElement;

	const formatPeriod = (p: Project['period']) => {
		const endText = p.end === 'present' ? '현재' : p.end;
		return `${p.start} - ${endText}`;
	};

	onMount(() => {
		let gsap: Awaited<ReturnType<typeof getGsap>>;
		getGsap().then((g) => (gsap = g));

		$effect(() => {
			if (!gsap || !dotEl) return;
			const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
			if (prefersReduced) return;

			gsap.to(dotEl, {
				scale: isActive ? 1.4 : 1,
				duration: 0.3,
				ease: 'back.out(1.7)'
			});
		});
	});
</script>

<button
	bind:this={dotEl}
	{onclick}
	class="group flex shrink-0 flex-col items-center gap-1"
	class:flex-col-reverse={textAbove}
	aria-current={isActive ? 'step' : undefined}
>
	<span
		class="relative z-10 block h-4 w-4 rounded-full border-2 transition-colors {!textAbove ? 'mt-1' : ''}
		{isActive
			? 'border-primary bg-primary'
			: 'border-muted-foreground/50 bg-background group-hover:border-primary/70'}"
	></span>
	<span class="text-xs font-medium whitespace-nowrap {isActive ? 'text-primary' : 'text-muted-foreground'}">
		{project.name}
	</span>
	<span class="text-[10px] whitespace-nowrap {isActive ? 'text-foreground' : 'text-muted-foreground/70'}">
		{formatPeriod(project.period)}
	</span>
</button>
