import * as yup from 'yup';

export const createProductSchema = yup.object({
	title: yup.string().required(),
	description: yup.string().required(),
	price: yup.number().integer().positive().required(),
	count: yup.number().integer().positive().required()
});
