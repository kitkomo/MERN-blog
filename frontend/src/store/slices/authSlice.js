import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../axios'

export const signIn = createAsyncThunk('auth/signIn', async credentials => {
	try {
		const { data } = await axios.post('/auth/signin', credentials)
		return data
	} catch (error) {
		console.warn(error)
		alert('Не удалось авторизоваться')
	}
})
export const signUp = createAsyncThunk('auth/signUp', async credentials => {
	try {
		const { data } = await axios.post('/auth/signup', credentials)
		return data
	} catch (error) {
		console.warn(error)
		alert('Не удалось зарегистрироваться')
	}
})

export const isAuthenticated = createAsyncThunk('auth/isAuth', async () => {
	const { data } = await axios.get('/auth/profile')
	return data
})

const initialState = {
	user: null,
	status: null
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		logOut(state) {
			state.user = null
			state.status = null
			localStorage.removeItem('mernBlogToken')
		}
	},
	extraReducers: {
		[signIn.pending]: state => {
			state.status = 'loading'
			state.user = null
		},
		[signIn.fulfilled]: (state, action) => {
			state.status = 'fulfilled'
			state.user = action.payload
		},
		[signIn.rejected]: state => {
			state.status = 'rejected'
			state.user = null
		},
		[isAuthenticated.fulfilled]: (state, action) => {
			state.status = 'fulfilled'
			state.user = action.payload
		},
		[signUp.pending]: state => {
			state.status = 'loading'
			state.user = null
		},
		[signUp.fulfilled]: (state, action) => {
			state.status = 'fulfilled'
			state.user = action.payload
		},
		[signUp.rejected]: state => {
			state.status = 'rejected'
			state.user = null
		},
	}
})

export const isAuth = state => Boolean(state.auth.user)

export const authReducer = authSlice.reducer
export const { logOut } = authSlice.actions
