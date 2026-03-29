<script>
	export let src;
	export let style = '';
	export let rotate = false;

	let videoEl;
	let playing = false;

	function toggle() {
		if (playing) {
			videoEl.pause();
		} else {
			videoEl.play();
		}
		playing = !playing;
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="click-video" on:click={toggle} style={rotate ? `width: 100%; height: 650px; overflow: hidden; border-radius: 8px;` : style}>
	{#if rotate}
		<video
			bind:this={videoEl}
			{src}
			style="width: 100%; height: 100%; object-fit: cover; transform: rotate(-90deg) scale(1.5);"
			muted
			loop
			playsinline
		></video>
	{:else}
		<video
			bind:this={videoEl}
			{src}
			style="width: 100%; height: 100%; object-fit: cover; border-radius: inherit;"
			muted
			loop
			playsinline
		></video>
	{/if}
	{#if !playing}
		<div class="play-overlay">
			<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
				<circle cx="24" cy="24" r="24" fill="rgba(0,0,0,0.4)" />
				<path d="M19 14L35 24L19 34V14Z" fill="white" />
			</svg>
		</div>
	{/if}
</div>

<style>
	.click-video {
		position: relative;
		cursor: pointer;
	}
	.play-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		pointer-events: none;
	}
</style>
