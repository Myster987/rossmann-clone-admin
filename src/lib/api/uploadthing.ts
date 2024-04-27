import { SECRET_UPLOADTHING_SECRET } from '$env/static/private';
import { createUploadthing, UTApi, type FileRouter } from 'uploadthing/server';

const f = createUploadthing();

export const uploadRouter = {
	imageUploader: f({
		image: {
			maxFileCount: 1
		}
	}).onUploadComplete((data) => {
		data.file.url;
		console.log('upload completed', data);
	})
} satisfies FileRouter;

export const utapi = new UTApi({
	apiKey: SECRET_UPLOADTHING_SECRET
});

export type OurFileRouter = typeof uploadRouter;
