import * as AWS from 'aws-sdk';
import config from '../../../config';

const csv = require('csv-parser');

const importProductsFile = async (event) => {
	const {region, s3Bucket} = config;
	const s3Client = new AWS.S3({region});
	const sqsClient = new AWS.SQS();

	for (const record of event.Records) {
		const params = {
			Bucket: s3Bucket.name,
			Key: record.s3.object.key
		};

		try {
			await new Promise((resolve, reject) => {
				const s3Stream = s3Client.getObject(params).createReadStream();

				s3Stream
					.pipe(csv())
					.on('data', data => {
						const message = JSON.stringify(data);
						sqsClient.sendMessage({
							QueueUrl: config.sqs.catalogItemsQueue.url,
							MessageBody: message
						}, () => {
							console.log('sent following sqs message: ', message);
						})						
					})
					.on('error', err => {
						reject(err);
					})
					.on('end', async () => {
						await s3Client.copyObject({
							Bucket: s3Bucket.name,
							CopySource: `${s3Bucket.name}/${record.s3.object.key}`,
							Key: record.s3.object.key.replace(s3Bucket.folders.uploaded, s3Bucket.folders.parsed)
						}).promise();
			
						await s3Client.deleteObject({
							Bucket: s3Bucket.name,
							Key: record.s3.object.key
						}).promise();

						console.log(`File ${record.s3.object.key} is parsed and replaced to "${s3Bucket.folders.parsed}" folder`);

						resolve('end');
					})
			});
		} catch (err) {
			console.log('err: ', err);
		}
	}
}

export const main = importProductsFile;