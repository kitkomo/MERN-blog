import 'colors'
import dotenv from 'dotenv'
import fs from 'fs'
import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import { getProfile, signIn, signUp } from './controllers/UserController.js'
import {
	createPost,
	deletePost,
	getAllPosts,
	getOnePost,
	updatePost
} from './controllers/PostController.js'
import authMiddleware from './middleware/authMiddleware.js'
import {
	signInValidation,
	signUpValidation
} from './validation/authValidation.js'
import { postCreateValidation } from './validation/postValidation.js'
import ValidationErrorsMiddleware from './middleware/ValidationErrorsMiddleware.js'

if (!fs.existsSync('uploads')) {
	fs.mkdirSync('uploads')
	console.log('Uploads folder created'.gray.bold)
}

dotenv.config()

mongoose
	.connect(process.env.MONGO_DB_URI)
	.then(() => console.log('MongoDB is connected'.cyan.bold))
	.catch(error => console.log(`Error: ${error}`.red.bold))

const app = express()

app.use(express.json())
app.use('/uploads', express.static('uploads'))

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname)
	}
})

const upload = multer({ storage })

//auth
app.post('/auth/signup', signUpValidation, ValidationErrorsMiddleware, signUp)
app.post('/auth/signin', signInValidation, ValidationErrorsMiddleware, signIn)
app.get('/auth/profile', authMiddleware, getProfile)
//posts
app.get('/posts', getAllPosts)
app.get('/posts/:id', getOnePost)
app.post(
	'/posts',
	authMiddleware,
	postCreateValidation,
	ValidationErrorsMiddleware,
	createPost
)
app.delete('/posts/:id', authMiddleware, deletePost)
app.patch(
	'/posts/:id',
	authMiddleware,
	postCreateValidation,
	ValidationErrorsMiddleware,
	updatePost
)
//upload
app.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
	res.json({
		message: 'Image uploaded successfully',
		imageURL: `/uploads/${req.file.originalname}`
	})
})

const PORT = process.env.PORT || 8000

app.listen(PORT, error => {
	if (error) console.log(`Error: ${error}`.red.bold)
	console.log(`Server is running on port ${PORT}`.blue.bold)
})
