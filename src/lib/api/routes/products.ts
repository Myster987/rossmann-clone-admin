import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import * as schema from '@/db/schema';
import {
	deleteProduct,
	insertProduct,
	queryAllCompanyProducts,
	queryProductById
} from '@/db/queries';
import { generateId } from 'lucia';
import { addProductFormSchema, apiEditProductFormSchema } from '@/auth/form_schemas';
import { cloudinary, uploadImage } from '../cloudinary';

export const products = new Hono()
	.basePath('/products')
	.get('/:productId', async (c) => {
		try {
			const { productId } = c.req.param();
			const data = await queryProductById.get({ id: productId });
			return c.json({
				success: true,
				product: data
			});
		} catch (error) {
			console.log(error);
			return c.json({
				success: false,
				product: null
			});
		}
	})
	.get('/company/:companyId', async (c) => {
		try {
			const { companyId } = c.req.param();
			const data = await queryAllCompanyProducts.all({ companyId });
			return c.json({
				sucess: true,
				data: data
			});
		} catch (error) {
			console.log(error);
			return c.json({
				success: false,
				data: null
			});
		}
	})
	.post(
		'/',
		zValidator('form', addProductFormSchema, (result, c) => {
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
				const body = c.req.valid('form');
				const uploadData = await uploadImage(body.image);

				if (typeof uploadData.http_code != 'undefined' && uploadData.http_code != 200) {
					return c.json(
						{
							success: false
						},
						400
					);
				}

				const id = generateId(20);

				await insertProduct.run({
					id,
					companyId: body.companyId,
					name: body.name,
					price: body.price,
					description: body.description,
					ingredients: body.ingredients,
					imageKey: uploadData.public_id,
					imageUrl: uploadData.secure_url
				});

				return c.json({
					success: true
				});
			} catch (error) {
				console.log(error);

				return c.json({
					success: false
				});
			}
		}
	)
	.delete(
		'/',
		zValidator('json', z.object({ productIds: z.array(z.string()) }), (result, c) => {
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
				const body = c.req.valid('json');
				const products = await db
					.delete(schema.products)
					.where(inArray(schema.products.id, body.productIds))
					.returning();
				const fileDeleteResult: boolean = await cloudinary.api.delete_resources(
					products.map((product) => product.imageKey),
					(err, res) => {
						if (err) {
							return false;
						} else {
							return true;
						}
					}
				);
				if (!fileDeleteResult) {
					throw Error(
						`Something went wrong with deleting products (id: [${JSON.stringify(body.productIds)}])`
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
		}
	)
	.delete('/:productId', async (c) => {
		try {
			const { productId } = c.req.param();
			const product = await deleteProduct.get({ productId });
			if (typeof product == 'undefined') {
				throw Error(`Product (product id - ${product}) does not exist`);
			}
			const fileDeleteResult = await cloudinary.uploader.destroy(product.imageKey, {
				invalidate: true
			});
			if (!fileDeleteResult) {
				throw Error(`Something went wrong with deleting product (id: ${productId}) image`);
			}
			return c.json({
				success: true
			});
		} catch (error) {
			console.error(error);
			return c.json({
				success: false
			});
		}
	})
	.patch(
		'/:productId',
		zValidator('form', apiEditProductFormSchema, (result, c) => {
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
				const { productId } = c.req.param();
				const body = c.req.valid('form');
				const product = await queryProductById.get({ id: productId });
				const newProduct: Partial<schema.InsertProduct> = {};

				if (typeof product == 'undefined') {
					throw Error(`Product (product id - ${product}) does not exist`);
				}

				if (typeof body.image != 'undefined' && typeof body.image != 'string') {
					const fileDeleteResult = await cloudinary.uploader.destroy(product.imageKey, {
						invalidate: true
					});
					if (!fileDeleteResult) {
						throw Error(`Something went wrong with deleting product (id: ${productId}) image`);
					}

					const uploadData = await uploadImage(body.image);

					if (typeof uploadData.http_code != 'undefined' && uploadData.http_code != 200) {
						return c.json(
							{
								success: false
							},
							400
						);
					}
					newProduct.imageKey = uploadData.public_id;
					newProduct.imageUrl = uploadData.secure_url;
				}

				if (body.name != product.name) {
					newProduct['name'] = body.name;
				}
				if (body.price != product.price) {
					newProduct['price'] = body.price;
				}
				if (body.description != product.description) {
					newProduct['description'] = body.description;
				}
				if (body.ingredients != product.ingredients) {
					newProduct['price'] = body.price;
				}

				await db
					.update(schema.products)
					.set({
						...newProduct
					})
					.where(eq(schema.products.id, productId));

				return c.json({
					success: true
				});
			} catch (error) {
				return c.json({
					success: false
				});
			}
		}
	);
