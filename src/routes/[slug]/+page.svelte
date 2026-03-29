<script lang="ts">
	import Highlighter from '$lib/components/Highlighter.svelte';

	export let data;
</script>

<svelte:head>
	<title>{data.meta.title}</title>
</svelte:head>

{#if data.slug === 'hawaii_travel'}
	<div class="hawaii-bg fixed inset-0 -z-10"></div>
	<div class="hawaii-clouds fixed inset-x-0 top-0 -z-[5] h-[300px] pointer-events-none"></div>
{/if}

<style>
	.hawaii-bg {
		background:
			radial-gradient(ellipse 80% 50% at 20% 20%, rgba(255,255,255,0.7) 0%, transparent 50%),
			radial-gradient(ellipse 60% 40% at 70% 15%, rgba(255,255,255,0.6) 0%, transparent 45%),
			radial-gradient(ellipse 90% 45% at 50% 30%, rgba(255,255,255,0.5) 0%, transparent 50%),
			radial-gradient(ellipse 50% 35% at 85% 25%, rgba(255,255,255,0.55) 0%, transparent 40%),
			radial-gradient(ellipse 70% 30% at 35% 10%, rgba(255,255,255,0.6) 0%, transparent 45%),
			linear-gradient(180deg, #e0f2fe 0%, #bae6fd 30%, #e0f7fa 60%, #f0f9ff 100%);
	}
	.hawaii-clouds {
		background:
			radial-gradient(ellipse 120px 80px at 10% 40%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.4) 40%, transparent 70%),
			radial-gradient(ellipse 180px 90px at 25% 30%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.3) 45%, transparent 70%),
			radial-gradient(ellipse 150px 70px at 55% 50%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.35) 40%, transparent 70%),
			radial-gradient(ellipse 200px 100px at 75% 35%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.3) 45%, transparent 70%),
			radial-gradient(ellipse 100px 60px at 90% 55%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 40%, transparent 70%),
			radial-gradient(ellipse 160px 85px at 40% 20%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 45%, transparent 70%);
		mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
		-webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
	}
</style>

<article class="mx-auto max-w-3xl px-6 py-12">
	<header class="mb-10 border-b border-border pb-8 text-center">
		<div class="mb-4 flex flex-wrap justify-center gap-2">
			{#each data.meta.categories as category}
				{@const colors: Record<string, string> = {
					'TypeScript': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
					'Book Review': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
					'etc': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
				}}
				<span class="rounded-full px-3 py-1 text-xs font-medium {colors[category] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}">
					{category}
				</span>
			{/each}
		</div>
		<h1 class="mb-3 text-4xl font-bold leading-tight tracking-tight {data.slug === 'hawaii_travel' ? 'text-gray-900' : ''}">{data.meta.title}</h1>
		<time class="text-sm {data.slug === 'hawaii_travel' ? 'text-gray-500' : 'text-muted-foreground'}">{data.meta.date}</time>
	</header>

	<Highlighter>
		<div class="prose prose-neutral {data.slug === 'hawaii_travel' ? '' : 'dark:prose-invert'} prose-headings:font-semibold prose-headings:tracking-tight prose-h2:mt-14 prose-h2:mb-14 prose-h3:mt-10 prose-h3:mb-10 prose-p:leading-[2] prose-a:text-primary prose-a:underline prose-a:underline-offset-2 prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:not-italic prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-img:rounded-lg prose-img:shadow-md prose-hr:border-border max-w-none">
			<svelte:component this={data.content} />
		</div>
	</Highlighter>
</article>
