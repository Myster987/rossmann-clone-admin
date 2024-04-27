<script lang="ts">
	import SignInForm from '@/components/auth/SignInForm.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main class="flex min-h-screen items-center justify-center">
	<SignInForm data={data.form} />
</main>
