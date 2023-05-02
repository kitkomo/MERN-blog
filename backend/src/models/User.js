import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: [true, 'Please provide your first name']
		},
		lastName: {
			type: String,
			required: [true, 'Please provide your last name']
		},
		email: {
			type: String,
			required: [true, 'Please provide your email'],
			unique: true
		},
		password: {
			type: String,
			required: [true, 'Please provide your password'],
			select: false
		},
		avatarURL: String
	},
	{
		timestamps: true
	}
)

export default mongoose.model('User', UserSchema)
