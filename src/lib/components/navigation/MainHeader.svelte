<script lang="ts">
	import { GithubLink, ThemeButton, ProfileDropdownMenu, SelectCompany } from '@/components/custom';
	import { Button } from '@/components/ui/button';
	import { selectedCompany } from '@/stores';
</script>

<header
	class="sticky top-0 z-50 hidden w-full border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:block"
>
	<div class="flex justify-between p-2 px-4">
		<div class="flex gap-1">
			<SelectCompany />
			<a href="/dashboard">
				<Button variant="link" class="font-semibold">Strona główna</Button>
			</a>
			{#if $selectedCompany}
				<a href="/dashboard/{$selectedCompany.id}">
					<Button variant="link" class="font-semibold">Produkty</Button>
				</a>
				<a href="/dashboard/{$selectedCompany.id}/orders">
					<Button variant="link" class="font-semibold">Zamówienia</Button>
				</a>
				<a href="/dashboard/{$selectedCompany.id}/settings">
					<Button variant="link" class="font-semibold">Ustawienia</Button>
				</a>
			{/if}
		</div>
		<div class="flex gap-1">
			<ProfileDropdownMenu />
			<GithubLink />
			<ThemeButton />
		</div>
	</div>
</header>
