export type Post = {
	title?: string;
	date: string;
	description: string;
	published?: boolean;
	slug?: string;
	categories: string[];
};

export type Project = {
	name: string;
	period: {
		start: string; // "2024-03" format
		end: string | 'present'; // "2025-01" or "present"
	};
	description: string[]; // List of main tasks/achievements
	techStack?: string[]; // ["React", "TypeScript", "Tailwind CSS"]
};
