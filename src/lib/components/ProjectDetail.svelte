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

	<ul class="space-y-2 text-[15px] leading-relaxed text-muted-foreground">
		{#each project.description as item}
			<li class="flex items-baseline gap-2">
				<span class="block h-1.5 w-1.5 shrink-0 translate-y-[-1px] rounded-full bg-primary/50"></span>
				<span>{item}</span>
			</li>
		{/each}
	</ul>

	{#if project.techStack?.length}
		<div class="flex flex-wrap gap-2 pt-1">
			{#each project.techStack as tech}
				<TechBadge {tech} />
			{/each}
		</div>
	{/if}
</div>
