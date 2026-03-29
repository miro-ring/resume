import { error } from '@sveltejs/kit';

export const prerender = false;

export const load = async ({ params }) => {
	try {
		const post = await import(`../../posts/${params.slug}.svx`);

		return {
			content: post.default,
			meta: post.metadata,
			slug: params.slug
		};
	} catch (e) {
		console.error(e);
		throw error(404, `Could not find ${params.slug}`);
	}
};
