import { eq, sql } from 'drizzle-orm';
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
	.onConflictDoNothing({ target: schema.users.email })
	.returning()
	.prepare();

export const insertCompany = db
	.insert(schema.companies)
	.values({
		id: sql.placeholder('id'),
		name: sql.placeholder('name'),
		userId: sql.placeholder('userId')
	})
	.returning()
	.prepare();

export const deleteCompany = db
	.delete(schema.companies)
	.where(eq(schema.companies.id, sql.placeholder('id')))
	.returning()
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

export const queryProductById = db
	.select()
	.from(schema.products)
	.where(eq(schema.products.id, sql.placeholder('id')))
	.prepare();

export const insertProduct = db
	.insert(schema.products)
	.values({
		id: sql.placeholder('id'),
		companyId: sql.placeholder('companyId'),
		name: sql.placeholder('name'),
		price: sql.placeholder('price'),
		description: sql.placeholder('description'),
		ingredients: sql.placeholder('ingredients'),
		imageKey: sql.placeholder('imageKey'),
		imageUrl: sql.placeholder('imageUrl')
	})
	.prepare();

export const deleteProduct = db
	.delete(schema.products)
	.where(eq(schema.products.id, sql.placeholder('productId')))
	.returning()
	.prepare();
