// See https://kit.svelte.dev/docs/types#app
import type { User, Session } from 'lucia';
import type { HonoClient } from '@/api/client';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
			session: Session | null;
			honoClient: HonoClient;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
