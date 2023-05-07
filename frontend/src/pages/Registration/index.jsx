import React from 'react'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'

import styles from './Login.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { isAuth, signUp } from '../../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

export const Registration = () => {
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
			password: '',
			firstName: '',
			lastName: ''
		},
		mode: 'onChange'
	})

	const onSubmit = async values => {
		const data = await dispatch(signUp(values))
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
					Создание аккаунта
				</Typography>
				<div className={styles.avatar}>
					<Avatar sx={{ width: 100, height: 100 }} />
				</div>
				<TextField
					className={styles.field}
					label='Имя'
					fullWidth
					error={Boolean(errors.firstName?.message)}
					helperText={errors.firstName?.message}
					{...register('firstName', { required: 'Укажите ваше имя' })}
				/>
				<TextField
					className={styles.field}
					label='Фамилия'
					fullWidth
					error={Boolean(errors.lastName?.message)}
					helperText={errors.lastName?.message}
					{...register('lastName', { required: 'Укажите вашу фамилию' })}
				/>
				<TextField
					className={styles.field}
					label='E-Mail'
					fullWidth
          error={Boolean(errors.email?.message)}
					helperText={errors.email?.message}
					{...register('email', { required: 'Укажите email' })}
				/>
				<TextField
					className={styles.field}
					label='Пароль'
					fullWidth
					error={Boolean(errors.password?.message)}
					helperText={errors.password?.message}
					{...register('password', { required: 'Укажите пароль' })}
				/>
				<Button disabled={!isValid} type='submit' size='large' variant='contained' fullWidth>
					Зарегистрироваться
				</Button>
			</form>
		</Paper>
	)
}
