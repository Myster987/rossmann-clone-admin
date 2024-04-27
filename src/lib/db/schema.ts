import { sql, type InferSelectModel, type InferInsertModel } from 'drizzle-orm';
import { sqliteTable, text, real, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
	id: text('id').notNull().primaryKey(),
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	email: text('email').notNull().unique(),
	password: text('password').notNull()
});
export type SelectUsers = InferSelectModel<typeof users>;
export type InsertUsers = InferInsertModel<typeof users>;

export const sessions = sqliteTable('sessions', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	expiresAt: integer('expires_at').notNull()
});
export type SelectSessions = InferSelectModel<typeof sessions>;
export type InsertSessions = InferInsertModel<typeof sessions>;

export const companies = sqliteTable('companies', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	createdAt: text('created_at')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	name: text('name').notNull()
});
export type SelectCompanies = InferSelectModel<typeof companies>;
export type InsertCompanies = InferInsertModel<typeof companies>;

export const products = sqliteTable('products', {
	id: text('id').primaryKey(),
	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
	companyId: text('company_id')
		.notNull()
		.references(() => companies.id, {
			onDelete: 'cascade'
		}),
	name: text('name').notNull(),
	price: real('price').notNull(),
	description: text('description').notNull(),
	ingredients: text('ingredients').notNull(),
	imageKey: text('image_key').notNull(),
	imageUrl: text('image_url').notNull()
});
export type SelectProduct = InferSelectModel<typeof products>;
export type InsertProduct = InferInsertModel<typeof products>;

export const cart = sqliteTable('cart', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	addedAt: text('added_at').default(sql`CURRENT_TIMESTAMP`),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	companyId: text('company_id').references(() => companies.id, {
		onDelete: 'set null'
	})
});
export type SelectCart = InferSelectModel<typeof cart>;
export type InsertCart = InferInsertModel<typeof cart>;

export const favorite = sqliteTable('favorite', {
	id: integer('id').primaryKey(),
	addedAt: text('added_at').default(sql`CURRENT_TIMESTAMP`),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	companyId: text('company_id').references(() => companies.id, {
		onDelete: 'set null'
	})
});
export type SelectFavorite = InferSelectModel<typeof favorite>;
export type InsertFavorite = InferInsertModel<typeof favorite>;

export const orders = sqliteTable('orders', {
	id: text('id').primaryKey(),
	createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
	fulfilledAt: text('fulfilled_at'),
	status: integer('status', { mode: 'boolean' }).default(false),
	userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
	productId: text('product_id')
		.notNull()
		.references(() => products.id, { onDelete: 'cascade' }),
	amount: real('amount').notNull()
});
export type SelectOrders = InferSelectModel<typeof orders>;
export type InsertOrders = InferInsertModel<typeof orders>;
