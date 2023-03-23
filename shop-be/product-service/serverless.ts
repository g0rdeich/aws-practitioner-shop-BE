import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';
import {tableNames} from './config';

const serverlessConfiguration: AWS = {
	service: 'product-service',
	frameworkVersion: '3',
	plugins: ['serverless-auto-swagger', 'serverless-esbuild'],
	provider: {
		name: 'aws',
		runtime: 'nodejs14.x',
		region: 'eu-west-1',
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true,
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
			NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
			SQS_URL: { Ref: 'catalogItemsQueue' },
			SNS_ARN: { Ref: 'createProductTopic' }
		},
		iam: {
			role: {
				statements: [
					{
						Effect: 'Allow',
						Action: 'sqs:*',
						Resource: { "Fn::GetAtt": ['catalogItemsQueue', 'Arn'] },
					},
					{
						Effect: 'Allow',
						Action: 'sns:*',
						Resource: { Ref: 'createProductTopic' },
					},
					{
						Effect: 'Allow',
						Action: [
							'dynamodb:DescribeTable',
							'dynamodb:Query',
							'dynamodb:Scan',
							'dynamodb:GetItem',
							'dynamodb:PutItem',
							'dynamodb:UpdateItem',
							'dynamodb:DeleteItem',
						],
						Resource: `arn:aws:dynamodb:eu-west-1:*:table/${tableNames.productsTable}`,
					},
					{
						Effect: 'Allow',
						Action: [
							'dynamodb:DescribeTable',
							'dynamodb:Query',
							'dynamodb:Scan',
							'dynamodb:GetItem',
							'dynamodb:PutItem',
							'dynamodb:UpdateItem',
							'dynamodb:DeleteItem',
						],
						Resource: `arn:aws:dynamodb:eu-west-1:*:table/${tableNames.stocksTable}`,
					}
				],
			},
		  },
	},
	resources: {
		Resources: {
			catalogItemsQueue: {
				Type: 'AWS::SQS::Queue',
				Properties: {
					QueueName: 'catalogItemsQueue'
				}
			},
			createProductTopic: {
				Type: "AWS::SNS::Topic",
				Properties: {
					TopicName: "createProductTopic",
				},
			},
			createProductTopicSubscription: {
				Type: "AWS::SNS::Subscription",
				Properties: {
					Endpoint: "gordeeffff@gmail.com",
					Protocol: "email",
					TopicArn: {
						Ref: "createProductTopic",
					},
				},
			},
		}
	},
  // import the function via paths
	functions: { getProductsList, getProductsById, createProduct, catalogBatchProcess },
	package: { individually: true },
	custom: {
		esbuild: {
			bundle: true,
			minify: false,
			sourcemap: true,
			exclude: ['aws-sdk'],
			target: 'node14',
			define: { 'require.resolve': undefined },
			platform: 'node',
			concurrency: 10,
		},
	},
};

module.exports = serverlessConfiguration;
