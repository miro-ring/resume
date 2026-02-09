<script lang="ts">
	let { tech }: { tech: string } = $props();

	const colors: Record<string, string> = {
		React: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
		Vue: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
		Svelte: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
		SvelteKit: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
		TypeScript: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
		JavaScript: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
		'Tailwind CSS': 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
		'Node.js': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
		'Chart.js': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
		Vite: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
		Markdown: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
	};

	const colorClass =
		colors[tech] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
</script>

<span class="rounded-full px-3 py-1 text-xs font-medium {colorClass}">
	{tech}
</span>
