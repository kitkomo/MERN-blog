import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Please provide a title'],
			minlength: 2,
			maxlength: 100
		},
		content: {
			type: String,
			required: [true, 'Please provide a content'],
			minlength: 10,
			maxlength: 10000
		},
		tags: {
			type: [String],
			default: []
		},
		viewsCount: {
			type: Number,
			default: 0
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		imageURL: String
	},
	{
		timestamps: true
	}
)

export default mongoose.model('Post', PostSchema)
