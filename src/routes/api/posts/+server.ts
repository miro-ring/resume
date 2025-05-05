import { json } from '@sveltejs/kit';
import type { Post } from '../../../types';

const getPosts = async () => {
	const posts: Post[] = [];

	const paths = import.meta.glob('/src/posts/*.svx', { eager: true });

	for (const path in paths) {
		const file = paths[path];
		const slug = path.split('/').at(-1)?.replace('.svx', '');

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>;
			const post = { ...metadata, slug } satisfies Post;
			if (post.published) posts.push(post);
		}
	}

	return posts.sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	);
};

export const GET = async () => {
	const posts = await getPosts();
	return json(posts);
};
