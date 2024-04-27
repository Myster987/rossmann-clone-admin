import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { user, honoClient } }) => {
	const res = await honoClient.api.companies[':userId'].$get({
		param: { userId: user?.id || '' }
	});
	const { data } = await res.json();
	return {
		companies: data
	};
};
