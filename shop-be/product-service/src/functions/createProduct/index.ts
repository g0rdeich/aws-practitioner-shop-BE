import { handlerPath } from '@libs/handler-resolver';

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			http: {
				method: 'post',
				path: 'products',
				cors: true,
				responses: {
					200: {
						description: 'Success',
						bodyType: 'Product'
					},
					400: {
						description: 'Bad request',
					},
					500: {
						description: 'Server error'
					}
				}
			},
		},
	],
};