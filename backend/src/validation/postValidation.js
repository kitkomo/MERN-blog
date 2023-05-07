import { body } from 'express-validator'

export const postCreateValidation = [
	body('title')
		.isLength({ min: 2 })
		.withMessage('Title must be at least 2 characters long'),
	body('content')
		.isLength({ min: 10 })
		.withMessage('Content must be at least 10 characters long'),
	body('tags').isArray().withMessage('Tags must be an array').optional(),
	// body('imageURL').isURL().withMessage('Image must be a valid URL').optional()
	body('imageURL').optional()
]
