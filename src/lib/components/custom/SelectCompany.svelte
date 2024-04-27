<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { companiesStore, selectedCompany } from '@/stores';
	import { Store, CircleFadingPlus } from 'lucide-svelte';
	import { Button } from '@/components/ui/button';
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
>
	<Select.Trigger class="w-44 md:w-52">
		<Store />
		<Select.Value placeholder="Wybierz markę" />
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#each $companiesStore as company}
				<a href="/dashboard/{company.id}">
					<Select.Item value={company} label={company.name} class="flex items-center gap-1">
						<Store size="18" /> {company.name}</Select.Item
					>
				</a>
			{/each}
			<Select.Separator />
			<a href="/dashboard/create_company">
				<Button variant="ghost" size="sm" class="flex w-full items-center gap-1">
					<CircleFadingPlus size="18" /> Dodaj nową markę
				</Button>
			</a>
		</Select.Group>
	</Select.Content>
</Select.Root>
