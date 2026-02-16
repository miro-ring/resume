<script lang="ts">
	import type { Project } from '../../types';
	import TechBadge from './TechBadge.svelte';
	import PullToRefreshDemo from './PullToRefreshDemo.svelte';

	let { project }: { project: Project } = $props();

	const formatPeriod = (p: Project['period']) => {
		const endText = p.end === 'present' ? '현재' : p.end;
		return `${p.start} - ${endText}`;
	};

	const isPTRProject = $derived(project.name === '카카오 전자문서 Pull To Refresh 개발');
</script>

{#snippet description()}
	<div
		class="space-y-2 text-sm leading-relaxed text-muted-foreground sm:text-[15px] sm:leading-loose"
	>
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
{/snippet}

<div class="w-full max-w-lg space-y-4 sm:space-y-5">
	<div class="space-y-1">
		<p class="text-xs font-semibold tracking-wider text-primary uppercase">
			{formatPeriod(project.period)}
		</p>
		<h3 class="text-xl font-bold leading-tight sm:text-2xl">{project.name}</h3>
	</div>

	{#if isPTRProject}
		<PullToRefreshDemo>
			{@render description()}
		</PullToRefreshDemo>
	{:else}
		{@render description()}
	{/if}
</div>
