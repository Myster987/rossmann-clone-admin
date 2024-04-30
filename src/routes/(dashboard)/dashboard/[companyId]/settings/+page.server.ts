import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { editCompanyFormSchema } from '@/auth/form_schemas';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { form: await superValidate(zod(editCompanyFormSchema)) };
};

export const actions: Actions = {
	editCompany: async ({ request, params: { companyId }, locals: { honoClient } }) => {
		const form = await superValidate(request, zod(editCompanyFormSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const formData = form.data;
		const res = await honoClient.api.companies[':companyId'].$patch({
			param: {
				companyId
			},
			json: {
				name: formData.name
			}
		});
		const data = await res.json();

		if (!data.success) {
			return fail(res.status, {
				form
			});
		}
		return {
			form
		};
	},
	deleteCompany: async ({ params: { companyId }, locals: { honoClient } }) => {
		const res = await honoClient.api.companies[':companyId'].$delete({
			param: { companyId }
		});
		const data = await res.json();

		if (res.status == 500) {
			return fail(500);
		}

		if (!data.success) {
			return fail(400);
		}

		redirect(302, '/dashboard');
	}
};
