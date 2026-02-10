<script lang="ts">
	import { ChevronDown, Github } from '@lucide/svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { Post } from '../../types';

	let posts: Post[] = [];
	let categorizedPosts: Record<string, Post[]> = {};

	// 카테고리 우선순위 정의
	const categoryPriority: Record<string, number> = {
		TypeScript: 1,
		'Book Review': 2,
		기타: 3
	};

	// 카테고리 정렬 함수
	const sortCategories = (categories: Record<string, Post[]>) => {
		const sortedEntries = Object.entries(categories).sort(([a], [b]) => {
			const priorityA = categoryPriority[a] || 999; // 우선순위가 없는 카테고리는 마지막
			const priorityB = categoryPriority[b] || 999;
			return priorityA - priorityB;
		});
		return Object.fromEntries(sortedEntries);
	};

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

		// 카테고리 우선순위에 따라 정렬
		categorizedPosts = sortCategories(categorizedPosts);
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
					<Sidebar.GroupLabel class="h-6">
						{#snippet child({ props })}
							<Collapsible.Trigger {...props}>
								{category}
								<ChevronDown
									class="ml-auto transition-transform duration-300 ease-in-out group-data-[state=open]/collapsible:rotate-180"
								/>
							</Collapsible.Trigger>
						{/snippet}
					</Sidebar.GroupLabel>
					<Collapsible.Content class="mt-2 overflow-hidden data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
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
	<Sidebar.Footer>
		<a
			href="https://github.com/miro-ring"
			target="_blank"
			rel="noopener noreferrer"
			class="mx-4 mb-2 flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
		>
			<Github class="size-3.5" />
		</a>
	</Sidebar.Footer>
</Sidebar.Root>
