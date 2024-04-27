<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { userStore } from '@/stores';
	import { UserRound } from 'lucide-svelte';
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { toast } from 'svelte-sonner';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} variant="ghost" size="icon">
			<UserRound />
		</Button>
	</DropdownMenu.Trigger>

	<DropdownMenu.Content>
		{#if $userStore}
			<form
				method="post"
				action="/sign_out"
				use:enhance={() => {
					toast.loading('Proszę czekać...');
					return async ({ result }) => {
						if (result.type == 'failure') {
							toast.error('Coś poszło nie tak.');
						} else if (result.type == 'redirect') {
							toast.success('Pomyślnie wylogowano.');
							goto(result.location);
						}
					};
				}}
			>
				<Button type="submit" variant="ghost" class="w-full">Wyloguj się</Button>
			</form>
		{:else}
			<div class="grid gap-1 p-1">
				<a href="/sign_in">
					<Button class="w-full rounded-full px-16 text-lg">Zaloguj się</Button>
				</a>

				<div class="grid grid-cols-3 items-center text-center">
					<Separator />
					<p class="text-muted-foreground">Lub</p>
					<Separator />
				</div>

				<a href="/sign_up">
					<Button class="w-full rounded-full text-lg">Załóż konto</Button>
				</a>
			</div>
		{/if}
	</DropdownMenu.Content>
</DropdownMenu.Root>
