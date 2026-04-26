<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();

	const FRAME_W = 280;
	const FRAME_H = 460;
	const KB_H = 170;

	const KB_ROWS = [
		['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'],
		['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'],
		['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ']
	];

	let value = $state('');
	let isKbOpen = $state(false);
	let toast = $state<string | null>(null);
	let toastTimer: ReturnType<typeof setTimeout> | null = null;
	let inputBtnEl: HTMLButtonElement;
	let keyboardEl: HTMLDivElement;

	function onFramePointerDown(e: PointerEvent) {
		if (!isKbOpen) return;
		const target = e.target as Node;
		if (inputBtnEl?.contains(target)) return;
		if (keyboardEl?.contains(target)) return;
		closeKb();
	}

	function openKb() {
		isKbOpen = true;
	}

	function closeKb() {
		isKbOpen = false;
	}

	function press(k: string) {
		if (value.length >= 8) return;
		value = value + k;
	}

	function backspace() {
		value = value.slice(0, -1);
	}

	function onSubmit() {
		if (!value.trim()) return;
		closeKb();
		toast = `${value} 님으로 발급을 진행합니다.`;
		if (toastTimer) clearTimeout(toastTimer);
		toastTimer = setTimeout(() => {
			toast = null;
		}, 2200);
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

<div
	class="flex flex-row items-start justify-start gap-8"
	onkeydown={stopArrowPropagation}
	role="presentation"
>
	<div
		class="relative shrink-0 overflow-hidden rounded-[22px] border-[3px] border-foreground/70 bg-background shadow-md"
		style="width: {FRAME_W}px; height: {FRAME_H}px;"
		onpointerdown={onFramePointerDown}
	>
			<div class="flex h-5 items-center justify-center bg-foreground/70 text-[8px] text-background">
				전자증명서
			</div>

			<div class="px-4 pt-4 pb-2">
				<h3 class="text-[13px] font-bold">증명서 발급 정보</h3>
				<p class="mt-1 text-[10px] text-muted-foreground">발급받을 분의 이름을 입력해주세요.</p>

				<button
					type="button"
					bind:this={inputBtnEl}
					onclick={openKb}
					class="mt-3 w-full rounded-md border border-border bg-card px-3 py-2.5 text-left text-xs transition-colors hover:bg-muted/40 {isKbOpen
						? 'border-primary ring-1 ring-primary/40'
						: ''}"
				>
					{#if value}
						<span class="text-foreground">{value}</span>
					{:else}
						<span class="text-muted-foreground/60">예) 홍길동</span>
					{/if}
				</button>

				<div class="mt-4 space-y-1.5">
					<p class="text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
						안내
					</p>
					<p class="text-[10px] leading-relaxed text-muted-foreground">
						입력 필드를 누르면 키보드가 올라옵니다. 화면 하단 '다음' 버튼이 키보드 위로 자연스럽게
						밀려 올라가는 동작을 확인해보세요.
					</p>
				</div>
			</div>

			<div
				class="absolute inset-x-0 px-3 pb-3 transition-all duration-300 ease-out"
				style="bottom: {isKbOpen ? KB_H : 0}px;"
			>
				<button
					type="button"
					disabled={!value.trim()}
					onclick={onSubmit}
					class="w-full rounded-md bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
				>
					다음
				</button>
			</div>

			{#if toast}
				<div
					class="absolute left-1/2 top-10 z-30 -translate-x-1/2 rounded-md bg-foreground/90 px-3 py-1.5 text-[10px] font-semibold text-background shadow-lg"
				>
					{toast}
				</div>
			{/if}

			<div
				bind:this={keyboardEl}
				class="absolute inset-x-0 bottom-0 border-t border-border bg-stone-200/90 backdrop-blur-sm transition-transform duration-300 ease-out dark:bg-stone-700/80"
				style="height: {KB_H}px; transform: translateY({isKbOpen ? '0' : '100%'});"
			>
				<div class="flex flex-col gap-[5px] px-1.5 pt-1.5 pb-1">
					{#each KB_ROWS as row}
						<div class="flex justify-center gap-[3px]">
							{#each row as k}
								<button
									type="button"
									class="h-7 flex-1 rounded bg-card text-[11px] font-semibold text-foreground shadow-sm active:bg-muted"
									onclick={() => press(k)}
								>
									{k}
								</button>
							{/each}
						</div>
					{/each}
					<div class="flex gap-[3px]">
						<button
							type="button"
							class="h-7 w-12 rounded bg-card/70 text-[10px] font-semibold text-foreground/80 shadow-sm active:bg-muted"
							onclick={backspace}
						>
							⌫
						</button>
						<button
							type="button"
							class="h-7 flex-1 rounded bg-card text-[10px] text-foreground shadow-sm active:bg-muted"
							onclick={() => press(' ')}
						>
							space
						</button>
						<button
							type="button"
							class="h-7 w-12 rounded bg-primary text-[10px] font-semibold text-primary-foreground active:opacity-90"
							onclick={closeKb}
						>
							완료
						</button>
					</div>
				</div>
			</div>
		</div>

	<div class="min-w-0 flex-1 pt-2">
		{@render children()}
	</div>
</div>
