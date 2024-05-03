<script lang="ts" generics="T extends Record<string, unknown>">
	import { browser } from '$app/environment';
	import { Button } from '@/components/ui/button';
	import { ImagePlus, Trash } from 'lucide-svelte';
	import { filesFieldProxy, type SuperForm, type FormPathArrays } from 'sveltekit-superforms';

	export let superform: SuperForm<T>;
	export let field: FormPathArrays<T>;

	const { values, valueErrors } = filesFieldProxy(superform, field);
</script>

<div>
	<div class="mb-4 flex items-center gap-4">
		{#each $values as file (file.name)}
			<div class="relative h-[350px] w-[150px] overflow-hidden rounded-md">
				<img
					src={URL.createObjectURL(file)}
					alt={file.name}
					class="h-full w-full object-cover"
					on:load={(e) => URL.revokeObjectURL(e.target?.src)}
				/>
				<Button
					variant="destructive"
					size="icon"
					class="absolute right-2 top-2 z-10"
					on:click={() => {
						values.set([...$values].filter((v) => v.name != file.name));
					}}
				>
					<Trash />
				</Button>
			</div>
		{/each}
	</div>
	<input
		type="file"
		accept="image/*"
		id="fileInput"
		multiple
		bind:files={$values}
		class="hidden"
		{...$valueErrors}
		{...$$restProps}
	/>

	<Button
		disabled={!browser}
		on:click={() => document.getElementById('fileInput')?.click()}
		variant="secondary"
		class="flex gap-1"
	>
		<ImagePlus /> Dodaj zdjęcia
	</Button>
</div>
