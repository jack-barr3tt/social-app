import { useMutation } from "@apollo/client"
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react"
import { client } from "../ApolloClient"
import { POSTS_INFO } from "../GQL/fragments"
import { EDIT_POST } from "../GQL/mutations"
import { GET_FRIENDS_POSTS } from "../GQL/queries"
import { Post } from "../graphql"
import IconButton from "./IconButton"
import Modal from "./Modal"
import Title from "./Title"

export default function EditPostModal(props: {
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
	id: string
}) {
	const { open, setOpen, id } = props

	const [title, setTitle] = useState<string>()
	const [content, setContent] = useState<string>()

	const post = client.readFragment<Post>({
		id: `Post:${id}`,
		fragment: POSTS_INFO,
	})

	const [editPost] = useMutation(EDIT_POST, {
		variables: {
			id,
			title,
			content,
		},
		refetchQueries: [{ query: GET_FRIENDS_POSTS }],
	})

	useEffect(() => {
		if (!post) return

		setTitle(post.title)
		setContent(post.content)
	}, [post])

	const handleSave = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		await editPost()

		setOpen(false)
	}

	return (
		<Modal open={open} setOpen={setOpen}>
			<Title>Edit Post</Title>
			<form className="formFlex" onSubmit={handleSave}>
				<input className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
				<textarea
					rows={4}
					className="input"
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>
				<IconButton className="self-end" type="save" />
			</form>
		</Modal>
	)
}
