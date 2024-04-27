import { Hono } from 'hono';
import { SECRET_UPLOADTHING_APP_ID, SECRET_UPLOADTHING_SECRET } from '$env/static/private';
import { dev } from '$app/environment';
import { createRouteHandler } from 'uploadthing/server';
import { uploadRouter } from '../uploadthing';

const { GET, POST } = createRouteHandler({
	router: uploadRouter,
	config: {
		uploadthingSecret: SECRET_UPLOADTHING_SECRET,
		uploadthingId: SECRET_UPLOADTHING_APP_ID,
		isDev: dev
	}
});

export const uploadthingRoute = new Hono()
	.basePath('/uploadthing')
	.post('/', (c) => POST(c.req.raw))
	.get('/', (c) => GET(c.req.raw));
