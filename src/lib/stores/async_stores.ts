import { writable, type Updater } from 'svelte/store';

interface PromiseStoreType<Data> {
	data: Data | undefined;
	isLoading: boolean;
	isError: boolean;
}

export function createAsyncStore<T>(initialValue?: Promise<T>) {
	const store = writable<PromiseStoreType<T>>({
		data: undefined,
		isLoading: false,
		isError: false
	});

	function updateStatus(promiseObject: Promise<T>) {
		store.set({ data: undefined, isLoading: true, isError: false });
		promiseObject
			.then((data) => {
				store.set({ data, isLoading: false, isError: false });
			})
			.catch(() => {
				store.set({ data: undefined, isLoading: false, isError: true });
			});
	}

	function updateAsync(newPromise: Promise<T>) {
		updateStatus(newPromise);
	}

	if (initialValue) {
		updateStatus(initialValue);
	}

	return {
		...store,
		updateAsync
	};
}
