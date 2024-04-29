<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { companiesStore, selectedCompany, asyncCompaniesStore } from '@/stores';
	import { Store, CircleFadingPlus } from 'lucide-svelte';
	import { Button } from '@/components/ui/button';
	import { Skeleton } from '@/components/ui/skeleton';
	import * as Select from '@/components/ui/select';

	let { selectItem } = selectedCompany;

	onMount(() => {
		const { companyId } = $page.params;
		$companiesStore.forEach((value) => {
			if (value.id == companyId) {
				$selectedCompany = value;
			}
		});
	});
</script>

<Select.Root
	portal={null}
	selected={$selectItem}
	onSelectedChange={(v) => ($selectedCompany = v?.value)}
	disabled={$asyncCompaniesStore.isLoading}
>
	<Select.Trigger class="w-44 md:w-52">
		<Store />
		<Select.Value placeholder="Wybierz markę" />
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#if $asyncCompaniesStore.isLoading || !$asyncCompaniesStore.data}
				{#each [...Array(5).keys()] as placeholder}
					<Skeleton class="w-full" />
				{/each}
			{:else}
				{#each $asyncCompaniesStore.data as company}
					<a href="/dashboard/{company.id}">
						<Select.Item value={company} label={company.name} class="flex items-center gap-1">
							<Store size="18" /> {company.name}</Select.Item
						>
					</a>
				{/each}
			{/if}
			<Select.Separator />
			<a href="/dashboard/create_company">
				<Button variant="ghost" size="sm" class="flex w-full items-center gap-1">
					<CircleFadingPlus size="18" /> Dodaj nową markę
				</Button>
			</a>
		</Select.Group>
	</Select.Content>
</Select.Root>
