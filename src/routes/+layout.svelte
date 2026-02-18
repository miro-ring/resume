<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import ModeSwitcher from '$lib/components/mode-switcher.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';

	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<main class="relative ml-0 w-full p-2 transition-all duration-300 sm:p-4 md:data-[sidebar-open=true]:ml-64">
		<div class="absolute left-2 top-2 z-20 flex items-center gap-2 sm:left-4 sm:top-4">
			<Sidebar.Trigger />
			<ModeSwitcher />
		</div>
		<ModeWatcher defaultMode="light" />
		{@render children?.()}
	</main>
</Sidebar.Provider>
