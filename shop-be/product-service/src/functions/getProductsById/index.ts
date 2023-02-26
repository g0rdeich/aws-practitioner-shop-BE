import { handlerPath } from '@libs/handler-resolver';

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			http: {
				method: 'get',
				path: 'products/{productId}',
				cors: true,
				responses: {
					200: {
						description: 'Success',
						bodyType: 'Product'
					},
					404: {
						description: 'Product not found',
					},
					502: {
						description: 'Server error'
					}
				}
			},
		},
	],
};