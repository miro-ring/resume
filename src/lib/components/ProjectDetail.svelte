<script lang="ts">
	import type { Project } from '../../types';
	import TechBadge from './TechBadge.svelte';

	let { project }: { project: Project } = $props();

	const formatPeriod = (p: Project['period']) => {
		const endText = p.end === 'present' ? '현재' : p.end;
		return `${p.start} - ${endText}`;
	};
</script>

<div class="w-full max-w-lg space-y-5">
	<div class="space-y-1">
		<p class="text-xs font-semibold tracking-wider text-primary uppercase">
			{formatPeriod(project.period)}
		</p>
		<h3 class="text-2xl font-bold leading-tight">{project.name}</h3>
	</div>

	<div class="space-y-2 text-[15px] leading-loose text-muted-foreground">
		{#each project.description as item}
			<p>{item}</p>
		{/each}
	</div>

	{#if project.techStack?.length}
		<div class="flex flex-wrap gap-2 pt-1">
			{#each project.techStack as tech}
				<TechBadge {tech} />
			{/each}
		</div>
	{/if}
</div>
