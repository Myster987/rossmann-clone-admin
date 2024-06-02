import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { companies, orders, products } from './routes';

export const api = new Hono()
	.use(logger())
	.basePath('/api')
	.get('/', (c) => c.text('Hello World!'))
	.route('/', products)
	.route('/', companies)
	.route('/', orders);

export type Api = typeof api;
