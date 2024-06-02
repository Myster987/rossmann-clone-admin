<script lang="ts">
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import { createTable, Render, Subscribe, createRender } from 'svelte-headless-table';
	import {
		addPagination,
		addSortBy,
		addTableFilter,
		addHiddenColumns,
		addSelectedRows
	} from 'svelte-headless-table/plugins';
	import { asyncProductsStore } from '@/stores';
	import {
		ArrowUpDown,
		ChevronDown,
		ChevronLeft,
		ChevronRight,
		ChevronsLeft,
		ChevronsRight
	} from 'lucide-svelte';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Skeleton } from '@/components/ui/skeleton';
	import DataTableActions from './DataTableActions.svelte';
	import DataTableCheckbox from './DataTableCheckbox.svelte';
	import DataTableDeleteButton from './DataTableDeleteButton.svelte';
	import DataTableSelectPageSize from './DataTableSelectPageSize.svelte';
	import * as Table from '@/components/ui/table';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';

	let tableData = writable($asyncProductsStore.data || []);
	$: if (browser) $tableData = $asyncProductsStore.data || [];

	const table = createTable(tableData, {
		page: addPagination(),
		sort: addSortBy(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) =>
				value.toLocaleLowerCase().includes(filterValue.toLocaleLowerCase())
		}),
		hide: addHiddenColumns(),
		select: addSelectedRows({ linkDataSubRows: false })
	});

	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, { checked: allPageRowsSelected });
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);
				return createRender(DataTableCheckbox, {
					checked: isSelected
				});
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'name',
			header: 'Nazwa',
			plugins: {
				sort: {
					disable: true
				}
			}
		}),
		table.column({
			accessor: 'createdAt',
			header: 'Dodano w',
			cell: ({ value }) => {
				const date = new Date(value || '');
				return date.toLocaleDateString();
			},
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'price',
			header: 'Cena',
			cell: ({ value }) => {
				const formatted = new Intl.NumberFormat('en-US', {
					style: 'currency',
					currency: 'PLN'
				}).format(Number(value));
				return formatted;
			},
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'quantity',
			header: 'Ilość',
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'category',
			header: 'Kategoria',
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'featured',
			header: 'Wyróżniony',
			cell: ({ value }) => {
				if (value == 1) {
					return 'Tak';
				}
				return 'Nie';
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'archived',
			header: 'Zarchiwizowany',
			cell: ({ value }) => {
				if (value == 1) {
					return 'Tak';
				}
				return 'Nie';
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ id }) => id,
			header: '',
			cell: ({ value }) => {
				return createRender(DataTableActions, { id: value || '', selectedRows: selectedDataIds });
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		})
	]);
	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates, flatColumns, rows } =
		table.createViewModel(columns, { rowDataId: (row) => row.id });

	const { hasNextPage, hasPreviousPage, pageIndex, pageSize, pageCount } = pluginStates.page;
	$pageSize = 5;
	const { filterValue } = pluginStates.filter;
	const { hiddenColumnIds } = pluginStates.hide;
	let { selectedDataIds } = pluginStates.select;

	const ids = flatColumns.map((col) => col.id);
	let hideForId = Object.fromEntries(ids.map((id) => [id, true]));

	$: {
		$hiddenColumnIds = Object.entries(hideForId)
			.filter(([, hide]) => !hide)
			.map(([id]) => id);
	}

	const hidableCols = ['createdAt', 'price', 'quantity', 'category', 'featured', 'archived'];
</script>

<div class="h-full">
	{#if $asyncProductsStore.isLoading}
		<Skeleton class="h-full w-full rounded-md" />
	{:else}
		<div class="flex items-center py-4">
			<Input class="max-w-sm" placeholder="Szukaj nazwy..." type="text" bind:value={$filterValue} />
			<div class="ml-auto flex gap-2">
				<DataTableDeleteButton selectedRows={selectedDataIds} />
				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button variant="outline" class="flex gap-1" builders={[builder]}>
							Kolumny <ChevronDown size="18" />
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content>
						{#each flatColumns as col}
							{#if hidableCols.includes(col.id)}
								<DropdownMenu.CheckboxItem bind:checked={hideForId[col.id]}>
									{col.header}
								</DropdownMenu.CheckboxItem>
							{/if}
						{/each}
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
		<div class="rounded-md border">
			<Table.Root {...$tableAttrs}>
				<Table.Header>
					{#each $headerRows as headerRow}
						<Subscribe rowAttrs={headerRow.attrs()}>
							<Table.Row>
								{#each headerRow.cells as cell (cell.id)}
									<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
										<Table.Head {...attrs}>
											{#if cell.id == 'createdAt' || cell.id == 'price' || cell.id == 'quantity'}
												<Button variant="ghost" on:click={props.sort.toggle} class="flex gap-1">
													<Render of={cell.render()} />
													<ArrowUpDown size="18" />
												</Button>
											{:else}
												<Render of={cell.render()} />
											{/if}
										</Table.Head>
									</Subscribe>
								{/each}
							</Table.Row>
						</Subscribe>
					{/each}
				</Table.Header>
				<Table.Body {...$tableBodyAttrs} class="flex-auto">
					{#each $pageRows as row (row.id)}
						<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
							<Table.Row {...rowAttrs}>
								{#each row.cells as cell (cell.id)}
									<Subscribe attrs={cell.attrs()} let:attrs>
										<Table.Cell {...attrs}>
											<Render of={cell.render()} />
										</Table.Cell>
									</Subscribe>
								{/each}
							</Table.Row>
						</Subscribe>
					{/each}
				</Table.Body>
			</Table.Root>
			<div class="flex items-center justify-end px-4 py-4">
				<div class="flex-1 text-sm text-muted-foreground">
					{Object.keys($selectedDataIds).length} z {$rows.length} zaznaczono.
				</div>
				<div class="flex items-center gap-3">
					<p class="text-nowrap">Wiersze na stronę</p>
					<DataTableSelectPageSize currentPageSize={pageSize} />
					<Button
						variant="outline"
						size="sm"
						on:click={() => ($pageIndex = 0)}
						disabled={!$hasPreviousPage}
					>
						<ChevronsLeft />
					</Button>
					<Button
						variant="outline"
						size="sm"
						on:click={() => ($pageIndex = $pageIndex - 1)}
						disabled={!$hasPreviousPage}
					>
						<ChevronLeft />
					</Button>
					<div class="text-nowrap">
						Strona {$pageIndex + 1} z {$pageCount == 0 ? 1 : $pageCount}
					</div>
					<Button
						variant="outline"
						size="sm"
						on:click={() => ($pageIndex = $pageIndex + 1)}
						disabled={!$hasNextPage}><ChevronRight /></Button
					>
					<Button
						variant="outline"
						size="sm"
						on:click={() => ($pageIndex = $pageCount - 1)}
						disabled={!$hasNextPage}><ChevronsRight /></Button
					>
				</div>
			</div>
		</div>
	{/if}
</div>
