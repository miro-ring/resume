<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { Post } from '../../types';

	let posts: Post[] = [];
	let categorizedPosts: Record<string, Post[]> = {};

	onMount(async () => {
		const res = await fetch('/api/posts');
		const data = await res.json();
		posts = data.filter((post: Post) => post.published);

		// 카테고리별로 포스트 그룹화
		categorizedPosts = posts.reduce(
			(acc, post) => {
				const category = post.categories[0] || '기타';
				if (!acc[category]) {
					acc[category] = [];
				}
				acc[category].push(post);
				return acc;
			},
			{} as Record<string, Post[]>
		);
	});

	const openPost = (slug: string) => {
		goto(`/${slug}`);
	};
</script>

<Sidebar.Root>
	<Sidebar.Header>
		<div class="flex items-center p-4">
			<h2 class="text-xl font-bold">장동균 블로그</h2>
		</div>
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						<a href="/">
							<span>내소개</span>
						</a></Sidebar.MenuButton
					>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Group>

		{#each Object.entries(categorizedPosts) as [category, categoryPosts]}
			<Collapsible.Root class="group/collapsible">
				<Sidebar.Group>
					<Sidebar.GroupLabel>
						{#snippet child({ props })}
							<Collapsible.Trigger {...props}>
								{category}
								<ChevronDown
									class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
								/>
							</Collapsible.Trigger>
						{/snippet}
					</Sidebar.GroupLabel>
					<Collapsible.Content>
						<Sidebar.GroupContent>
							<Sidebar.Menu>
								{#each categoryPosts as post}
									<Sidebar.MenuItem>
										<Sidebar.MenuButton size="sm" class="ml-1">
											<button
												class="w-full text-left hover:underline"
												on:click={() => openPost(post.slug || '')}
											>
												{post.title}
											</button>
										</Sidebar.MenuButton>
									</Sidebar.MenuItem>
								{/each}
							</Sidebar.Menu>
						</Sidebar.GroupContent>
					</Collapsible.Content>
				</Sidebar.Group>
			</Collapsible.Root>
		{/each}
	</Sidebar.Content>
</Sidebar.Root>
