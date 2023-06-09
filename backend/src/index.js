import 'colors'
import dotenv from 'dotenv'
import cors from 'cors'
import fs from 'fs'
import express from 'express'
import mongoose from 'mongoose'
import multer from 'multer'
import { getProfile, signIn, signUp } from './controllers/UserController.js'
import {
	createPost,
	deletePost,
	getAllPosts,
	getLastTags,
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
app.use(cors())
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
app.post(
	'/api/auth/signup',
	signUpValidation,
	ValidationErrorsMiddleware,
	signUp
)
app.post(
	'/api/auth/signin',
	signInValidation,
	ValidationErrorsMiddleware,
	signIn
)
app.get('/api/auth/profile', authMiddleware, getProfile)
//posts
app.get('/api/posts', getAllPosts)
app.get('/api/posts/:id', getOnePost)
app.post(
	'/api/posts',
	authMiddleware,
	postCreateValidation,
	ValidationErrorsMiddleware,
	createPost
)
app.delete('/api/posts/:id', authMiddleware, deletePost)
app.patch(
	'/api/posts/:id',
	authMiddleware,
	postCreateValidation,
	ValidationErrorsMiddleware,
	updatePost
)
//tags
app.get('/api/tags', getLastTags)
//upload
app.post('/api/upload', authMiddleware, upload.single('image'), (req, res) => {
	res.json({
		message: 'Image uploaded successfully',
		imageURL: `${process.env.HOST}${process.env.PORT || 8000}/uploads/${
			req.file.originalname
		}`
	})
})

const PORT = process.env.PORT || 8000

app.listen(PORT, error => {
	if (error) console.log(`Error: ${error}`.red.bold)
	console.log(`Server is running on port ${PORT}`.blue.bold)
})
