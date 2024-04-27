<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { editProductFormSchema, type EditProductFormSchema } from '@/auth/form_schemas';
	import { Input } from '@/components/ui/input';
	import { Separator } from '@/components/ui/separator';
	import * as Form from '@/components/ui/form';
	import * as Card from '@/components/ui/card';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';

	export let data: PageData;
	let { form: formObject } = data;
	const form = superForm(formObject as SuperValidated<Infer<EditProductFormSchema>>, {
		invalidateAll: 'force',
		validators: zodClient(editProductFormSchema),
		onSubmit() {
			toast.loading('Proszę czekać...');
		},
		onUpdated({ form }) {
			if (!form.valid && !form.message.text) {
				toast.error('Niepoprawne podano dane.');
			} else if (form.message.success) {
				toast.success(form.message.text);
			} else {
				toast.error(form.message.text);
			}
		}
	});

	const { form: formData, enhance } = form;

	let goBack = '/dashboard';

	onMount(() => {
		const { companyId } = $page.params;
		goBack = `/dashboard/${companyId}`;
	});
</script>

<main class="grid gap-3 px-6 py-3">
	<div class="flex flex-col">
		<h1 class="text-4xl font-bold sm:text-5xl">Edytuj Produkt</h1>
	</div>
	<Separator />
</main>

<div class="flex items-center justify-center">
	<Card.Root class="w-10/12 sm:w-3/5 md:w-2/5 lg:w-[32%]">
		<Card.Content class="py-3">
			<form method="post" enctype="multipart/form-data" use:enhance class="grid gap-1">
				<Form.Field {form} name="name">
					<Form.Control let:attrs>
						<Form.Label class="text-lg">Nazwa</Form.Label>
						<Input {...attrs} bind:value={$formData.name} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="price">
					<Form.Control let:attrs>
						<Form.Label class="text-lg">Cena</Form.Label>
						<Input {...attrs} bind:value={$formData.price} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="description">
					<Form.Control let:attrs>
						<Form.Label class="text-lg">Opis</Form.Label>
						<Input {...attrs} bind:value={$formData.description} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="ingredients">
					<Form.Control let:attrs>
						<Form.Label class="text-lg">Skład</Form.Label>
						<Input {...attrs} bind:value={$formData.ingredients} />
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="image">
					<Form.Control let:attrs>
						<Form.Label class="text-lg">Zdjęcie</Form.Label>
						<Input
							{...attrs}
							type="file"
							accept="image/*"
							on:input={(e) =>
								($formData.image = e.currentTarget.files?.item(0) || new File([], ''))}
						/>
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<div class="flex justify-end gap-3 pb-1 pt-1">
					<a href={goBack}>
						<Form.Button type="button" variant="outline" class="px-6">Wróć</Form.Button>
					</a>
					<Form.Button type="submit" class="px-5">Edytuj</Form.Button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
