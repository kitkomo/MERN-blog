import { body } from 'express-validator'

export const signUpValidation = [
	body('email').isEmail().withMessage('Email is invalid'),
	body('password')
		.isLength({ min: 6 })
		.withMessage('Password must be at least 6 characters long'),
	body('firstName')
		.notEmpty()
		.withMessage('First name is required')
		.isLength({ min: 2 })
		.withMessage('First name must be at least 2 characters long'),
	body('lastName')
		.notEmpty()
		.withMessage('Last name is required')
		.isLength({ min: 2 })
		.withMessage('Last name must be at least 2 characters long'),
	body('avatar').optional().isURL().withMessage('Avatar must be a valid URL')
]
