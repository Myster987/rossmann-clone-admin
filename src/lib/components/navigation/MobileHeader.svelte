<script lang="ts">
	import { selectedCompany } from '@/stores';
	import { Menu } from 'lucide-svelte';
	import { GithubLink, ThemeButton, ProfileDropdownMenu, SelectCompany } from '@/components/custom';
	import { Button } from '@/components/ui/button';
	import * as Sheet from '@/components/ui/sheet';
	import RossmannIcon from '@/assets/rossmann_icon.svg?raw';
</script>

<header
	class="sticky top-0 z-50 w-full border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
>
	<div class="flex justify-between p-2 px-4">
		<Sheet.Root>
			<Sheet.Trigger asChild let:builder>
				<div class="flex gap-2">
					<Button builders={[builder]} variant="ghost" size="icon">
						<Menu />
					</Button>
					<div class="h-9 w-9">
						{@html RossmannIcon}
					</div>
				</div>
			</Sheet.Trigger>
			<Sheet.Content side="left">
				<Sheet.Header class="flex items-center justify-center">
					<SelectCompany />
				</Sheet.Header>
				<div class="grid justify-center gap-4 pl-4 pt-4">
					<a href="/dashboard">
						<Button variant="link" class="text-2xl font-semibold">Strona główna</Button>
					</a>
					{#if $selectedCompany}
						<a href="/dashboard/{$selectedCompany.id}">
							<Button variant="link" class="text-2xl font-semibold">Produkty</Button>
						</a>
						<a href="/dashboard/{$selectedCompany.id}/settings">
							<Button variant="link" class="text-2xl font-semibold">Ustawienia</Button>
						</a>
					{/if}
				</div>
			</Sheet.Content>
		</Sheet.Root>

		<div>
			<div class="flex gap-1">
				<ProfileDropdownMenu />
				<GithubLink />
				<ThemeButton />
			</div>
		</div>
	</div>
</header>
