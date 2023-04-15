export default {
	region: 'eu-west-1',
	s3Bucket: {
		name: 'my-shop-app-products',
		folders: {
			uploaded: 'uploaded',
			parsed: 'parsed'
		},
		expires: 60
	},
	sqs: {
		catalogItemsQueue: {
			url: 'https://sqs.eu-west-1.amazonaws.com/633356132469/catalogItemsQueue',
			arn: 'arn:aws:sqs:eu-west-1:633356132469:catalogItemsQueue'
		}
	},
	authorizer: {
		basic: {
			arn: 'arn:aws:lambda:eu-west-1:633356132469:function:authorization-service-dev-basicAuthorizer',
			type: 'TOKEN'
		}
	} 
};