import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { SECRET_DATABASE_URL, SECRET_DATABASE_AUTH_TOKEN } from '$env/static/private';
import * as schema from './schema';

export const client = createClient({
	url: SECRET_DATABASE_URL,
	authToken: SECRET_DATABASE_AUTH_TOKEN
});
// export const client = createClient({
// 	url: 'http://127.0.0.1:8080'
// });

export const db = drizzle(client, { schema });

// const res = await db.run(sql`CREATE VIRTUAL TABLE products_fts USING fts5 (product_id, product_name);`)
// const res = await db.run(sql`	CREATE TRIGGER insert_product_fts after insert on products begin INSERT INTO products_fts (product_id, product_name) VALUES (NEW.id, NEW.name); end;`);
// const res = await db.run(
// 	sql`	CREATE TRIGGER update_product_fts after UPDATE on products begin UPDATE products_fts SET product_id = NEW.id, product_name = NEW.name WHERE product_id = NEW.id; end;`
// );
// const res = await db.run(
// 	sql`	CREATE TRIGGER delete_product_fts after DELETE on products begin DELETE FROM products_fts WHERE product_id = OLD.id; end;`
// );
// console.log(res);
