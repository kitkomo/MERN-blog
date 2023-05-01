import 'colors'
import express from 'express'
import jwt from 'jsonwebtoken'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
	res.json('Hello World!')
})

// app.post('/auth/login', (req, res) => {
// 	const { email, password } = req.body
// 	res.json({ email, password, success: true })
// })

app.listen(5000, error => {
	if (error) console.log(`Error: ${error}`.red.bold)
	console.log('Server is running on port 5000'.blue.bold)
})
