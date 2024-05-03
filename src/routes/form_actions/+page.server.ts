import { fail } from '@sveltejs/kit';
import { message, superValidate, withFiles } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { addProductFormSchema } from '@/auth/form_schemas';
import type { Actions } from './$types';

interface DeleteProductFormData {
	id: string;
}

export const actions: Actions = {
	deleteProduct: async ({ request, locals: { honoClient } }) => {
		const formData = Object.fromEntries(
			await request.formData()
		) as unknown as DeleteProductFormData;

		const res = await honoClient.api.products[':productId'].$delete({
			param: {
				productId: formData.id
			}
		});
		const data = await res.json();

		if (!data.success) {
			fail(500, { success: false });
		}

		return {
			success: true
		};
	},
	addProduct: async ({ request, fetch }) => {
		const form = await superValidate(request, zod(addProductFormSchema));

		if (!form.valid) {
			return message(withFiles(form), { text: 'Niepopranie podane dane', success: false });
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

		const res = await fetch('api/products', {
			body,
			method: 'POST'
		});

		const data: { success: boolean } = await res.json();

		if (!data.success) {
			return message(
				withFiles(form),
				{ text: 'Nie udało się dodać produktu. Coś poszło nie tak', success: false },
				{ status: 500 }
			);
		}

		return message(withFiles(form), { text: 'Pomyślnie dodano produkt.', success: true });
	}
};
