<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { selectedCompany } from '@/stores';
	import { Button } from '@/components/ui/button';
	import { Trash2 } from 'lucide-svelte';
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import { toast } from 'svelte-sonner';
</script>

<AlertDialog.Root>
	<AlertDialog.Trigger>
		<Button size="icon" variant="destructive">
			<Trash2 />
		</Button>
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Czy jesteś pewna/y?</AlertDialog.Title>
			<AlertDialog.Description
				>Nie można tego cofnąć. To usunię markę na zawsze i <b class="text-destructive"
					>wszystkie powiązane z nią produkty</b
				>.</AlertDialog.Description
			>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Anuluj</AlertDialog.Cancel>
			<form
				action="/dashboard/{$selectedCompany?.id || ''}/settings?/deleteCompany"
				method="post"
				use:enhance={() => {
					toast.message('Proszę czekać...');
					return async ({ result }) => {
						if (result.type == 'redirect') {
							toast.success('Pomyślnie usunięto markę.');
							$selectedCompany = undefined;
						} else if (result.type == 'failure' || result.type == 'error') {
							toast.error('Coś poszło nie tak.');
						}
						invalidateAll();
					};
				}}
			>
				<AlertDialog.Action type="submit">Usuń</AlertDialog.Action>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
