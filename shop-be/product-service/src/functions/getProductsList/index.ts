import { handlerPath } from '@libs/handler-resolver';

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			http: {
				method: 'get',
				path: 'products',
				cors: true,
				responses: {
					200: {
						description: 'Success',
						bodyType: 'Products'
					},
					500: {
						description: 'Server error'
					}
				}
			},
		},
	],
};