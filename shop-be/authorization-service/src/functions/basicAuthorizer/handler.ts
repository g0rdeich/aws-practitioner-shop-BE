const generatePolicy = (principalId: string, resource: string, effect: 'Allow' | 'Deny') => {
	return {
		principalId,
		policyDocument: {
			Version: '2012-10-17',
      		Statement: [
				{
				Action: 'execute-api:Invoke',
				Effect: effect,
				Resource: resource,
				},
      		],
		}
	};
}

const basicAuthorizer = async (event) => {
	if (event.type !== 'TOKEN' || !event.authorizationToken) {
		return 'Unauthorized';
	}

	try {
		const authorizationToken = event.authorizationToken;

		const encodedCredentials = authorizationToken.split(' ')[1];
		const credentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8').split(':');
		const username = credentials[0];
		const password = credentials[1];

		const storedPassword = process.env[username];
		const effect = !storedPassword || storedPassword !== password ? 'Deny' : 'Allow';

		return generatePolicy(encodedCredentials, event.methodArn, effect);
	} catch {
		return 'Unauthorized';
	}
};

export const main = basicAuthorizer;