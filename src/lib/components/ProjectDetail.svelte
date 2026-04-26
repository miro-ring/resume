<script lang="ts">
	import type { Project } from '../../types';
	import TechBadge from './TechBadge.svelte';
	import PullToRefreshDemo from './PullToRefreshDemo.svelte';
	import WalkingDudeDemo from './WalkingDudeDemo.svelte';
	import JiffyDemo from './JiffyDemo.svelte';
	import BuggerkingDemo from './BuggerkingDemo.svelte';

	let { project }: { project: Project } = $props();

	const formatPeriod = (p: Project['period']) => {
		const endText = p.end === 'present' ? '현재' : p.end;
		return `${p.start} - ${endText}`;
	};

	const isPTRProject = $derived(project.name === '카카오 전자문서 Pull To Refresh 개발');
	const isWeddingProject = $derived(project.name === '모바일 청첩장 제작');
	const isJiffyProject = $derived(project.name === '카카오 Jira 관리 도구 (Jiffy) 개발');
	const isBuggerkingProject = $derived(project.name === '카카오 웹뷰 디버거 (버거킹) 개발');
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

<!-- max-w-2xl max-w-lg (keep both literal so Tailwind picks them up) -->
<div
	class={[
		'w-full space-y-4 sm:space-y-5',
		isBuggerkingProject ? 'max-w-2xl' : 'max-w-lg',
		isBuggerkingProject ? '-mt-[5vh] sm:-mt-[10vh]' : ''
	].join(' ')}
>
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
	{:else if isWeddingProject}
		<WalkingDudeDemo>
			{@render description()}
		</WalkingDudeDemo>
	{:else if isJiffyProject}
		<JiffyDemo>
			{@render description()}
		</JiffyDemo>
	{:else if isBuggerkingProject}
		<BuggerkingDemo>
			{@render description()}
		</BuggerkingDemo>
	{:else}
		{@render description()}
	{/if}
</div>
