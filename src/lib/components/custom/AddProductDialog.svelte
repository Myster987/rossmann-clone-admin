<script lang="ts">
	import { superForm, type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { addProductFormSchema, type AddProductFormSchema } from '@/auth/form_schemas';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import * as Dialog from '@/components/ui/dialog';
	import * as Form from '@/components/ui/form';
	import { toast } from 'svelte-sonner';
	import { page } from '$app/stores';

	export let data: SuperValidated<Infer<AddProductFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(addProductFormSchema),
		onSubmit({ formData }) {
			formData.append('companyId', $page.params.companyId);
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

<Dialog.Root>
	<Dialog.Trigger>
		<Button class="gap-1" size="sm"><Plus size="20px" />Dodaj nowy</Button>
	</Dialog.Trigger>

	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title class="text-2xl">Dodaj produkt</Dialog.Title>
			<Dialog.Description>Wypełnij wszystkie pola.</Dialog.Description>
		</Dialog.Header>

		<form
			action="/form_actions?/addProduct"
			method="post"
			enctype="multipart/form-data"
			use:enhance
		>
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
						on:input={(e) => ($formData.image = e.currentTarget.files?.item(0) || new File([], ''))}
					/>
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Dialog.Footer class="pt-2">
				<Form.Button class="px-6">Dodaj</Form.Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
