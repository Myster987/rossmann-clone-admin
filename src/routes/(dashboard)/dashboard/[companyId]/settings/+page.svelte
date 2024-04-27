<script lang="ts">
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { editCompanyFormSchema } from '@/auth/form_schemas';
	import { selectedCompany } from '@/stores';
	import { Separator } from '@/components/ui/separator';
	import { Input } from '@/components/ui/input';
	import * as Form from '@/components/ui/form';
	import { DeleteCompanyAlert } from '@/components/custom';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';
	import type { SelectCompanies } from '@/db/schema';

	export let data: PageData;
	const form = superForm(data.form, {
		validators: zodClient(editCompanyFormSchema),
		invalidateAll: false,
		resetForm: false,
		onSubmit() {
			toast.loading('Proszę czekać...');
		},
		onUpdated({ form }) {
			if (!form.valid) {
				toast.error('Niepoprawne podano dane.');
			} else {
				toast.success('Pomyślnie edytowana nazwę marki.');
				selectedCompany.updateProperties(form.data as SelectCompanies);
			}
		}
	});

	const { form: formData, enhance } = form;

	onMount(() => {
		$formData.name = $selectedCompany?.name || '';
	});
</script>

<main class="grid h-[90%] px-6 py-3">
	{#if !$selectedCompany}
		<h1 class="self-center text-center text-3xl font-semibold md:text-4xl">
			Wybierz markę lub stwórz nową, żeby zobaczyć dane
		</h1>
	{:else}
		<div class="grid h-fit gap-3">
			<div class="flex items-center justify-between">
				<div class="flex flex-col">
					<h1 class="text-4xl font-bold sm:text-5xl">Ustawienia</h1>
					<p class="font-semibold text-muted-foreground">Edytuj ustawienia marki</p>
				</div>
				<DeleteCompanyAlert />
			</div>
			<Separator />

			<form action="?/editCompany" method="post" use:enhance class="flex max-w-96 flex-col gap-1">
				<Form.Field {form} name="name">
					<Form.Control let:attrs>
						<Form.Label class="text-lg">Nazwa marki</Form.Label>
						<Input {...attrs} bind:value={$formData.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Button class="w-36" size="sm">Zapisz zmiany</Form.Button>
			</form>
		</div>
	{/if}
</main>
