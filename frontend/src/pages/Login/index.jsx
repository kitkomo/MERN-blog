import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'

import styles from './Login.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { isAuth, signIn } from '../../store/slices/authSlice'

export const Login = () => {
	const isAuthenticated = useSelector(isAuth)
	const dispatch = useDispatch()
	const redirect = useNavigate()

	const {
		register,
		handleSubmit,
		formState: { errors, isValid }
	} = useForm({
		defaultValues: {
			email: '',
			password: ''
		},
		mode: 'onChange'
	})

	const onSubmit = async values => {
		const data = await dispatch(signIn(values))
		if ('token' in data.payload) {
			localStorage.setItem('mernBlogToken', data.payload.token)
		} else {
			return alert('Не удалось авторизоваться')
		}
	}

	React.useEffect(() => {
		if (isAuthenticated) redirect('/')
	}, [isAuthenticated, redirect])

	return (
		<Paper classes={{ root: styles.root }}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Typography classes={{ root: styles.title }} variant='h5'>
					Вход в аккаунт
				</Typography>
				<TextField
					className={styles.field}
					label='E-Mail'
					type='email'
					error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					fullWidth
					{...register('email', { required: 'Укажите email' })}
				/>
				<TextField
					className={styles.field}
					label='Пароль'
					fullWidth
					type='password'
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					{...register('password', { required: 'Укажите пароль' })}
				/>
				<Button disabled={!isValid} type='submit' size='large' variant='contained' fullWidth>
					Войти
				</Button>
			</form>
		</Paper>
	)
}
