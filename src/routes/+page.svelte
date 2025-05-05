<script lang="ts">
	export let data;
</script>

<svelte:head>실제 제목</svelte:head>
<div class="space-y-4 pl-8 pt-4">
	<h1 class="text-3xl font-bold">내 소개</h1>
	<p>장동균입니다.</p>
	<p>FE 개발자 입니다.</p>
</div>

<section>
	<ul>
		{#each data.posts as post}
			<li>
				<a href={`/posts/${post.slug}`}>{post.title}</a>
				<p>{post.date}</p>
				<p>{post.description}</p>
			</li>
		{/each}
	</ul>
</section>
