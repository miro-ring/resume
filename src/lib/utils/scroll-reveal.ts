interface ScrollRevealOptions {
	threshold?: number;
	rootMargin?: string;
	delay?: number;
}

export function createScrollReveal(
	element: HTMLElement,
	options: ScrollRevealOptions = {}
): () => void {
	const { threshold = 0.1, rootMargin = '0px', delay = 0 } = options;

	// Check for reduced motion preference
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (prefersReducedMotion) {
		element.classList.add('scroll-reveal-visible');
		return () => {};
	}

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setTimeout(() => {
						element.classList.add('scroll-reveal-visible');
						// Cleanup observer after animation
						observer.unobserve(element);
					}, delay);
				}
			});
		},
		{ threshold, rootMargin }
	);

	// Check if element is already in viewport
	const rect = element.getBoundingClientRect();
	const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;

	if (isInViewport) {
		// If already in viewport, trigger animation immediately
		setTimeout(() => {
			element.classList.add('scroll-reveal-visible');
		}, delay);
	} else {
		// Otherwise, observe for intersection
		observer.observe(element);
	}

	// Return cleanup function
	return () => {
		observer.disconnect();
	};
}
