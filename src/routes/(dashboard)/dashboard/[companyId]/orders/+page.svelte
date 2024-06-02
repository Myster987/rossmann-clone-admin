<script lang="ts">
	import { createAsyncStore } from '@/stores/async_stores';
	import { Separator } from '@/components/ui/separator';
	import * as Table from '$lib/components/ui/table';
	import type { PageData } from './$types';

	export let data: PageData;

	const orderedProductsStore = createAsyncStore(data.streamed.orderedProducts);
	$: orderedProductsStore.updateAsync(data.streamed.orderedProducts);
	$: orderedProductsList =
		$orderedProductsStore.data?.map((val) => ({
			orderId: val.orderId,
			productId: val.productId,
			name: val.product.name,
			quantity: val.quantity,
			status: val.order.status,
			phone: val.order.phone,
			adress: val.order.address
		})) || [];
</script>

<div class="flex flex-col gap-4 p-4">
	<h1 class="text-4xl font-bold">Zamówienia</h1>

	<Separator />

	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Id zamówienia</Table.Head>
				<Table.Head>Status</Table.Head>
				<Table.Head>Adres</Table.Head>
				<Table.Head>Nr. Telefonu</Table.Head>
				<Table.Head>Id produktu</Table.Head>
				<Table.Head>Nazwa Produktu</Table.Head>
				<Table.Head>Ilość</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each orderedProductsList as item, i (i)}
				<Table.Row>
					<Table.Cell>{item.orderId}</Table.Cell>
					<Table.Cell>{item.status == 'paid' ? 'Zapłacono' : 'Nie dokonano zapłaty'}</Table.Cell>
					<Table.Cell>{item.adress}</Table.Cell>
					<Table.Cell>{item.phone}</Table.Cell>
					<Table.Cell>{item.productId}</Table.Cell>
					<Table.Cell>{item.name}</Table.Cell>
					<Table.Cell>{item.quantity}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
