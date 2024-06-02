<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { Trash2 } from 'lucide-svelte';
	import { createHonoClient } from '@/api/client';
	import { asyncProductsStore } from '@/stores';
	import { Button } from '@/components/ui/button';
	import type { Writable } from 'svelte/store';

	const honoClient = createHonoClient(fetch);
	export let selectedRows: Writable<Record<string, boolean>>;
	let currentlySelectedRows = Object.keys($selectedRows);

	$: currentlySelectedRows = Object.keys($selectedRows);

	const handleDeleteSelectedProducts = async () => {
		if (currentlySelectedRows.length == 0) {
			return;
		}
		toast.message('Proszę czekać...');

		const res = await honoClient.api.products.$delete({
			json: {
				productIds: currentlySelectedRows
			}
		});
		const data = await res.json();
		if (data.success) {
			toast.success(`Pomyślnie usunięto ${Object.keys($selectedRows).length} produkt(y).`);
			$selectedRows = {};
			$asyncProductsStore.data = $asyncProductsStore.data?.filter(
				(product) => !currentlySelectedRows.includes(product.id)
			);
		} else {
			toast.error('Coś poszło nie tak.');
		}
		invalidateAll();
	};
</script>

<Button
	variant="destructive"
	disabled={currentlySelectedRows.length == 0 || $asyncProductsStore.isLoading}
	on:click={handleDeleteSelectedProducts}
	class="flex items-center gap-1"
>
	<Trash2 /> Usuń ({currentlySelectedRows.length})
</Button>
