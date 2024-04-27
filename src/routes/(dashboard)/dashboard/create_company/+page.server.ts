import { fail, redirect } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createCompanyFormSchema } from '@/auth/form_schemas';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(createCompanyFormSchema))
	};
};

export const actions: Actions = {
	default: async ({ request, locals: { user, honoClient } }) => {
		const form = await superValidate(request, zod(createCompanyFormSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const formData = form.data;

		const res = await honoClient.api.companies.$post({
			json: {
				name: formData.name,
				userId: user?.id || ''
			}
		});
		const data = await res.json();

		if (!data.success || !data.companyId) {
			return fail(500, {
				form
			});
		}

		redirect(302, `/dashboard/${data.companyId}`);
	}
};
