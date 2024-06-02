import { queryOrderProducts } from '@/db/queries';
import { Hono } from 'hono';

export const orders = new Hono().basePath('/orders').get('/:companyId', async (c) => {
	try {
		const { companyId } = c.req.param();

		const data = await queryOrderProducts.all({ companyId });

		return c.json({
			success: true,
			data
		});
	} catch (error) {
		console.log(c.req.path, error);
		return c.json(
			{
				success: false,
				data: null
			},
			500
		);
	}
});
