import { fail } from '@sveltejs/kit';
import { message, withFiles, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { editProductFormSchema } from '@/auth/form_schemas';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params: { productId }, locals: { honoClient } }) => {
	const res = await honoClient.api.products.withImages[':productId'].$get({
		param: {
			productId
		}
	});
	const resData = await res.json();
	const { data } = resData;

	const form = await superValidate(zod(editProductFormSchema), {
		defaults: {
			name: data?.name,
			price: data?.price,
			description: data?.description,
			ingredients: data?.ingredients,
			category: data?.category,
			images: data?.images?.map((image) => image.imageUrl) as unknown as [File, ...File[]],
			featured: data?.featured,
			archived: data?.archived
		}
	});

	if (!data) {
		return message(form, 'Coś poszło nie tak.', {
			status: 500
		});
	}

	if (!resData.success) {
		return message(form, 'Nie udało się znaleźć produktu.', {
			status: 404
		});
	}

	return {
		form
	};
};

export const actions: Actions = {
	default: async ({ request, params: { productId }, fetch }) => {
		const form = await superValidate(request, zod(editProductFormSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const formData = form.data;
		const body = new FormData();

		Object.entries(formData).forEach(([key, val]) => {
			if (key == 'images') {
				(val as File[]).forEach((image) => {
					body.append('images[]', image);
				});
			} else {
				body.append(key, val as string);
			}
		});

		const res = await fetch(`/api/products/${productId}`, {
			body,
			method: 'PATCH'
		});
		const data: { success: boolean } = await res.json();

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
