import jwt from 'jsonwebtoken'

export default function authMiddleware(req, res, next) {
	const token = req.headers?.authorization

	if (!token)
		return res.status(403).json({
			message: 'Not authorized'
		})

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		req.userId = decoded.id
	} catch (error) {
		console.log(error)
		return res.status(403).json({
			message: 'Broken token'
		})
	}
	return next()
}
