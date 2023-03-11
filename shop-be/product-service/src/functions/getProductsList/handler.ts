import {formatJSONResponse} from '@libs/api-gateway';
import * as AWS from 'aws-sdk';
import {tableNames} from '../../../config';
import {get} from 'lodash';

const client = new AWS.DynamoDB.DocumentClient();

const getProductsList = async (event) => {
	try {
		console.log('event: ', event);
		const productsTableResponse = await client.scan({TableName: tableNames.productsTable}).promise();
		const stocksTableResponse = await client.scan({TableName: tableNames.stocksTable}).promise();
		console.log('prod: ', productsTableResponse);
		console.log('stock: ', stocksTableResponse);
		const products = productsTableResponse.Items.map((product) => {
			const stockInfo = stocksTableResponse.Items.find(stock => stock.product_id === product.id);
			return {
				...product,
				count: get(stockInfo, 'count', 0) // in case if stockInfo is not found for some reason
			}
		});
		return formatJSONResponse({
			statusCode: 200,
			products
		});
	} catch (err) {
		return {
			statusCode: 500,
			message: 'Internal server error'
		}
	}	
};

export const main = getProductsList;
