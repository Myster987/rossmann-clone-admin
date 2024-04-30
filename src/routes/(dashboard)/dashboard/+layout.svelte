<script lang="ts">
	import { MainHeader, MobileHeader } from '@/components/navigation';
	import { asyncCompaniesStore } from '@/stores';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	$: asyncCompaniesStore.updateAsync(data.streamed.companies);
</script>

<div class="min-h-screen">
	<MobileHeader />
	<MainHeader />

	<slot />
</div>
