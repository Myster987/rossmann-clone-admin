import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { honoClient }, params: { companyId } }) => {
	const fetchOrderedProducts = async () => {
		const res = await honoClient.api.orders[':companyId'].$get({
			param: { companyId }
		});

		const { data } = await res.json();

		return data;
	};

	return {
		streamed: {
			orderedProducts: fetchOrderedProducts()
		}
	};
};
