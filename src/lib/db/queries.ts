import { eq, inArray, sql } from 'drizzle-orm';
import { db } from '.';
import * as schema from './schema';

export const checkIfUserExists = db
	.select()
	.from(schema.users)
	.where(eq(schema.users.email, sql.placeholder('email')))
	.prepare();

export const insertUser = db
	.insert(schema.users)
	.values({
		id: sql.placeholder('id'),
		email: sql.placeholder('email'),
		password: sql.placeholder('password')
	})
	.onConflictDoNothing()
	.prepare();

export const queryUsersCompanies = db
	.select()
	.from(schema.companies)
	.where(eq(schema.companies.userId, sql.placeholder('userId')))
	.prepare();

export const queryAllCompanyProducts = db
	.select()
	.from(schema.products)
	.where(eq(schema.products.companyId, sql.placeholder('companyId')))
	.prepare();

export const queryAllCompanyProductsWithImages = db
	.select()
	.from(schema.products)
	.where(eq(schema.products.companyId, sql.placeholder('companyId')))
	.innerJoin(schema.images, eq(schema.products.id, schema.images.productId))
	.prepare();

export const queryProductById = db
	.select()
	.from(schema.products)
	.where(eq(schema.products.id, sql.placeholder('id')))
	.prepare();

export const queryProductByIdWithImages = db
	.select()
	.from(schema.products)
	.where(eq(schema.products.id, sql.placeholder('id')))
	.innerJoin(schema.images, eq(schema.products.id, schema.images.productId))
	.prepare();

export const insertProduct = db
	.insert(schema.products)
	.values({
		id: sql.placeholder('id'),
		companyId: sql.placeholder('companyId'),
		name: sql.placeholder('name'),
		price: sql.placeholder('price'),
		category: sql.placeholder('category'),
		description: sql.placeholder('description'),
		ingredients: sql.placeholder('ingredients')
	})
	.prepare();

export const deleteProduct = db
	.delete(schema.products)
	.where(eq(schema.products.id, sql.placeholder('id')))
	.returning()
	.prepare();

// export const deleteProducts = db
// 	.delete(schema.products)
// 	.where(inArray(schema.products.id, sql.placeholder('productIds')))
// 	.returning()
// 	.prepare();

export async function deleteImages(productIds: string[]) {
	return Promise.all(productIds.map((productId) => deleteImagesOfProduct.all({ productId })));
}

export const deleteImagesOfProduct = db
	.delete(schema.images)
	.where(eq(schema.images.productId, sql.placeholder('productId')))
	.returning()
	.prepare();

export const insertCompany = db
	.insert(schema.companies)
	.values({
		id: sql.placeholder('id'),
		name: sql.placeholder('name'),
		userId: sql.placeholder('userId')
	})
	.prepare();

export const deleteCompany = db
	.delete(schema.companies)
	.where(eq(schema.companies.id, sql.placeholder('companyId')))
	.returning()
	.prepare();
