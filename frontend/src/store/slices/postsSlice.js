import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
	const { data } = await axios.get('/posts')
	return data
})

export const fetchTags = createAsyncThunk('posts/fetchLastTags', async () => {
	const { data } = await axios.get('/tags')
	return data
})

export const deletePost = createAsyncThunk('posts/deletePost', async id => {
	const { data } = await axios.delete(`/posts/${id}`)
	return data
})

const initialState = {
	posts: {
		items: [],
		status: null
	},
	tags: {
		items: [],
		status: null
	}
}

const postsSlice = createSlice({
	name: 'posts',
	initialState,
	reducer: {},
	extraReducers: {
		//getting posts
		[fetchPosts.pending]: state => {
			state.posts.status = 'loading'
		},
		[fetchPosts.fulfilled]: (state, action) => {
			state.posts.status = 'fulfilled'
			state.posts.items = action.payload
		},
		[fetchPosts.rejected]: state => {
			state.posts.status = 'rejected'
			state.posts.items = []
		},
		//getting tags
		[fetchTags.pending]: state => {
			state.tags.status = 'loading'
		},
		[fetchTags.fulfilled]: (state, action) => {
			state.tags.status = 'fulfilled'
			state.tags.items = action.payload
		},
		[fetchTags.rejected]: state => {
			state.tags.status = 'rejected'
			state.tags.items = []
		},
		//deleting post
		[deletePost.fulfilled]: (state, action) => {
			state.posts.items = state.posts.items.filter(post => post._id !== action.meta.arg)
			alert('Статься успешно удалена')
		},
		[deletePost.rejected]: state => {
			alert('Что-то пошло не так во время удаления статьи :(')
		}
	}
})

export const postsReducer = postsSlice.reducer
