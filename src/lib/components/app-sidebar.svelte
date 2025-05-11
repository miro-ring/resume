<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { Post } from '../../types';

	let posts: Post[] = [];

	onMount(async () => {
		const res = await fetch('/api/posts');
		const data = await res.json();
		posts = data.filter((post: Post) => post.published); // 필요시 published 필터
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
		<Collapsible.Root class="group/collapsible">
			<Sidebar.Group>
				<Sidebar.GroupLabel>
					{#snippet child({ props })}
						<Collapsible.Trigger {...props}>
							TypeScript
							<ChevronDown
								class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
							/>
						</Collapsible.Trigger>
					{/snippet}
				</Sidebar.GroupLabel>
				<Collapsible.Content>
					<Sidebar.GroupContent>
						<Sidebar.Menu>
							{#each posts as post}
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
	</Sidebar.Content>
</Sidebar.Root>
