import { handlerPath } from '@libs/handler-resolver';
import config from '../../../config';

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			http: {
				method: 'get',
				path: 'import',
				cors: true,
				authorizer: config.authorizer.basic,
				responses: {
					200: {
						description: 'Success',
						bodyType: 'SignedUrl'
					},
					500: {
						description: 'Server error'
					}
				}
			},
		},
	]
};