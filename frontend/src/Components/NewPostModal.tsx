import { useMutation } from "@apollo/client"
import { Dispatch, FormEvent, SetStateAction, useState } from "react"
import { CREATE_POST } from "../GQL/mutations"
import { GET_FRIENDS_POSTS } from "../GQL/queries"
import IconButton from "./IconButton"
import Modal from "./Modal"
import Title from "./Title"

export default function NewPostModal(props: {
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
}) {
	const { open, setOpen } = props

	const [title, setTitle] = useState("")
	const [content, setContent] = useState("")

	const [createPost] = useMutation(CREATE_POST, {
		variables: {
			title,
			content,
		},

		refetchQueries: [{ query: GET_FRIENDS_POSTS }],
	})

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		await createPost()

		setOpen(false)
		setTitle("")
		setContent("")
	}

	return (
		<Modal open={open} setOpen={setOpen}>
			<Title>New Post</Title>
			<form onSubmit={handleSubmit} className="formFlex">
				<input placeholder="Title" className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
				<textarea
          placeholder="Content"
					className="input h-32"
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>
				<IconButton type="done" className="self-end disabled:dark-gray disabled:hover:scale-100" disabled={title.length < 1 || content.length < 1} />
			</form>
		</Modal>
	)
}
