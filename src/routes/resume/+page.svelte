<script lang="ts">
	import { profile, resumeProjects } from '$lib/data/resume';
	import TechBadge from '$lib/components/TechBadge.svelte';
	import { ArrowUpRight } from '@lucide/svelte';
</script>

<svelte:head>
	<title>{profile.name} | {profile.title} 이력서</title>
	<meta
		name="description"
		content="{profile.name} — 카카오 프론트엔드 엔지니어. 데이터 시각화, 웹뷰 인터랙션, 실시간 스트리밍 상용 서비스 개발 이력."
	/>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 pb-24 pt-16 sm:px-6">
	<!-- Header -->
	<header class="border-b border-border pb-8">
		<p class="text-sm font-semibold tracking-widest text-primary uppercase">Resume</p>
		<h1 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{profile.name}</h1>
		<p class="mt-1 text-lg text-muted-foreground">{profile.title} · Since {profile.since}</p>

		<p class="mt-5 text-sm leading-relaxed text-foreground/90 sm:text-[15px] sm:leading-loose">
			{profile.summary}
		</p>

		<div class="mt-5 flex flex-wrap gap-2">
			{#each profile.links as link}
				<a
					href={link.url}
					target={link.url.startsWith('http') ? '_blank' : undefined}
					rel={link.url.startsWith('http') ? 'noopener noreferrer' : undefined}
					class="group inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
				>
					<span>{link.label}</span>
					<ArrowUpRight
						class="size-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px"
					/>
				</a>
			{/each}
		</div>
	</header>

	<!-- Projects -->
	<section class="mt-12">
		<h2 class="flex items-center gap-2 text-lg font-bold">
			<span class="h-4 w-1 rounded-full bg-primary"></span>
			주요 프로젝트
		</h2>

		<div class="mt-6 space-y-12">
			{#each resumeProjects as project}
				<article class="border-l-2 border-border pl-5 sm:pl-6">
					<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
						<h3 class="text-xl font-bold leading-tight">{project.name}</h3>
						<span class="shrink-0 text-sm font-medium tabular-nums text-muted-foreground">
							{project.period}
						</span>
					</div>

					<p class="mt-1.5">
						<span
							class="inline-flex rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
						>
							{project.domain}
						</span>
					</p>

					<div class="mt-3 flex flex-wrap gap-1.5">
						{#each project.tech as tech}
							<TechBadge {tech} />
						{/each}
					</div>

					<!-- 개요 -->
					<p class="mt-4 text-[11px] font-semibold uppercase tracking-wider text-primary/70">개요</p>
					<p class="mt-1.5 text-sm leading-relaxed text-foreground/90 sm:leading-loose">
						{project.overview}
					</p>

					<!-- 팀 구성 · 역할 -->
					<p class="mt-4 text-[11px] font-semibold uppercase tracking-wider text-primary/70">
						팀 구성 · 역할
					</p>
					<p class="mt-1.5 text-sm leading-relaxed text-muted-foreground">{project.team}</p>

					<!-- 주요 작업 -->
					<p class="mt-4 text-[11px] font-semibold uppercase tracking-wider text-primary/70">
						주요 작업
					</p>
					<div class="mt-2 space-y-5">
						{#each project.highlights as h}
							<div>
								<h4 class="flex gap-2 text-sm font-semibold leading-snug text-foreground">
									<span aria-hidden="true" class="text-primary">·</span>
									<span>{h.title}</span>
								</h4>
								<div class="mt-1 space-y-1 pl-[14px]">
									{#if h.problem}
										<p class="text-sm leading-relaxed text-muted-foreground">{h.problem}</p>
									{/if}
									<p class="text-sm leading-relaxed text-foreground/80">{h.work}</p>
									{#if h.result}
										<p class="flex gap-1.5 text-sm leading-relaxed">
											<span aria-hidden="true" class="font-semibold text-primary">→</span>
											<span class="text-foreground/80">{h.result}</span>
										</p>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</article>
			{/each}
		</div>
	</section>
</div>
