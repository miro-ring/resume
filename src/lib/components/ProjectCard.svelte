<script lang="ts">
	import type { Project } from '../../types';
	import TechBadge from './TechBadge.svelte';
	import { onMount } from 'svelte';

	let { project, index }: { project: Project; index: number } = $props();

	let visible = $state(false);

	onMount(() => {
		// Trigger animation after a delay based on index
		setTimeout(() => {
			visible = true;
		}, index * 100);
	});

	const formatPeriod = () => {
		const { start, end } = project.period;
		const endText = end === 'present' ? '현재' : end;
		return `${start} - ${endText}`;
	};
</script>

<article class="project-card space-y-4 py-8" class:visible>
	<div class="space-y-2">
		<h3 class="text-2xl font-bold">{project.name}</h3>
		<p class="text-sm text-muted-foreground">{formatPeriod()}</p>
	</div>

	<div class="space-y-2 text-foreground">
		{#each project.description as item}
			<p class="leading-loose">{item}</p>
		{/each}
	</div>

	<div class="flex flex-wrap gap-2 pt-2">
		{#each project.techStack as tech}
			<TechBadge {tech} />
		{/each}
	</div>
</article>

<style>
	.project-card {
		opacity: 0;
		transition: opacity 0.6s ease-out;
	}

	.project-card.visible {
		opacity: 1;
	}

	@media (prefers-reduced-motion: reduce) {
		.project-card {
			opacity: 1;
			transition: none;
		}
	}
</style>
