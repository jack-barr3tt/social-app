import { useMutation, useQuery } from "@apollo/client"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { FiSave } from "react-icons/fi"
import { EDIT_CHAT_NAME } from "../GQL/mutations"
import { CHAT_NAME } from "../GQL/queries"
import { Chat } from "../graphql"
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
			<form className="flex flex-col gap-4 pt-4" onSubmit={handleSubmit}>
				<input
					className="input"
					type="text"
					placeholder="Chat Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<button className="greySurface iconButton self-end" type="submit">
					<FiSave size="12" />
				</button>
			</form>
		</Modal>
	)
}
