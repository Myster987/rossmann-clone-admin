import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { addProductFormSchema } from '@/auth/form_schemas';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(addProductFormSchema))
	};
};
