import { z } from 'zod';
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { generateId } from 'lucia';
import {
	queryUsersCompanies,
	queryAllCompanyProductsWithImages,
	insertCompany,
	deleteCompany
} from '@/db/queries';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { editCompanyFormSchema } from '@/auth/form_schemas';
import { cloudinary, deleteImagesFromCloudinary } from '../cloudinary';

const postCompanySchema = z.object({
	name: z.string(),
	userId: z.string()
});

export const companies = new Hono()
	.basePath('/companies')
	.post(
		'/',
		zValidator('json', postCompanySchema, (result, c) => {
			if (!result.success) {
				return c.json(
					{
						success: false
					},
					400
				);
			}
		}),
		async (c) => {
			try {
				const id = generateId(20);
				const body = (await c.req.json()) as unknown as z.infer<typeof postCompanySchema>;
				await insertCompany.run({ id, ...body });
				return c.json({
					success: true,
					companyId: id
				});
			} catch (error) {
				return c.json(
					{
						success: false,
						companyId: null
					},
					500
				);
			}
		}
	)
	.patch(
		'/:companyId',
		zValidator('json', editCompanyFormSchema, (result, c) => {
			if (!result.success) {
				return c.json(
					{
						success: false
					},
					400
				);
			}
		}),
		async (c) => {
			try {
				const { companyId } = c.req.param();
				const body = c.req.valid('json');

				await db
					.update(schema.companies)
					.set({
						name: body.name
					})
					.where(eq(schema.companies.id, companyId));

				return c.json({
					success: true
				});
			} catch (error) {
				console.log(error);
				return c.json(
					{
						success: false
					},
					500
				);
			}
		}
	)
	.delete('/:companyId', async (c) => {
		try {
			const { companyId } = c.req.param();

			const products = await queryAllCompanyProductsWithImages.all({ companyId });
			console.log(products);

			const res = await deleteImagesFromCloudinary(
				products.map(({ images }) => images.imagePublicId)
			);

			if (!res) {
				return c.json(
					{
						success: false
					},
					500
				);
			}
			const queryResult = await deleteCompany.run({ companyId });
			if (!queryResult) {
				return c.json(
					{
						success: false
					},
					400
				);
			}

			return c.json({
				success: true
			});
		} catch (error) {
			console.log(error);
			return c.json(
				{
					success: false
				},
				500
			);
		}
	})
	.get('/:userId', async (c) => {
		try {
			const { userId } = c.req.param();
			const data = await queryUsersCompanies.all({ userId });
			return c.json({
				data,
				success: true
			});
		} catch (error) {
			return c.json(
				{
					data: null,
					success: false
				},
				500
			);
		}
	});
