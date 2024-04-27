import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/db/schema.ts',
	out: 'drizzle',
	driver: 'turso',
	dbCredentials: {
		url: process.env.SECRET_DATABASE_URL!,
		authToken: process.env.SECRET_DATABASE_AUTH_TOKEN
	},
	verbose: true,
	strict: true
});
