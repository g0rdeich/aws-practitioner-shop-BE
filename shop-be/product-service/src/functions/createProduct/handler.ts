import { formatJSONResponse } from '@libs/api-gateway';
import * as AWS from 'aws-sdk';
import {uuid} from 'uuidv4';
import {validateInput} from './inputValidator/inputValidator';
import {tableNames} from '../../../config';

const client = new AWS.DynamoDB.DocumentClient();

const createProduct = async (event) => {
	try {
		console.log('event: ', event);
		const productInfo = JSON.parse(event.body);
		const inputErrors = await validateInput(productInfo);
		if (inputErrors.length) {
			const response = {
				statusCode: 400,
				message: `Product has not been created. ${inputErrors.join(', ')}`,
			}
			return formatJSONResponse(response);
		}
		const id = uuid();
		const procuctsParams = {
			TableName: tableNames.productsTable,
			Item: {
				id,
				title: productInfo.title,
				description: productInfo.description,
				price: productInfo.price
			}
		};
		const stocksParams = {
			TableName: tableNames.stocksTable,
			Item: {
				product_id: id,
				count: productInfo.count
			}
		};
		await client.transactWrite({
			TransactItems: [
				{
					Put: {
						...procuctsParams
					}
				},
				{
					Put: {
						...stocksParams
					}
				}
			]
		}).promise();
		const response = {
			statusCode: 200,
			message: `Product has been created. Product id ${id}`
		}
		return formatJSONResponse(response);
	} catch (err) {
		return {
			statusCode: 500,
			message: 'Internal server error'
		}
	}
};

export const main = createProduct;