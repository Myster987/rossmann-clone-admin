<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import * as Card from '@/components/ui/card';
	import type { PageData } from './$types';

	export let data: PageData;
	let { user } = data;
	$: ({ user } = data);
</script>

<main class="grid h-screen place-items-center">
	<Card.Root>
		<Card.Header>
			{#if user}
				<h1 class="text-3xl">Witaj {user.email}</h1>
			{:else}
				<h1 class="text-3xl">Nie jesteś zalogowany/ana</h1>
			{/if}
		</Card.Header>
		<Card.Content class="grid gap-2">
			{#if user}
				<a href="/dashboard">
					<Button class="w-full text-lg">Do panelu głównego</Button>
				</a>
			{:else}
				<a href="/sign_in">
					<Button class="w-full text-lg">Zaloguj się</Button>
				</a>
				<div class="grid grid-cols-3 items-center text-center">
					<Separator />
					<p class="text-muted-foreground">Lub</p>
					<Separator />
				</div>
				<a href="/sign_up">
					<Button class="w-full text-lg">Załóż konto</Button>
				</a>
			{/if}
		</Card.Content>
	</Card.Root>
</main>
