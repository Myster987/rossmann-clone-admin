<script lang="ts">
	import { MainHeader, MobileHeader } from '@/components/navigation';
	import { companiesStore } from '@/stores';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
	$companiesStore = data.companies || [];
	$: $companiesStore = data.companies || [];
</script>

<div class="min-h-screen">
	<MobileHeader />
	<MainHeader />

	<slot />
</div>
