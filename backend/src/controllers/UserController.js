import { validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import { signUpValidation } from '../validation/authValidation.js'
import UserModel from '../models/User.js'
import authMiddleware from '../middleware/authMiddleware.js'
import generateToken from '../utils/generateToken.js'

export const signUp = async (req, res) => {
	try {
		const passwordHash = await bcrypt.hash(req.body.password, 10)
		const document = new UserModel({ ...req.body, password: passwordHash })

		const savedUser = await document.save()
		const { password, ...allOtherData } = savedUser._doc
		const user = allOtherData

		const token = generateToken(user._id)

		res.json({
			message: 'Sign up successful',
			user,
			token
		})
	} catch (error) {
		console.log(`Error: ${error}`.red.bold)
		res.status(500).json({
			message: 'Sign up failed'
		})
	}
}

export const signIn = async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email })

		if (!user) {
			return res.status(403).json({
				message: 'Wrong email or password'
			})
		}

		const isPasswordCorrect = await bcrypt.compare(
			req.body.password,
			user.password
		)

		if (!isPasswordCorrect) {
			return res.status(403).json({
				message: 'Wrong email or password'
			})
		}

		const token = generateToken(user._id)

		res.json({
			message: 'Sign in successful',
			user,
			token
		})
	} catch (error) {
		console.log(`Error: ${error}`.red.bold)
		res.status(500).json({
			message: 'Sign up failed'
		})
	}
}

export const getProfile = async (req, res) => {
		console.log(req.userId)
	try {
		const { _doc } = await UserModel.findById(req.userId)
		const { password, ...user } = _doc

		if (!user) {
			res.status(404).json({
				message: 'User not found'
			})
		}

		res.json(user)
	} catch (error) {
		console.log(`Error: ${error}`.red.bold)
		res.status(500).json({
			message: 'Profile fetching failed'
		})
	}
}
