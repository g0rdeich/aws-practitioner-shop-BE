import { formatJSONResponse } from '@libs/api-gateway';
import productsMock from '../../../productsMock/productsMock';

const getProductsList = async (event) => {
	try {
		const requiredProductId = JSON.parse(event.pathParameters.productId);
		// imitation of DB query to get one product
		const product = await new Promise((res) => {
			setTimeout(() => {
				const productFromPromise = productsMock.find(product => product.id === requiredProductId) || null;
				res(productFromPromise);
			}, 10);
		});
		const response = product ? {
			statusCode: 200,
			product
		} : {
			statusCode: 404,
			message: `Product with productId #${requiredProductId} is not found`
		}
		return formatJSONResponse(response);
	} catch (err) {
		return {
			statusCode: 500,
			message: 'Internal server error'
		}
	}
};

export const main = getProductsList;