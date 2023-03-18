import { handlerPath } from '@libs/handler-resolver';
import config from '../../../config';

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			s3: {
				bucket: config.s3Bucket.name,
				event: 's3:ObjectCreated:*',
				rules: [
					{
						prefix: `${config.s3Bucket.folders.uploaded}/`
					}
				],
				existing: true
			}
		},
	],
};