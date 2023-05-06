import PostModel from '../models/Post.js'

export const getAllPosts = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('author')

		res.json(posts)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Something went wrong' })
	}
}

export const getOnePost = async (req, res) => {
	try {
		const post = await PostModel.findByIdAndUpdate(
			{
				_id: req.params.id
			},
			{
				$inc: { viewsCount: 1 }
			},
			{
				new: true
			}
		).populate('author')

		if (!post) return res.status(404).json({ message: 'Post not found' })

		res.json(post)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Something went wrong' })
	}
}

export const createPost = async (req, res) => {
	try {
		const document = await PostModel.create({
			...req.body,
			author: req.userId
		})

		const post = await document.save()

		res.json(post)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Something went wrong' })
	}
}

export const deletePost = async (req, res) => {
	try {
		const post = await PostModel.findOneAndDelete({
			_id: req.params.id
		})

		res.json({
			message: 'Post deleted successfully'
		})
	} catch (error) {
		console.log(error)
		res
			.status(500)
			.json({ message: 'Something went wrong while deleting post' })
	}
}

export const updatePost = async (req, res) => {
	try {
		const post = await PostModel.findOneAndUpdate(
			{
				_id: req.params.id
			},
			{
				...req.body,
				author: req.userId
			},
			{
				new: true
			}
		)

		res.json(post)
	} catch (error) {
		console.log(error)
		res
			.status(500)
			.json({ message: 'Something went wrong while updating post' })
	}
}

export const getLastTags = async (req, res) => {
	try {
		const posts = await PostModel.find().limit(5).exec()

		const tags = posts
			.map(post => post.tags)
			.flat()
			.slice(0, 5)

		res.json(tags)
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Something went wrong' })
	}
}
