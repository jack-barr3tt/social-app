import { useMutation, useQuery } from "@apollo/client"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { EDIT_CHAT_NAME } from "../GQL/mutations"
import { CHAT_NAME } from "../GQL/queries"
import { Chat } from "../graphql"
import IconButton from "./IconButton"
import Modal from "./Modal"
import Title from "./Title"

export default function RenameChatModal(props: {
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
	id: string
}) {
	const { open, setOpen, id } = props

	const { data: { chat } = {} } = useQuery<{ chat: Chat }>(CHAT_NAME, {
		variables: { id },
	})

	const [name, setName] = useState<string>()

	useEffect(() => {
		if (chat) setName(chat.name)
	}, [chat])

	const [editName] = useMutation(EDIT_CHAT_NAME, {
		refetchQueries: [{ query: CHAT_NAME, variables: { id } }],
	})

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		await editName({
			variables: {
				id,
				name,
			},
		})

		setOpen(false)
	}

	return (
		<Modal open={open} setOpen={setOpen}>
			<Title>Rename Chat</Title>
			<form className="formFlex" onSubmit={handleSubmit}>
				<input
					className="input"
					type="text"
					placeholder="Chat Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<IconButton className="self-end" type="save" />
			</form>
		</Modal>
	)
}
