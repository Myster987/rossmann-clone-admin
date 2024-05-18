import { z } from 'zod';

export const signUpFormSchema = z
	.object({
		email: z
			.string({ required_error: 'Email jest wymagany' })
			.min(3, 'Email musi mieć co najmnej 3 znaki')
			.max(64, 'Email nie może mieć więcej niż 64 znaki')
			.email('Niepoprawny email'),
		password: z
			.string({ required_error: 'Hasło jest wymagane' })
			.min(6, 'Hasło musi mieć co najmniej 6 znaków')
			.max(255, 'Hasło nie może mieć więcej niż 255 znaków')
			.trim(),
		confirmPassword: z.string({ required_error: 'Potwierdzenie hasło jest wymagane' }).trim()
	})
	.superRefine((val, ctx) => {
		if (val.password !== val.confirmPassword) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Hasło i potwierdzenia hasła się nie zgadzają',
				path: ['confirmPassword']
			});
		}
	});
export type SignUpFormSchema = typeof signUpFormSchema;

export const signInFormSchema = z.object({
	email: z
		.string({ required_error: 'Email jest wymagany' })
		.min(3, 'Email musi mieć co najmnej 3 znaki')
		.max(64, 'Email nie może mieć więcej niż 64 znaki')
		.email('Niepoprawny email'),
	password: z
		.string({ required_error: 'Hasło jest wymagane' })
		.min(6, 'Hasło musi mieć co najmniej 6 znaków')
		.max(255, 'Hasło nie może mieć więcej niż 255 znaków')
		.trim()
});
export type SignInFormSchema = typeof signInFormSchema;

export const createCompanyFormSchema = z.object({
	name: z
		.string({ required_error: 'Nazwa jest wymagana' })
		.min(3, 'Nazwa marki musi zawierać co najmniej 3 litery')
		.max(600, 'Nazwa firmy nie może być dłuższa niż 600 liter')
		.trim()
});
export type CreateCompanyFormSchema = typeof createCompanyFormSchema;

export const editCompanyFormSchema = createCompanyFormSchema;
export type EditCompanyFormSchema = typeof editCompanyFormSchema;

export const addProductFormSchema = z
	.object({
		companyId: z.string().trim(),
		name: z.string({ required_error: 'Nazwa jest wymagana' }).min(1, 'Brak nazwy').trim(),
		price: z.coerce
			.number({ required_error: 'Cena jest wymagana' })
			.lte(999999, 'Cena jest zbyt duża')
			.positive('Cena musi być większa od 0'),
		category: z
			.string({ required_error: 'Kategoria jest wymagana' })
			.min(1, 'Brak kategorii')
			.trim(),
		description: z.string({ required_error: 'Opis jest wymagany' }).min(1, 'Brak opisu').trim(),
		ingredients: z.string({ required_error: 'Skład jest wymagany' }).min(1, 'Brak składu').trim(),
		images: z
			.instanceof(File, { message: 'Zdjęcie jest wymagane' })
			.refine((file) => file.size > 0, 'Zdjęcie musi mieć więcej niż 0 kb')
			.array()
			.nonempty({ message: 'Minimum jedno zdjęcie jest wymagane' })
			.max(5, 'Maksimum 5 zdjęć'),
		featured: z.coerce
			.number()
			.refine((value) => value == 0 || value == 1, {
				message: 'Pole jest wymagane'
			})
			.default(0),
		archived: z.coerce
			.number()
			.refine((value) => value == 0 || value == 1, {
				message: 'Pole jest wymagane'
			})
			.default(0)
	})
	.superRefine((val, ctx) => {
		if (val.archived == 1 && val.featured == 1) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Produkt nie może być jednocześnie wyróżniony i zarchiwizowany.',
				path: ['featured']
			});
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Produkt nie może być jednocześnie wyróżniony i zarchiwizowany.',
				path: ['archived']
			});
		}
		if (val.archived == 0 && val.featured == 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Wymagana jedna z opcji.',
				path: ['featured']
			});
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Wymagana jedna z opcji.',
				path: ['archived']
			});
		}
	});
export type AddProductFormSchema = typeof addProductFormSchema;

export const editProductFormSchema = z
	.object({
		name: z.string({ required_error: 'Nazwa jest wymagana' }).min(1, 'Brak nazwy').trim(),
		price: z.coerce
			.number({ required_error: 'Cena jest wymagana' })
			.lte(999999, 'Cena jest zbyt duża')
			.positive('Cena musi być większa od 0'),
		category: z
			.string({ required_error: 'Kategoria jest wymagana' })
			.min(1, 'Brak kategorii')
			.trim(),
		description: z.string({ required_error: 'Opis jest wymagany' }).min(1, 'Brak opisu').trim(),
		ingredients: z.string({ required_error: 'Skład jest wymagany' }).min(1, 'Brak składu').trim(),
		images: z
			.instanceof(File, { message: 'Zdjęcie jest wymagane' })
			.refine((file) => file.size > 0, 'Zdjęcie musi mieć więcej niż 0 kb')
			.array()
			.nonempty({ message: 'Minimum jedno zdjęcie jest wymagane' })
			.max(5, 'Maksimum 5 zdjęć'),
		featured: z.coerce
			.number()
			.refine((value) => value == 0 || value == 1, {
				message: 'Pole jest wymagane'
			})
			.default(0),
		archived: z.coerce
			.number()
			.refine((value) => value == 0 || value == 1, {
				message: 'Pole jest wymagane'
			})
			.default(0)
	})
	.partial()
	.superRefine((val, ctx) => {
		if (val.archived == 1 && val.featured == 1) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Produkt nie może być jednocześnie wyróżniony i zarchiwizowany.',
				path: ['featured']
			});
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Produkt nie może być jednocześnie wyróżniony i zarchiwizowany.',
				path: ['archived']
			});
		}
		if (val.archived == 0 && val.featured == 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Wymagana jedna z opcji.',
				path: ['featured']
			});
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Wymagana jedna z opcji.',
				path: ['archived']
			});
		}
	});
export type EditProductFormSchema = typeof editProductFormSchema;

export const apiEditProductFormSchema = z
	.object({
		name: z.string({ required_error: 'Nazwa jest wymagana' }).min(1, 'Brak nazwy').trim(),
		price: z.coerce
			.number({ required_error: 'Cena jest wymagana' })
			.lte(999999, 'Cena jest zbyt duża')
			.positive('Cena musi być większa od 0'),
		category: z
			.string({ required_error: 'Kategoria jest wymagana' })
			.min(1, 'Brak kategorii')
			.trim(),
		description: z.string({ required_error: 'Opis jest wymagany' }).min(1, 'Brak opisu').trim(),
		ingredients: z.string({ required_error: 'Skład jest wymagany' }).min(1, 'Brak składu').trim(),
		images: z.union([
			z.string(),
			z
				.instanceof(File, { message: 'Zdjęcie jest wymagane' })
				.refine((file) => file.size > 0, 'Zdjęcie musi mieć więcej niż 0 kb')
				.array()
				.max(5, 'Maksimum 5 zdjęć')
		]),
		featured: z.coerce
			.number()
			.refine((value) => value == 0 || value == 1, {
				message: 'Pole jest wymagane'
			})
			.default(0),
		archived: z.coerce
			.number()
			.refine((value) => value == 0 || value == 1, {
				message: 'Pole jest wymagane'
			})
			.default(0)
	})
	.partial()
	.superRefine((val, ctx) => {
		if (val.archived == 1 && val.featured == 1) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Produkt nie może być jednocześnie wyróżniony i zarchiwizowany.',
				path: ['featured']
			});
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Produkt nie może być jednocześnie wyróżniony i zarchiwizowany.',
				path: ['archived']
			});
		}
		if (val.archived == 0 && val.featured == 0) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Wymagana jedna z opcji.',
				path: ['featured']
			});
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Wymagana jedna z opcji.',
				path: ['archived']
			});
		}
	});
