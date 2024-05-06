<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { selectedCompany } from '@/stores';
	import { Ellipsis, Trash2, SquarePen } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { Button } from '@/components/ui/button';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import type { Writable } from 'svelte/store';

	export let id: string;
	export let selectedRows: Writable<Record<string, boolean>>;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon">
			<Ellipsis />
		</Button>
	</DropdownMenu.Trigger>

	<DropdownMenu.Content>
		<DropdownMenu.Label>Opcje</DropdownMenu.Label>
		<DropdownMenu.Separator />

		<DropdownMenu.Item>
			<form
				action="/form_actions?/deleteProduct"
				method="post"
				use:enhance={({}) => {
					toast.loading('Proszę czekać...');
					return async ({ result }) => {
						if (result.type == 'success') {
							toast.success('Pomyślnie usunięto produkt.');
							$selectedRows = Object.fromEntries(
								Object.keys($selectedRows)
									.filter((val) => val != id)
									.map((selectedId) => [selectedId, true])
							);
						} else if (result.type == 'failure' || result.type == 'error') {
							toast.error('Coś poszło nie tak.');
						}
						invalidateAll();
					};
				}}
			>
				<input type="text" name="id" value={id} hidden />
				<button class="flex items-center gap-2">
					<Trash2 size="22" />
					Usuń
				</button>
			</form>
		</DropdownMenu.Item>
		<a href="/dashboard/{$selectedCompany?.id}/edit_product/{id}">
			<DropdownMenu.Item class="flex gap-2 py-2"
				><SquarePen size="22" /> Edytuj produkt</DropdownMenu.Item
			>
		</a>
	</DropdownMenu.Content>
</DropdownMenu.Root>
