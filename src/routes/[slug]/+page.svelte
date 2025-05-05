<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>{data.meta.title}</title>
</svelte:head>

<article>
	<hgroup>
		<h1>{data.meta.title}</h1>
		<p>Published at {data.meta.date}</p>
	</hgroup>

	<div>
		{#each data.meta.categories as category}
			<span>{category}</span>
		{/each}
	</div>

	<div class="prose dark:prose-invert">
		<svelte:component this={data.content} />
	</div>
</article>
