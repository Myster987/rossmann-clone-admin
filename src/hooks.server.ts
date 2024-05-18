import { createHonoClient } from '@/api/client';
import { authenticateUser } from '@/auth/handlers';
import { handleLoginRedirect } from '@/auth/handlers';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const { user, session } = await authenticateUser(event.cookies);
	event.locals.user = user;
	event.locals.session = session;
	event.locals.honoClient = createHonoClient(event.fetch);

	if (
		(event.url.pathname.startsWith('/dashboard') || event.url.pathname.startsWith('/api')) &&
		!user
	) {
		redirect(302, handleLoginRedirect(event));
	}

	return resolve(event);
};
