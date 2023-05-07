import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Post } from '../components/Post'
import { Index } from '../components/AddComment'
import { CommentsBlock } from '../components/CommentsBlock'
import { useParams } from 'react-router-dom'
import axios from '../axios'

export const FullPost = () => {
	const { id } = useParams()

	const [data, setData] = React.useState()
	const [isLoading, setIsLoading] = React.useState(true)

	React.useEffect(() => {
		axios
			.get('/posts/' + id)
			.then(res => {
				setData(res.data)
				setIsLoading(false)
			})
			.catch(error => {
				console.warn(error)
				alert(error)
			})
	}, [id])

	return (
		<>
			{isLoading ? (
				<Post isLoading isFullPost />
			) : (
				<>
					<Post
						id={data._id}
						title={data.title}
						imageUrl={data.imageURL}
						user={{
							avatarUrl: data.author?.avatarUrl,
							fullName: `${data.author.firstName} ${data.author.lastName}`
						}}
						createdAt={data.createdAt}
						viewsCount={data.viewsCount}
						commentsCount={3}
						tags={data.tags}
						isFullPost
					>
						<ReactMarkdown children={data.content} />
					</Post>
					<CommentsBlock
						items={[
							{
								user: {
									fullName: 'Вася Пупкин',
									avatarUrl: 'https://mui.com/static/images/avatar/1.jpg'
								},
								text: 'Это тестовый комментарий 555555'
							},
							{
								user: {
									fullName: 'Иван Иванов',
									avatarUrl: 'https://mui.com/static/images/avatar/2.jpg'
								},
								text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top'
							}
						]}
						isLoading={false}
					>
						<Index />
					</CommentsBlock>
				</>
			)}
		</>
	)
}
