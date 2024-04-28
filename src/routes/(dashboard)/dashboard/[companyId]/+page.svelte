<script lang="ts">
	import { page } from '$app/stores';
	import DataTable from '@/components/table/DataTable.svelte';
	import { productsStore } from '@/stores';
	import { Separator } from '@/components/ui/separator';
	import { Button } from '@/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let { products } = data;
	$: {
		({ products } = data);
		$productsStore = products || [];
	}
</script>

<div class="grid gap-4 p-5">
	<div class="flex items-center justify-between">
		<h1 class="text-4xl font-semibold">Produkty</h1>
		<a href="{$page.url.pathname}/create_product">
			<Button class="gap-1" size="sm"><Plus size="20px" />Dodaj nowy</Button>
		</a>
	</div>

	<Separator class="mb-3" />

	<DataTable />
</div>
