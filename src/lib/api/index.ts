import { Hono } from 'hono';
import { companies, products } from './routes';

export const api = new Hono()
	.basePath('/api')
	.get('/', (c) => c.text('Hello World!'))
	.route('/', products)
	.route('/', companies);

export type Api = typeof api;
