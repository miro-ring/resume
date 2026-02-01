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
	<main class="ml-0 w-full p-4 transition-all duration-300 data-[sidebar-open=true]:ml-64">
		<Sidebar.Trigger class="mb-4" />
		<ModeSwitcher />
		<ModeWatcher defaultMode="light" />
		{@render children?.()}
	</main>
</Sidebar.Provider>
