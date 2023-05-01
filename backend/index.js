import 'colors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import authMiddleware from './middleware/authMiddleware.js'
import { signUpValidation } from './validation/authValidation.js'
import { getProfile, signIn, signUp } from './controllers/UserController.js'

dotenv.config()

mongoose
	.connect(process.env.MONGO_DB_URI)
	.then(() => console.log('MongoDB is connected'.cyan.bold))
	.catch(error => console.log(`Error: ${error}`.red.bold))

const app = express()
app.use(express.json())

app.post('/auth/signup', signUpValidation, signUp)
app.post('/auth/signin', signIn)
app.get('/auth/profile', authMiddleware, getProfile)

app.listen(5000, error => {
	if (error) console.log(`Error: ${error}`.red.bold)
	console.log('Server is running on port 5000'.blue.bold)
})
