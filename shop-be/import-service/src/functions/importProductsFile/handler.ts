import {formatJSONResponse} from '@libs/api-gateway';
import * as AWS from 'aws-sdk';
import config from '../../../config';

const importProductsFile = async (event) => {
	const {region, s3Bucket} = config;
	const s3Client = new AWS.S3({region});
	const fileName = event.queryStringParameters.fileName;
	const catalogPath = `${s3Bucket.folders.uploaded}/${fileName}`;
	const params = {
		Bucket: s3Bucket.name,
		Key: catalogPath,
		Expires: s3Bucket.expires,
		ContentType: 'text/csv'
	};

	try {
		const signedUrl = await s3Client.getSignedUrlPromise('putObject', params);

		return formatJSONResponse({
			statusCode: 200,
			signedUrl
		})
	} catch (err) {
		return {
			statusCode: 500,
			message: 'Internal server error'
		}
	}	
}

export const main = importProductsFile;