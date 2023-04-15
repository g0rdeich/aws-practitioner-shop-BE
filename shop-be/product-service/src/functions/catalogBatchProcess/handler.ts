import * as AWS from 'aws-sdk';
import {uuid} from 'uuidv4';
import {validateInput} from '../createProduct/inputValidator/inputValidator';
import {tableNames} from '../../../config';

const client = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

const catalogBatchProcess = async (event) => {
	try {
		const parsedProducts = event.Records.map(record => {
			return JSON.parse(record.body);
		});

		const validatedProducts = parsedProducts.filter(async product => {
			const errors = await validateInput(product);
			if (errors.length) {
				console.log(`Product ${product.title} has invalid format and will not be added to DB`);
				return false;
			}
			return true;
		});

		const productsToCreate = validatedProducts.map(product => {
			const id = uuid();
			const procuctsParams = {
				TableName: tableNames.productsTable,
				Item: {
					id,
					title: product.title,
					description: product.description,
					price: product.price
				}
			};
			const stocksParams = {
				TableName: tableNames.stocksTable,
				Item: {
					product_id: id,
					count: product.count
				}
			};
			return client.transactWrite({
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
		})

		await Promise.all(productsToCreate);

		await sns.publish({
			Subject: 'SQS-SNS-Lambda',
			Message: 'Product list has been updated',
			TopicArn: process.env.SNS_ARN
		}).promise();
	} catch (e) {
		console.log('catalogBatchProcess error: ', e);
	}	
}

export const main = catalogBatchProcess;