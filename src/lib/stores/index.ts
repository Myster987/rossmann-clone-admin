import { derived, writable } from 'svelte/store';
import type { User } from 'lucia';
import type { SelectCompanies, SelectProduct } from '@/db/schema';
import { createAsyncStore } from './async_stores';

export const userStore = writable<User | null>(null);

export const productsStore = writable<SelectProduct[]>([]);

export const companiesStore = writable<SelectCompanies[]>([]);

export const asyncCompaniesStore = createAsyncStore<SelectCompanies[]>();

const createSelectedCompanyStore = (initialValue: SelectCompanies | undefined) => {
	const company = writable<SelectCompanies | undefined>(initialValue);
	const selectItem = derived(company, (value) => ({
		label: value?.name,
		value
	}));

	const updateProperties = (values: SelectCompanies) => {
		company.update((current) => ({ ...current, ...values }));
	};

	return {
		...company,
		selectItem,
		updateProperties
	};
};

export const selectedCompany = createSelectedCompanyStore(undefined);

export const windowWidthStore = writable(0);
