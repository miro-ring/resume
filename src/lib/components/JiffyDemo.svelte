<script lang="ts">
	import type { Snippet } from 'svelte';

	type Status = 'todo' | 'inProgress' | 'resolved';
	type IssueType = 'Task' | 'Bug' | 'Story' | 'Epic';
	type Ticket = {
		key: string;
		summary: string;
		type: IssueType;
		storyPoint?: string;
	};

	let { children }: { children: Snippet } = $props();

	const STATUSES: Status[] = ['todo', 'inProgress', 'resolved'];
	const STATUS_LABEL: Record<Status, string> = {
		todo: 'To Do',
		inProgress: 'In Progress',
		resolved: 'Resolved'
	};
	const TYPES: IssueType[] = ['Task', 'Bug', 'Story', 'Epic'];

	const TYPE_STYLE: Record<IssueType, string> = {
		Task: 'bg-sky-500',
		Bug: 'bg-rose-500',
		Story: 'bg-emerald-500',
		Epic: 'bg-violet-500'
	};

	let summary = $state('');
	let storyPoint = $state('');
	let issueType = $state<IssueType>('Task');
	let counter = $state(2);
	let tickets = $state<Record<Status, Ticket[]>>({
		todo: [
			{
				key: 'JIFFY-1',
				summary: '카드를 드래그해 상태를 바꿔보세요',
				type: 'Task',
				storyPoint: '2'
			}
		],
		inProgress: [
			{ key: 'JIFFY-2', summary: 'Jiffy 데모 만들기', type: 'Story', storyPoint: '3' }
		],
		resolved: []
	});

	let toast = $state<string | null>(null);
	let toastTimer: ReturnType<typeof setTimeout> | null = null;
	let hasInteracted = $state(false);

	let dragging = $state<{ key: string; from: Status } | null>(null);
	let dragOver = $state<Status | null>(null);
	let ghostX = $state(0);
	let ghostY = $state(0);
	let offsetX = 0;
	let offsetY = 0;
	let cardWidth = $state(0);
	const columnEls: Record<Status, HTMLDivElement | undefined> = {
		todo: undefined,
		inProgress: undefined,
		resolved: undefined
	};

	function findArea(key: string): Status | null {
		for (const s of STATUSES) {
			if (tickets[s].some((t) => t.key === key)) return s;
		}
		return null;
	}

	function createTicket(e: SubmitEvent) {
		e.preventDefault();
		const trimmed = summary.trim();
		if (!trimmed) return;
		counter += 1;
		const key = `JIFFY-${counter}`;
		tickets.todo = [
			...tickets.todo,
			{ key, summary: trimmed, type: issueType, storyPoint: storyPoint.trim() }
		];
		summary = '';
		storyPoint = '';
		hasInteracted = true;

		toast = `${key} 생성 완료`;
		if (toastTimer) clearTimeout(toastTimer);
		toastTimer = setTimeout(() => {
			toast = null;
		}, 1600);
	}

	function startDrag(e: PointerEvent, ticket: Ticket) {
		if (e.pointerType === 'mouse' && e.button !== 0) return;

		const target = e.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		offsetX = e.clientX - rect.left;
		offsetY = e.clientY - rect.top;
		cardWidth = rect.width;
		ghostX = rect.left;
		ghostY = rect.top;

		const from = findArea(ticket.key);
		if (!from) return;

		dragging = { key: ticket.key, from };
		dragOver = from;
		hasInteracted = true;
		target.setPointerCapture(e.pointerId);
		e.preventDefault();
	}

	function moveDrag(e: PointerEvent) {
		if (!dragging) return;
		e.preventDefault();
		ghostX = e.clientX - offsetX;
		ghostY = e.clientY - offsetY;

		let next: Status | null = null;
		for (const s of STATUSES) {
			const el = columnEls[s];
			if (!el) continue;
			const r = el.getBoundingClientRect();
			if (
				e.clientX >= r.left &&
				e.clientX <= r.right &&
				e.clientY >= r.top &&
				e.clientY <= r.bottom
			) {
				next = s;
				break;
			}
		}
		dragOver = next;
	}

	function endDrag(e: PointerEvent) {
		if (!dragging) return;
		e.preventDefault();
		const { key, from } = dragging;
		const to = dragOver;

		if (to && to !== from) {
			const ticket = tickets[from].find((t) => t.key === key);
			if (ticket) {
				tickets[from] = tickets[from].filter((t) => t.key !== key);
				tickets[to] = [...tickets[to], ticket];
			}
		}

		dragging = null;
		dragOver = null;
	}

	function portal(node: HTMLElement) {
		document.body.appendChild(node);
		return {
			destroy() {
				if (node.parentNode) node.parentNode.removeChild(node);
			}
		};
	}

	function stopArrowPropagation(e: KeyboardEvent) {
		if (
			e.key === 'ArrowLeft' ||
			e.key === 'ArrowRight' ||
			e.key === 'ArrowUp' ||
			e.key === 'ArrowDown'
		) {
			e.stopPropagation();
		}
	}
</script>

<div class="space-y-3" onkeydown={stopArrowPropagation} role="presentation">
	<!-- Ticket creation form -->
	<form
		onsubmit={createTicket}
		class="space-y-2 rounded-md border border-border bg-card p-3 shadow-sm"
	>
		<div class="flex items-center gap-2">
			<span
				class="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase"
			>
				새 티켓
			</span>
		</div>
		<div class="flex flex-wrap gap-1.5">
			<select
				bind:value={issueType}
				class="rounded border border-border bg-background px-1.5 py-1 text-xs outline-none focus:ring-1 focus:ring-ring"
			>
				{#each TYPES as t}
					<option value={t}>{t}</option>
				{/each}
			</select>
			<input
				bind:value={summary}
				placeholder="제목을 입력해주세요."
				class="min-w-0 flex-1 rounded border border-border bg-background px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-ring"
			/>
			<input
				bind:value={storyPoint}
				placeholder="SP"
				type="number"
				min="0"
				class="w-12 rounded border border-border bg-background px-1 py-1 text-center text-xs outline-none focus:ring-1 focus:ring-ring"
			/>
			<button
				type="submit"
				class="rounded bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
				disabled={!summary.trim()}
			>
				만들기
			</button>
		</div>
		<p
			class="min-h-[14px] text-[10px] transition-opacity"
			class:opacity-0={!toast}
			class:text-emerald-500={toast}
		>
			{toast ?? '​'}
		</p>
	</form>

	<!-- System tray board -->
	<div class="relative">
		<div
			class="absolute -top-1.5 right-6 h-3 w-3 rotate-45 border-l border-t border-border bg-card"
			aria-hidden="true"
		></div>

		<div class="rounded-md border border-border bg-card shadow-md">
			<div class="flex items-center justify-between border-b border-border px-3 py-1.5">
				<span class="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
					Jiffy
				</span>
				<span class="text-[10px] text-muted-foreground/60">시스템 트레이</span>
			</div>

			<div class="grid grid-cols-3 gap-1.5 p-2">
				{#each STATUSES as status}
					<div
						bind:this={columnEls[status]}
						class="flex min-h-[140px] flex-col rounded border bg-background/50 transition-colors {dragging &&
						dragOver === status
							? 'border-primary bg-primary/5'
							: 'border-border'}"
					>
						<div
							class="border-b border-border px-1.5 py-1 text-center text-[10px] font-bold text-foreground/80"
						>
							{STATUS_LABEL[status]}
						</div>
						<div class="flex flex-1 flex-col gap-1.5 p-1.5">
							{#each tickets[status] as ticket (ticket.key)}
								<div
									role="button"
									tabindex="0"
									onpointerdown={(e) => startDrag(e, ticket)}
									onpointermove={moveDrag}
									onpointerup={endDrag}
									onpointercancel={endDrag}
									class="touch-none rounded border border-border bg-card p-1.5 shadow-sm select-none"
									class:invisible={dragging?.key === ticket.key}
									style="cursor: {dragging?.key === ticket.key ? 'grabbing' : 'grab'};"
								>
									<div
										class="flex items-center gap-1 text-[9px] font-bold text-muted-foreground"
									>
										<span class="inline-block h-2 w-2 rounded-sm {TYPE_STYLE[ticket.type]}"
										></span>
										<span>{ticket.key}</span>
										{#if ticket.storyPoint}
											<span
												class="ml-auto rounded-full bg-muted px-1.5 text-[9px] text-muted-foreground"
											>
												{ticket.storyPoint}
											</span>
										{/if}
									</div>
									<div
										class="mt-1 line-clamp-2 text-[10px] leading-snug font-semibold text-foreground"
									>
										{ticket.summary}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<p
			class="mt-2 text-center text-[10px] text-muted-foreground/60 transition-opacity"
			class:opacity-0={hasInteracted}
		>
			↑ 티켓을 만들고, 카드를 드래그해 상태를 바꿔보세요
		</p>
	</div>

	<!-- Drag ghost -->
	{#if dragging}
		{@const ghost = tickets[dragging.from].find((t) => t.key === dragging?.key)}
		{#if ghost}
			<div
				use:portal
				class="pointer-events-none fixed z-50 rounded border border-border bg-card p-1.5 shadow-lg"
				style="left: {ghostX}px; top: {ghostY}px; width: {cardWidth}px;"
			>
				<div class="flex items-center gap-1 text-[9px] font-bold text-muted-foreground">
					<span class="inline-block h-2 w-2 rounded-sm {TYPE_STYLE[ghost.type]}"></span>
					<span>{ghost.key}</span>
					{#if ghost.storyPoint}
						<span class="ml-auto rounded-full bg-muted px-1.5 text-[9px] text-muted-foreground">
							{ghost.storyPoint}
						</span>
					{/if}
				</div>
				<div
					class="mt-1 line-clamp-2 text-[10px] leading-snug font-semibold text-foreground"
				>
					{ghost.summary}
				</div>
			</div>
		{/if}
	{/if}

	<div class="pt-1">
		{@render children()}
	</div>
</div>
