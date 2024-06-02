import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { eq, inArray } from 'drizzle-orm';
import { db } from '@/db';
import * as schema from '@/db/schema';
import {
	deleteImages,
	deleteImagesOfProduct,
	deleteProduct,
	insertProduct,
	queryAllCompanyProducts,
	queryAllCompanyProductsWithImages,
	queryProductById,
	queryProductByIdWithImages
} from '@/db/queries';
import { generateId } from 'lucia';
import { addProductFormSchema, editProductFormSchema } from '@/auth/form_schemas';
import { deleteImagesFromCloudinary, uploadMultipleImages } from '../cloudinary';

const withImages = new Hono()
	.get('/:productId', async (c) => {
		try {
			const { productId } = c.req.param();
			const data = await queryProductByIdWithImages.get({ id: productId });
			return c.json({
				success: true,
				data
			});
		} catch (error) {
			console.log(error);
			return c.json({
				success: false,
				data: null
			});
		}
	})
	.get('/company/:companyId', async (c) => {
		try {
			const { companyId } = c.req.param();
			const data = await queryAllCompanyProductsWithImages.all({ companyId });
			return c.json({
				sucess: true,
				data
			});
		} catch (error) {
			console.log(error);
			return c.json({
				success: false,
				data: null
			});
		}
	});

export const products = new Hono()
	.basePath('/products')
	.route('/withImages', withImages)
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
	.post('/', async (c) => {
		try {
			interface Body extends Omit<z.infer<typeof addProductFormSchema>, 'images'> {
				'images[]': File[];
			}
			const body = (await c.req.parseBody({ all: true })) as unknown as Body;
			if (!Array.isArray(body['images[]'])) {
				body['images[]'] = [body['images[]']];
			}
			const uploadData = await uploadMultipleImages(body['images[]']);

			if (!uploadData) {
				return c.json(
					{
						success: false
					},
					400
				);
			}

			const productId = generateId(20);

			const productInsertionResult = await insertProduct.run({
				id: productId,
				companyId: body.companyId,
				name: body.name,
				price: body.price,
				quantity: body.quantity,
				category: body.category,
				description: body.description,
				ingredients: body.ingredients,
				featured: Number(body.featured),
				archived: Number(body.archived)
			});

			if (productInsertionResult.rowsAffected == 0) {
				throw Error('Something went wrong when inserting product');
			}

			await db.insert(schema.images).values(
				uploadData.map((image) => {
					return {
						id: generateId(20),
						imagePublicId: image.public_id,
						imageUrl: image.secure_url,
						productId: productId
					};
				})
			);

			return c.json({
				success: true
			});
		} catch (error) {
			console.log(error);

			return c.json({
				success: false
			});
		}
	})
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

				const deleteImagesQueryResult = (await deleteImages(body.productIds)).flat();

				const fileDeleteResult = await deleteImagesFromCloudinary(
					deleteImagesQueryResult.map((image) => image.imagePublicId)
				);

				if (!fileDeleteResult) {
					throw Error(
						`Something went wrong with deleting products (id: [${JSON.stringify(body.productIds)}])`
					);
				}

				await db.delete(schema.products).where(inArray(schema.products.id, body.productIds));

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

			const imagesToDelete = await deleteImagesOfProduct.all({ productId });
			const product = await deleteProduct.get({ id: productId });

			if (typeof product == 'undefined') {
				throw Error(`Product (product id - ${product}) does not exist`);
			}

			const fileDeleteResult = await deleteImagesFromCloudinary(
				imagesToDelete.map((image) => image.imagePublicId)
			);

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
	.patch('/:productId', async (c) => {
		try {
			interface Body extends Omit<z.infer<typeof editProductFormSchema>, 'images'> {
				'images[]': File[];
			}
			const { productId } = c.req.param();
			const body = (await c.req.parseBody({ all: true })) as unknown as Body;
			if (!Array.isArray(body['images[]'])) {
				body['images[]'] = [body['images[]']];
			}
			const product = await queryProductById.get({ id: productId });
			const newProduct: Partial<schema.InsertProduct> = {};

			if (typeof product == 'undefined') {
				throw Error(`Product (product id - ${product}) does not exist`);
			}

			if (typeof body['images[]'] != 'undefined' && typeof body['images[]'] != 'string') {
				const imagesToDelete = await deleteImagesOfProduct.all({ productId });

				const fileDeleteResult = await deleteImagesFromCloudinary(
					imagesToDelete.map((image) => image.imagePublicId)
				);
				if (!fileDeleteResult) {
					throw Error(`Something went wrong with deleting product (id: ${productId}) image`);
				}

				const uploadData = await uploadMultipleImages(body['images[]']);

				if (!uploadData) {
					return c.json(
						{
							success: false
						},
						400
					);
				}
				await db.insert(schema.images).values(
					uploadData.map((image) => {
						return {
							id: generateId(20),
							imagePublicId: image.public_id,
							imageUrl: image.secure_url,
							productId: productId
						};
					})
				);
			}

			if (body.name != product.name) {
				newProduct['name'] = body.name;
			}
			if (body.price != product.price) {
				newProduct['price'] = body.price;
			}
			if (body.quantity != product.quantity) {
				newProduct['quantity'] = body.quantity;
			}
			if (body.category != product.category) {
				newProduct['category'] = body.category;
			}
			if (body.description != product.description) {
				newProduct['description'] = body.description;
			}
			if (body.ingredients != product.ingredients) {
				newProduct['price'] = body.price;
			}
			if (Number(body.featured) != product.featured) {
				newProduct['featured'] = Number(body.featured);
			}
			if (Number(body.archived) != product.archived) {
				newProduct['archived'] = Number(body.archived);
			}

			if (Object.keys(newProduct).length != 0) {
				await db
					.update(schema.products)
					.set({
						...newProduct
					})
					.where(eq(schema.products.id, productId));
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
	});
