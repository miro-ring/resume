<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>{data.meta.title}</title>
</svelte:head>

<article class="mx-auto max-w-4xl px-4 py-8">
	<hgroup>
		<h1 class="mb-2 text-3xl font-bold">{data.meta.title}</h1>
		<p class="text-gray-600 dark:text-gray-400">Published at {data.meta.date}</p>
	</hgroup>

	<div class="my-4 flex gap-2">
		{#each data.meta.categories as category}
			<span class="rounded bg-gray-200 px-2 py-1 text-sm dark:bg-gray-700">{category}</span>
		{/each}
	</div>

	<div class="prose dark:prose-invert">
		<svelte:component this={data.content} />
	</div>
</article>
