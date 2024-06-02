import { Hono } from 'hono';
import { companies, orders, products } from './routes';

export const api = new Hono()
	.basePath('/api')
	.get('/', (c) => c.text('Hello World!'))
	.route('/', products)
	.route('/', companies)
	.route('/', orders);

export type Api = typeof api;
