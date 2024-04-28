import {
	SECRET_CLOUDINARY_CLOUD_NAME,
	SECRET_CLOUDINARY_API_KEY,
	SECRET_CLOUDINARY_API_SECRET
} from '$env/static/private';
import { v2 as cloudinary, type UploadApiErrorResponse, type UploadApiResponse } from 'cloudinary';

cloudinary.config({
	cloud_name: SECRET_CLOUDINARY_CLOUD_NAME,
	api_key: SECRET_CLOUDINARY_API_KEY,
	api_secret: SECRET_CLOUDINARY_API_SECRET,
	secure: true
});

async function uploadImage(image: File) {
	const arrayBuffer = await image.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const uploadImage = new Promise<UploadApiErrorResponse | UploadApiResponse>((resolve, reject) => {
		cloudinary.uploader
			.upload_stream({ format: 'webp' }, (error, result) => {
				if (error || !result) {
					console.error(error);
					console.log(`Error in uploadImage: result = ${JSON.stringify(result)}`);

					reject(error);
				} else {
					resolve(result);
				}
			})
			.end(buffer);
	});
	return uploadImage;
}

export { cloudinary, uploadImage };
