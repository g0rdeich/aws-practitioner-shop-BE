import { formatJSONResponse } from '@libs/api-gateway';
import productsMock from '../../../productsMock/productsMock';

const getProductsList = async () => {
	try {
		// imitation of DB query to get all products
		const products = await new Promise((res) => {
			setTimeout(() => res(productsMock), 10);
		});
		return formatJSONResponse({
			statusCode: 200,
			products
		});
	} catch (err) {
		return {
			statusCode: 502,
			message: 'Internal server error'
		}
	}	
};

export const main = getProductsList;
