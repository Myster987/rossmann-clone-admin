<script lang="ts">
	import DataTable from '@/components/table/DataTable.svelte';
	import AddProductDialog from '@/components/custom/AddProductDialog.svelte';
	import { Separator } from '@/components/ui/separator';
	import { productsStore } from '@/stores';
	import type { PageData } from './$types';

	export let data: PageData;

	let { products, form } = data;
	$: {
		({ products, form } = data);
		$productsStore = products || [];
	}
</script>

<div class="grid gap-4 p-5">
	<div class="flex items-center justify-between">
		<h1 class="text-4xl font-semibold">Produkty</h1>
		<AddProductDialog data={form} />
	</div>

	<Separator class="mb-3" />

	<DataTable />
</div>
