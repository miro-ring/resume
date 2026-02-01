<script lang="ts">
	import Highlighter from '$lib/components/Highlighter.svelte';

	export let data;
</script>

<svelte:head>
	<title>{data.meta.title}</title>
</svelte:head>

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
		<h1 class="mb-3 text-4xl font-bold leading-tight tracking-tight">{data.meta.title}</h1>
		<time class="text-sm text-muted-foreground">{data.meta.date}</time>
	</header>

	<Highlighter>
		<div class="prose prose-neutral dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-h2:mt-14 prose-h2:mb-14 prose-h3:mt-10 prose-h3:mb-10 prose-p:leading-[2] prose-a:text-primary prose-a:underline prose-a:underline-offset-2 prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:not-italic prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-img:rounded-lg prose-img:shadow-md prose-hr:border-border max-w-none">
			<svelte:component this={data.content} />
		</div>
	</Highlighter>
</article>
