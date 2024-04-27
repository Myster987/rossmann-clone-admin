<script lang="ts">
	import SignUpForm from '@/components/auth/SignUpForm.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<main class="flex min-h-screen items-center justify-center">
	<SignUpForm data={data.form} />
</main>
