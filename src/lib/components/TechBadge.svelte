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
		Markdown: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
		MongoDB: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200',
		Docker: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
		WebSocket: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
		Swiper: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
		GSAP: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
		Recharts: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
		'Next.js': 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
		Rust: 'bg-orange-200 text-orange-900 dark:bg-orange-900/40 dark:text-orange-200',
		Tauri: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
		Kubernetes: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
		Playwright: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
		Vitest: 'bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-300',
		MSW: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
		'React Query': 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
		'React Router': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
		'React Hook Form': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
		Zustand: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
		Homebrew: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
	};

	const colorClass =
		colors[tech] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
</script>

<span class="rounded-full px-3 py-1 text-xs font-medium {colorClass}">
	{tech}
</span>
