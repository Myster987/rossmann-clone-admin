import { fail } from '@sveltejs/kit';
import { message, withFiles, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { editProductFormSchema } from '@/auth/form_schemas';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params: { productId }, locals: { honoClient } }) => {
	const res = await honoClient.api.products[':productId'].$get({
		param: {
			productId
		}
	});
	const data = await res.json();

	const form = await superValidate(zod(editProductFormSchema), {
		defaults: {
			name: data.product?.name,
			price: data.product?.price,
			description: data.product?.description,
			ingredients: data.product?.ingredients
		}
	});

	if (!data) {
		return message(form, 'Coś poszło nie tak.', {
			status: 500
		});
	}

	if (!data.success) {
		return message(form, 'Nie udało się znaleźć produktu.', {
			status: 404
		});
	}

	return {
		form
	};
};

export const actions: Actions = {
	default: async ({ request, params: { productId }, locals: { honoClient } }) => {
		const form = await superValidate(request, zod(editProductFormSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const formData = form.data;

		const res = await honoClient.api.products[':productId'].$patch({
			param: { productId },
			form: {
				...formData,
				price: formData.price as unknown as string
			}
		});
		const data = await res.json();

		if (!data.success) {
			return message(
				withFiles(form),
				{ text: 'Nie udało się edytować produktu. Coś poszło nie tak', success: false },
				{ status: 500 }
			);
		}

		return message(withFiles(form), { text: 'Pomyślnie edytowano produkt.', success: true });
	}
};
