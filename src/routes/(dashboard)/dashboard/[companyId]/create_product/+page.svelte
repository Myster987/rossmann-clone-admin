<script lang="ts">
	import { page } from '$app/stores';
	import { superForm } from 'sveltekit-superforms';
	import { addProductFormSchema } from '@/auth/form_schemas';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '@/components/ui/input';
	import { Checkbox } from '@/components/ui/checkbox';
	import { Separator } from '@/components/ui/separator';
	import { ImageUpload } from '@/components/ui/image-upload';
	import { toast } from 'svelte-sonner';
	import * as Form from '@/components/ui/form';
	import * as Card from '@/components/ui/card';
	import type { PageData } from './$types';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zodClient(addProductFormSchema),
		onSubmit({ formData }) {
			formData.append('featured', String($formData.featured));
			formData.append('archived', String($formData.archived));

			formData.append('companyId', $page.params.companyId);
			$formData.images.forEach((image) => formData.append('images', image));
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
</script>

<main class="grid gap-3 px-6 py-3">
	<div class="flex flex-col gap-2">
		<h1 class="text-4xl font-bold sm:text-5xl">Dodaj nowy produkt</h1>
		<p class="text-muted-foreground">Wypełnij dane i dodaj nowy produkt</p>
	</div>
	<Separator />
	<form
		action="/form_actions?/addProduct"
		method="post"
		enctype="multipart/form-data"
		use:enhance
		class="flex flex-col gap-5"
	>
		<Form.Field {form} name="images">
			<Form.Control>
				<Form.Label class="text-lg">Zdjęcia</Form.Label>
				<ImageUpload superform={form} field="images" />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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

			<Form.Field {form} name="quantity">
				<Form.Control let:attrs>
					<Form.Label class="text-lg">Ilość</Form.Label>
					<Input {...attrs} bind:value={$formData.quantity} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="category">
				<Form.Control let:attrs>
					<Form.Label class="text-lg">Kategoria</Form.Label>
					<Input {...attrs} bind:value={$formData.category} />
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

			<Card.Root>
				<Card.Content>
					<Form.Field {form} name="featured">
						<Form.Control let:attrs>
							<div class="flex items-center gap-2 pb-1 pt-3">
								<Checkbox
									{...attrs}
									checked={Boolean($formData.featured)}
									on:click={() => ($formData.featured = Number(!$formData.featured))}
								/>
								<Form.Label class="text-lg">Wyróżniony</Form.Label>
							</div>
							<p class="text-muted-foreground">Ten produkt będzie się pojawiał na stronie sklepu</p>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Content>
					<Form.Field {form} name="archived">
						<Form.Control let:attrs>
							<div class="flex items-center gap-2 pb-1 pt-3">
								<Checkbox
									{...attrs}
									checked={Boolean($formData.archived)}
									on:click={() => ($formData.archived = Number(!$formData.archived))}
								/>
								<Form.Label class="text-lg">Zarchiwizowane</Form.Label>
							</div>
							<p class="text-muted-foreground">
								Ten produkt nie będzie się pojawiał na stronie sklepu
							</p>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</Card.Content>
			</Card.Root>
		</div>

		<Form.Button class="w-24 px-6">Dodaj</Form.Button>
	</form>
</main>
