<script lang="ts">
	let { src, alt = '', width = 200 }: { src: string; alt?: string; width?: number } = $props();

</script>

<div class="book-container" style="perspective: 600px;">
	<div class="book" style="width: {width}px;">
		<img {src} {alt} style="width: {width}px;" draggable="false" />
	</div>
</div>

<style>
	.book-container {
		display: flex;
		justify-content: center;
		margin: 2rem 0;
	}

	.book {
		position: relative;
		transform-style: preserve-3d;
		transform: rotateY(-20deg);
		transition: transform 0.4s ease;
	}

	.book:hover {
		transform: rotateY(0deg);
	}

	.book img {
		display: block;
		border-radius: 2px;
		box-shadow: 6px 6px 18px rgba(0, 0, 0, 0.3);
	}

</style>
