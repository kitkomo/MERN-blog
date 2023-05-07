import { useEffect } from 'react'
import Container from '@mui/material/Container'
import { Routes, Route } from 'react-router-dom'
import { Header } from './components'
import { Home, FullPost, Registration, AddPost, Login } from './pages'
import { useDispatch, useSelector } from 'react-redux'
import { isAuth, isAuthenticated } from './store/slices/authSlice'

function App() {
	const dispatch = useDispatch()
  const isAuthed = useSelector(isAuth)

	useEffect(() => {
		dispatch(isAuthenticated())
	}, [])

	return (
		<>
			<Header />
			<Container maxWidth='lg'>
				<Routes>
					<Route path='/' element={<Home />} />
					<Route path='/post/:id' element={<FullPost />} />
					{isAuthed && <Route path='/post/:id/edit' element={<AddPost />} />}
					<Route path='/login' element={<Login />} />
					<Route path='/registration' element={<Registration />} />
					{isAuthed && <Route path='/create' element={<AddPost />} />}
				</Routes>
			</Container>
		</>
	)
}

export default App
