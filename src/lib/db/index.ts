import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { SECRET_DATABASE_URL, SECRET_DATABASE_AUTH_TOKEN } from '$env/static/private';
import * as schema from './schema';

export const client = createClient({
	url: SECRET_DATABASE_URL,
	authToken: SECRET_DATABASE_AUTH_TOKEN
});

export const db = drizzle(client, { schema });
