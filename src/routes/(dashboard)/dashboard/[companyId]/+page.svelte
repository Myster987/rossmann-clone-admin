<script lang="ts">
	import { page } from '$app/stores';
	import { Plus } from 'lucide-svelte';
	import { asyncProductsStore } from '@/stores';
	import { Separator } from '@/components/ui/separator';
	import { Button } from '@/components/ui/button';
	import DataTable from '@/components/table/DataTable.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: asyncProductsStore.updateAsync(data.streamed.products);
</script>

<div class="h-[calc(100vh-56.8px)]">
	<div class="flex h-full flex-col gap-4 p-5">
		<div class="flex items-center justify-between">
			<h1 class="text-4xl font-semibold">Produkty</h1>
			<a href="{$page.url.pathname}/create_product">
				<Button class="gap-1" size="sm"><Plus size="20px" />Dodaj nowy</Button>
			</a>
		</div>

		<Separator class="mb-3" />

		<DataTable />
	</div>
</div>
