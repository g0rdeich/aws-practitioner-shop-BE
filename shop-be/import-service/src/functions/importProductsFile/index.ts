import { handlerPath } from '@libs/handler-resolver';

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			http: {
				method: 'get',
				path: 'import',
				cors: true,
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
	],
};