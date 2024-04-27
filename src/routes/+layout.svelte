<script lang="ts">
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '@/components/ui/sonner';
	import { userStore, windowWidthStore } from '@/stores';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	$: {
		$userStore = data.user;
	}
</script>

<svelte:window bind:innerWidth={$windowWidthStore} />

<ModeWatcher />
<Toaster />
<slot />
