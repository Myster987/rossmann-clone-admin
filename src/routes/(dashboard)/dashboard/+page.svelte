<script lang="ts">
	const sectionHeaderCss = 'text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold';
</script>

<main class="p-3 pb-8">
	<section class="flex h-[20vh] items-center justify-center md:h-[30vh] lg:h-[40vh]">
		<h1 class="text-center text-5xl font-bold sm:text-6xl md:text-7xl lg:text-8xl">Witaj</h1>
	</section>

	<div class="grid gap-10 sm:gap-[5rem]">
		<section class="grid gap-2 sm:gap-6">
			<h2 class={sectionHeaderCss}>Gdzie jestem?</h2>
			<div class="flex justify-center">
				<p class="w-3/5 text-center text-xl font-medium text-muted-foreground sm:text-3xl">
					"Jesteś w panelu admina. Znajdziesz tutaj wszystko niezbędne do zarządzania swoimi
					produktami np.: lista produktów wybranych marek, tworzenie i edycja marek, zamówienia
					poszczególnych produktów i wiele więcej!"
				</p>
			</div>
		</section>

		<section class="grid justify-center gap-2 sm:gap-6">
			<h2 class={sectionHeaderCss}>Opcje nawigacji:</h2>
			<ul class="px-4 text-xl text-muted-foreground sm:text-2xl lg:text-3xl">
				<li><b>Strona główna</b> - znajdujesz się tutaj</li>
				<li>
					<b>Prodykty marki</b> - tabela z wszystkimi produktami danej marki
				</li>
				<li><b>Zamówienia</b> - lista zamówionych produktów</li>
				<li>
					<b>Ustawienia marki</b> - dostępne opcje oraz dane edytowania twoich firm
				</li>
			</ul>
		</section>

		<section class="grid justify-center gap-2 sm:gap-6">
			<h2 class={sectionHeaderCss}>Użyte technologie:</h2>
			<div>
				<ul class="text-center text-2xl font-semibold">
					<a href="https://svelte.dev/" target="_blank">
						<li class="text-[#ff3e00] underline-offset-4 hover:underline">Svelte i Sveltekit</li>
					</a>
					<a href="https://tailwindcss.com/" target="_blank">
						<li class="text-[#38bdf8] underline-offset-4 hover:underline">Tailwindcss</li>
					</a>
					<a href="https://www.shadcn-svelte.com/" target="_blank">
						<li class="underline-offset-4 hover:underline">Shadcn Svelte UI</li>
					</a>
					<a href="https://nodejs.org/" target="_blank">
						<li class="text-[#60b247] underline-offset-4 hover:underline">NodeJS</li>
					</a>
					<a href="https://hono.dev/" target="_blank">
						<li class="text-[#e36002] underline-offset-4 hover:underline">HonoJS</li>
					</a>
					<a href="https://github.com/lucia-auth" target="_blank">
						<li class="text-[#6c66ff] underline-offset-4 hover:underline">Lucia Auth</li>
					</a>
					<a href="https://orm.drizzle.team/" target="_blank">
						<li class="text-[#c5f74f] underline-offset-4 hover:underline">Drizzle ORM</li>
					</a>
					<a href="https://turso.tech/" target="_blank">
						<li class="text-[#4ff7d1] underline-offset-4 hover:underline">Turso i LibSQL</li>
					</a>
				</ul>
			</div>
		</section>
	</div>
</main>
