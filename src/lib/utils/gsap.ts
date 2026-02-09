import type { gsap as GsapType } from 'gsap';

let gsapInstance: typeof GsapType | null = null;

export async function getGsap(): Promise<typeof GsapType> {
	if (gsapInstance) return gsapInstance;
	const { gsap } = await import('gsap');
	gsapInstance = gsap;
	return gsap;
}
