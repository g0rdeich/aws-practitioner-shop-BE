import {createProductSchema} from './validationSchema';

// returns array of validation errors
// if no errors returns empty array
export async function validateInput(reqBody: Record<string, any>): Promise<string[]> {
	try {
		await createProductSchema.validate(reqBody, {abortEarly: false});

		return [];
	} catch (err) {
		return err.errors;
	}
}