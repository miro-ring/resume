<script lang="ts">
	import { Home, Inbox, Calendar, Search, Settings, ChevronDown } from '@lucide/svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';

	// 메뉴 아이템
	const items = [
		{
			title: '홈',
			url: '/',
			icon: Home
		},
		{
			title: '받은편지함',
			url: '/inbox',
			icon: Inbox
		},
		{
			title: '캘린더',
			url: '/calendar',
			icon: Calendar
		},
		{
			title: '검색',
			url: '/search',
			icon: Search
		},
		{
			title: '설정',
			url: '/settings',
			icon: Settings
		}
	];
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
							Help
							<ChevronDown
								class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
							/>
						</Collapsible.Trigger>
					{/snippet}
				</Sidebar.GroupLabel>
				<Collapsible.Content>
					<Sidebar.GroupContent>
						<Sidebar.Menu>
							{#each items as item (item.title)}
								<Sidebar.MenuItem>
									<Sidebar.MenuButton>
										{#snippet child({ props })}
											<a href={item.url} {...props}>
												<svelte:component this={item.icon} />
												<span>{item.title}</span>
											</a>
										{/snippet}
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
