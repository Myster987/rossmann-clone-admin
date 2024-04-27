<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { createCompanyFormSchema } from '@/auth/form_schemas';
	import { toast } from 'svelte-sonner';
	import { Input } from '@/components/ui/input';
	import * as Form from '@/components/ui/form';
	import * as Card from '@/components/ui/card';
	import type { PageData } from './$types';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(createCompanyFormSchema),
		invalidateAll: 'force',
		onSubmit() {
			toast.loading('Proszę czekać...');
		},
		onResult({ result }) {
			if (result.type == 'failure') {
				toast.error('Niepoprawnie podano dane.');
			} else if (result.type == 'redirect') {
				toast.success('Pomyślnie utworzono markę!');
			} else if (result.type == 'error') {
				toast.error('Coś poszło nie tak.');
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<main class="flex h-screen items-center justify-center">
	<Card.Root class="w-5/6 sm:w-[440px]">
		<Card.Header>
			<Card.Title class="text-2xl">Stwórz markę</Card.Title>
			<Card.Description>Dodaj nową markę do sklepu.</Card.Description>
		</Card.Header>
		<Card.Content>
			<form method="post" use:enhance>
				<Form.Field {form} name="name">
					<Form.Control let:attrs>
						<Form.Label class="text-lg">Nazwa Marki</Form.Label>
						<Input {...attrs} bind:value={$formData.name} />
					</Form.Control>
					<Form.FieldErrors></Form.FieldErrors>
				</Form.Field>
				<div class="mt-5 flex flex-row-reverse">
					<div class="flex gap-2">
						<a href="/dashboard">
							<Form.Button variant="outline" type="button" class="w-20">Wróć</Form.Button>
						</a>
						<Form.Button type="submit" class="w-20">Stwórz</Form.Button>
					</div>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</main>
