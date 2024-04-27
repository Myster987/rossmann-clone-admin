<script lang="ts">
	import * as Select from '@/components/ui/select';
	import type { Writable } from 'svelte/store';

	export let currentPageSize: Writable<number>;
	const pageSizes = [5, 10, 20, 50];
</script>

<Select.Root
	selected={{ label: $currentPageSize.toString(), value: $currentPageSize }}
	onSelectedChange={(e) => {
		$currentPageSize = e?.value || 5;
	}}
>
	<Select.Trigger class="min-w-16">
		<Select.Value placeholder={$currentPageSize.toString()} />
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#each pageSizes as size}
				<Select.Item value={size}>{size}</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
