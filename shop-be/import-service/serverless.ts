import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';
import config from './config';

const serverlessConfiguration: AWS = {
	service: 'import-service',
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
		},
		iam: {
			role: {
				statements: [
					{
						Effect: 'Allow',
						Action: [
							's3:ListBucket'
						],
						Resource: [
							'arn:aws:s3:::my-shop-app-products'
						]
					},
					{
						Effect: 'Allow',
						Action: [
							's3:*'
						],
						Resource: [
							'arn:aws:s3:::my-shop-app-products/*'
						]
					},
					{
						Effect: 'Allow',
						Action: ['sqs:SendMessage', 'sqs:GetQueueUrl'],
						Resource: config.sqs.catalogItemsQueue.arn,
					}
				]
			}
		}
	},
	// import the function via paths
	functions: { importProductsFile, importFileParser },
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
