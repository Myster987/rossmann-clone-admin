<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { createHonoClient } from '@/api/client';
	import { productsStore } from '@/stores';
	import { toast } from 'svelte-sonner';
	import { Button } from '@/components/ui/button';
	import { Trash2 } from 'lucide-svelte';
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
			$productsStore = $productsStore.filter(
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
	disabled={currentlySelectedRows.length == 0}
	on:click={handleDeleteSelectedProducts}
	class="flex items-center gap-1"
>
	<Trash2 /> Usuń ({currentlySelectedRows.length})
</Button>
