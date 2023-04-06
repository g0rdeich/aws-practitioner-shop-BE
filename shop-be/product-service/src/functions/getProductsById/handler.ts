import {formatJSONResponse} from '@libs/api-gateway';
import * as AWS from 'aws-sdk';
import {tableNames} from '../../../config';
import {get} from 'lodash';

const client = new AWS.DynamoDB.DocumentClient();

const getProductsList = async (event) => {
	try {
		console.log('event: ', event);
		const requiredProductId = event.pathParameters.productId;
		const productsTableResponse = await client.get({
			TableName: tableNames.productsTable,
			Key: {
				id: requiredProductId
			}
		}).promise();
		const stocksTableResponse = await client.get({
			TableName: tableNames.stocksTable,
			Key: {
				product_id: requiredProductId
			}
		}).promise();

		if (!productsTableResponse.Item) {
			return formatJSONResponse({
				statusCode: 404,
				message: `Product with productId #${requiredProductId} is not found`
			})
		}

		return formatJSONResponse({
			statusCode: 200,
			product: {
				...productsTableResponse.Item,
				count: get(stocksTableResponse, 'Item.count', 0) // in case stock info is not found
			}
		});
	} catch (err) {
		return {
			statusCode: 500,
			message: 'Internal server error'
		}
	}
};

export const main = getProductsList;