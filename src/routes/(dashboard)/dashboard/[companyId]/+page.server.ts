import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { addProductFormSchema } from '@/auth/form_schemas';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params: { companyId }, locals: { honoClient } }) => {
	const fetchCompanyProducts = async () => {
		const res = await honoClient.api.products.company[':companyId'].$get({
			param: { companyId }
		});
		const products = await res.json();
		return products.data;
	};

	return {
		products: await fetchCompanyProducts(),
		form: await superValidate(zod(addProductFormSchema))
	};
};
