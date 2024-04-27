<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { signInFormSchema, type SignInFormSchema } from '@/auth/form_schemas';
	import { Input } from '@/components/ui/input';
	import { Separator } from '@/components/ui/separator';
	import { toast } from 'svelte-sonner';
	import * as Form from '@/components/ui/form';
	import * as Card from '@/components/ui/card';

	export let data: SuperValidated<Infer<SignInFormSchema>>;

	const form = superForm(data, {
		validators: zodClient(signInFormSchema),
		onSubmit() {
			toast.loading('Proszę czekać...');
		},
		onResult({ result }) {
			if (result.type == 'failure') {
				toast.error('Niepoprawny email lub hasło.');
			} else if (result.type == 'redirect') {
				toast.success('Pomyślnie zalogowano!');
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<Card.Root class="w-10/12 sm:w-3/5 md:w-2/5 lg:w-[32%]">
	<Card.Header>
		<Card.Title class="text-2xl">Zaloguj się</Card.Title>
		<Card.Description>Wprowadź swój email i hasło.</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="post" use:enhance>
			<Form.Field {form} name="email">
				<Form.Control let:attrs>
					<Form.Label class="text-lg">Email</Form.Label>
					<Input {...attrs} bind:value={$formData.email} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="password">
				<Form.Control let:attrs>
					<Form.Label class="text-lg">Hasło</Form.Label>
					<Input {...attrs} type="password" bind:value={$formData.password} />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Button type="submit" class="my-2 w-full text-lg">Zaloguj się</Form.Button>
		</form>

		<div class="grid grid-cols-3 items-center p-1 text-center">
			<Separator />
			<p class="text-sm text-muted-foreground">Jeśli nie masz konta</p>
			<Separator />
		</div>
		<a href="/sign_up">
			<Form.Button variant="outline" class="my-1 w-full text-lg">Załóż konto</Form.Button>
		</a>
	</Card.Content>
</Card.Root>
