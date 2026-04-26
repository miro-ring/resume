<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onDestroy } from 'svelte';

	let { children }: { children: Snippet } = $props();

	type State = 'idle' | 'menu' | 'ldap' | 'connected';
	type LogType = 'log' | 'error' | 'api';
	type LogEntry = { id: number; type: LogType; text: string };

	const FRAME_W = 280;
	const FRAME_H = 340;
	const BTN = 40;

	const MENU_ITEMS: { label: string; entries: { type: LogType; text: string }[] }[] = [
		{
			label: '결제수단 관리',
			entries: [
				{ type: 'log', text: 'click: 결제수단 관리' },
				{ type: 'api', text: 'GET /api/payment/methods → 200' }
			]
		},
		{
			label: '멤버십',
			entries: [
				{ type: 'log', text: 'click: 멤버십' },
				{ type: 'api', text: 'GET /api/membership → 200' }
			]
		},
		{
			label: '청구서',
			entries: [
				{ type: 'log', text: 'click: 청구서' },
				{ type: 'error', text: 'TypeError: bill.amount is undefined' }
			]
		},
		{
			label: '쿠폰함',
			entries: [
				{ type: 'log', text: 'click: 쿠폰함' },
				{ type: 'api', text: 'GET /api/coupons → 401' }
			]
		}
	];

	let state = $state<State>('idle');
	let ldap = $state('');
	let savedLdap = $state('');
	let logs = $state<LogEntry[]>([]);
	let nextLogId = 0;

	let btnX = $state(FRAME_W - BTN - 12);
	let btnY = $state(FRAME_H - BTN - 12);
	let dragging = $state(false);
	let didDrag = false;
	let pointerStart = { x: 0, y: 0 };
	let btnStart = { x: 0, y: 0 };

	function onBtnPointerDown(e: PointerEvent) {
		if (e.pointerType === 'mouse' && e.button !== 0) return;
		pointerStart = { x: e.clientX, y: e.clientY };
		btnStart = { x: btnX, y: btnY };
		didDrag = false;
		dragging = true;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		e.preventDefault();
		e.stopPropagation();
	}

	function onBtnPointerMove(e: PointerEvent) {
		if (!dragging) return;
		const dx = e.clientX - pointerStart.x;
		const dy = e.clientY - pointerStart.y;
		if (Math.abs(dx) > 4 || Math.abs(dy) > 4) didDrag = true;

		btnX = Math.max(0, Math.min(FRAME_W - BTN, btnStart.x + dx));
		btnY = Math.max(0, Math.min(FRAME_H - BTN, btnStart.y + dy));
	}

	function onBtnPointerUp() {
		if (!dragging) return;
		dragging = false;
		if (!didDrag) {
			state = state === 'menu' ? 'idle' : 'menu';
		}
	}

	function startDebugging() {
		if (savedLdap) {
			state = 'connected';
			resetLogs();
		} else {
			state = 'ldap';
		}
	}

	function confirmLdap() {
		const trimmed = ldap.trim();
		if (!trimmed) return;
		savedLdap = trimmed;
		ldap = '';
		state = 'connected';
		resetLogs();
	}

	function stopDebugging() {
		state = 'idle';
		logs = [];
	}

	function resetLdap() {
		savedLdap = '';
		ldap = '';
		state = 'ldap';
		logs = [];
	}

	function resetLogs() {
		logs = [
			{ id: nextLogId++, type: 'log', text: `connected as ${savedLdap || ldap.trim()}` }
		];
	}

	function pushEntries(entries: { type: LogType; text: string }[]) {
		if (state !== 'connected') return;
		const next = entries.map((e) => ({ id: nextLogId++, ...e }));
		logs = [...logs, ...next].slice(-6);
	}

	function onMenuItem(item: (typeof MENU_ITEMS)[number]) {
		pushEntries(item.entries);
	}

	onDestroy(() => {});

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

	const menuLeft = $derived(Math.min(Math.max(btnX, 0), FRAME_W - 160));
	const menuTop = $derived(
		btnY > FRAME_H / 2 ? Math.max(0, btnY - 110) : Math.min(FRAME_H - 110, btnY + BTN + 8)
	);
</script>

<div class="space-y-3" onkeydown={stopArrowPropagation} role="presentation">
	<div class="flex flex-row items-start justify-start gap-4">
		<div
			class="relative shrink-0 overflow-hidden rounded-[22px] border-[3px] border-foreground/70 bg-background shadow-md"
			style="width: {FRAME_W}px; height: {FRAME_H}px;"
		>
			<div class="flex h-5 items-center justify-center bg-foreground/70 text-[8px] text-background">
				webview
			</div>

			<div class="h-[calc(100%-20px)] overflow-y-auto px-3 py-3 text-xs">
				<div class="mb-3 flex items-center gap-2">
					<div class="h-5 w-5 rounded-full bg-yellow-400"></div>
					<span class="text-[11px] font-bold">카카오페이</span>
				</div>
				<p class="text-[10px] leading-relaxed text-muted-foreground">
					실서비스처럼 그려진 mock 웹뷰입니다. 라이언 버거 아이콘을 드래그해서 옮기고, 디버깅을
					연결한 뒤 메뉴 항목을 눌러 로그를 수집해보세요.
				</p>
				<div class="mt-3 space-y-1.5">
					{#each MENU_ITEMS as item}
						<button
							type="button"
							class="block w-full rounded bg-muted/40 px-2 py-1.5 text-left text-[10px] text-foreground/80 transition-colors hover:bg-muted"
							onclick={() => onMenuItem(item)}
						>
							{item.label}
						</button>
					{/each}
				</div>
			</div>

			{#if state === 'connected'}
				<div
					class="absolute right-2 top-[26px] flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold text-emerald-600"
				>
					<span class="bk-pulse inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
					디버깅 중 · {savedLdap}
				</div>
			{/if}

			<button
				type="button"
				class="absolute flex touch-none flex-col items-center justify-center gap-[2px] rounded-full border-2 border-amber-600 bg-amber-300 shadow-md transition-transform select-none active:scale-95"
				style="left: {btnX}px; top: {btnY}px; width: {BTN}px; height: {BTN}px; cursor: {dragging
					? 'grabbing'
					: 'grab'};"
				onpointerdown={onBtnPointerDown}
				onpointermove={onBtnPointerMove}
				onpointerup={onBtnPointerUp}
				onpointercancel={onBtnPointerUp}
				aria-label="버거킹 버튼"
			>
				<span class="h-[3px] w-5 rounded-full bg-amber-700"></span>
				<span class="h-[2px] w-6 rounded-full bg-emerald-600"></span>
				<span class="h-[3px] w-6 rounded-sm bg-rose-500"></span>
				<span class="h-[3px] w-5 rounded-full bg-amber-700"></span>
			</button>

			{#if state === 'menu'}
				<div
					class="absolute z-10 w-[160px] space-y-0.5 rounded-md border border-border bg-card p-1 text-xs shadow-lg"
					style="left: {menuLeft}px; top: {menuTop}px;"
				>
					<button
						type="button"
						class="w-full rounded px-2 py-1 text-left font-semibold hover:bg-muted"
						onclick={startDebugging}
					>
						{savedLdap ? '디버깅 재시작' : '디버깅 시작하기'}
					</button>
					{#if savedLdap}
						<button
							type="button"
							class="w-full rounded px-2 py-1 text-left hover:bg-muted"
							onclick={resetLdap}
						>
							LDAP ID 재입력
						</button>
					{/if}
					<button
						type="button"
						class="w-full rounded px-2 py-1 text-left text-muted-foreground hover:bg-muted"
						onclick={() => (state = 'idle')}
					>
						닫기
					</button>
				</div>
			{/if}

			{#if state === 'ldap'}
				<div
					class="absolute inset-x-0 top-5 bottom-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm"
				>
					<div class="w-[200px] space-y-2 rounded-md border border-border bg-card p-3 shadow-lg">
						<p class="text-[11px] font-semibold">LDAP ID를 입력해주세요</p>
						<input
							bind:value={ldap}
							placeholder="ldap.id"
							class="w-full rounded border border-border bg-background px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-ring"
							onkeydown={(e) => {
								if (e.key === 'Enter') confirmLdap();
							}}
						/>
						<div class="flex justify-end gap-1">
							<button
								type="button"
								class="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
								onclick={() => (state = 'idle')}
							>
								취소
							</button>
							<button
								type="button"
								class="rounded bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-40"
								onclick={confirmLdap}
								disabled={!ldap.trim()}
							>
								확인
							</button>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<div
			class="flex shrink-0 flex-col self-stretch overflow-hidden rounded-md border border-border bg-card shadow-sm"
			style="width: {FRAME_W}px; height: {FRAME_H}px;"
		>
			<div class="flex items-center justify-between border-b border-border px-3 py-1.5">
				<span class="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
					실시간 로그
				</span>
				{#if state === 'connected'}
					<button
						type="button"
						class="text-[10px] text-muted-foreground hover:text-foreground"
						onclick={stopDebugging}
					>
						중단
					</button>
				{/if}
			</div>
			<div class="flex-1 space-y-1 overflow-y-auto p-2 font-mono">
				{#if logs.length === 0}
					<p class="pt-2 text-center text-[10px] text-muted-foreground/60">
						디버깅을 시작하면 로그가 여기에 표시됩니다.
					</p>
				{:else}
					{#each logs as entry (entry.id)}
						<div class="flex gap-1.5 text-[10px]">
							<span
								class="rounded px-1 text-[9px] font-bold {entry.type === 'error'
									? 'bg-rose-500/20 text-rose-600'
									: entry.type === 'api'
										? 'bg-sky-500/20 text-sky-600'
										: 'bg-muted text-muted-foreground'}"
							>
								{entry.type}
							</span>
							<span class="text-foreground/80">{entry.text}</span>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>

	<div class="pt-1" style="width: {FRAME_W * 2 + 16}px;">
		{@render children()}
	</div>
</div>

<style>
	.bk-pulse {
		animation: bk-pulse 1.4s ease-in-out infinite;
	}
	@keyframes bk-pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.3;
		}
	}
</style>
