import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import SimpleMDE from 'react-simplemde-editor'
import axios from '../../axios'

import 'easymde/dist/easymde.min.css'
import styles from './AddPost.module.scss'

export const AddPost = () => {
	const { id } = useParams()
	const isEditing = Boolean(id)
	const redirect = useNavigate()
	const [isLoading, setIsLoading] = React.useState(false)
	const [value, setValue] = React.useState('')
	const [title, setTitle] = React.useState('')
	const [tags, setTags] = React.useState([])
	const [imageUrl, setImageUrl] = React.useState('')
	const inputFileRef = React.useRef(null)

	const handleChangeFile = async event => {
		try {
			const formData = new FormData()
			formData.append('image', event.target.files[0])
			const { data } = await axios.post('/upload', formData)
			setImageUrl(data.imageURL)
		} catch (error) {
			console.warn(error)
		}
	}

	const onClickRemoveImage = async () => setImageUrl('')

	const onChange = React.useCallback(value => {
		setValue(value)
	}, [])

	const onSubmit = async () => {
		try {
			const formattedTags = await tags.split(' ')
			console.log(formattedTags)
			setIsLoading(true)
			const fields = {
				title,
				imageUrl,
				content: value,
				tags: formattedTags,
				imageURL: imageUrl
			}
			const { data } = isEditing
				? await axios.patch(`/posts/${id}`, fields)
				: await axios.post('/posts', fields)

      const _id = isEditing ? id : data._id

			redirect('/post/' + _id)
		} catch (error) {
			console.warn(error)
			alert('Не удалось создать статью')
		}
	}

	const options = React.useMemo(
		() => ({
			spellChecker: false,
			maxHeight: '400px',
			autofocus: true,
			placeholder: 'Введите текст...',
			status: false,
			autosave: {
				enabled: true,
				delay: 1000
			}
		}),
		[]
	)

	React.useEffect(() => {
		if (id) {
			axios
				.get(`posts/${id}`)
				.then(res => {
					setTitle(res.data.title)
					setValue(res.data.content)
					setTags(res.data.tags)
					setImageUrl(res.data.imageURL)
				})
				.catch(() => alert('Ошибка при получении статьи'))
		}
	}, [])

	return (
		<Paper style={{ padding: 30 }}>
			<Button
				onClick={() => inputFileRef.current.click()}
				variant='outlined'
				size='large'
			>
				Загрузить превью
			</Button>
			<input
				ref={inputFileRef}
				type='file'
				onChange={handleChangeFile}
				hidden
			/>
			{imageUrl && (
				<>
					<Button
						variant='contained'
						color='error'
						onClick={onClickRemoveImage}
					>
						Удалить
					</Button>
					<img
						className={styles.image}
						src={imageUrl}
						alt='Uploaded'
					/>
				</>
			)}
			<br />
			<TextField
				classes={{ root: styles.title }}
				variant='standard'
				placeholder='Заголовок статьи...'
				fullWidth
				value={title}
				onChange={e => setTitle(e.target.value)}
			/>
			<TextField
				classes={{ root: styles.tags }}
				variant='standard'
				placeholder='Тэги'
				fullWidth
				value={tags}
				onChange={e => setTags(e.target.value)}
			/>
			<SimpleMDE
				className={styles.editor}
				value={value}
				onChange={onChange}
				options={options}
			/>
			<div className={styles.buttons}>
				<Button size='large' variant='contained' onClick={onSubmit}>
					{id ? 'Сохранить' : 'Опубликовать'}
				</Button>
				<a href='/'>
					<Button size='large'>Отмена</Button>
				</a>
			</div>
		</Paper>
	)
}
