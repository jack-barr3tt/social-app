import { gql, useMutation, useQuery } from "@apollo/client"
import { Dispatch, FormEvent, SetStateAction, useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CREATE_CHAT } from "../GQL/mutations"
import { FRIENDS } from "../GQL/fragments"
import { Chat, User } from "../graphql"
import Modal from "./Modal"
import Title from "./Title"
import { GET_CHAT_IDS } from "../GQL/queries"
import IconButton from "./IconButton"

export default function NewChatModal(props: {
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
}) {
	const { open, setOpen } = props

	const navigate = useNavigate()

	const {
		data: { user } = {},
		loading,
		error,
	} = useQuery<{ user: User }>(
		gql`
			${FRIENDS}
			query GetUser {
				user {
					id
					...Friends
				}
			}
		`
	)

	const refetch = {
		refetchQueries: [{ query: GET_CHAT_IDS }],
	}

	const [createChat] = useMutation<{ createChat: Chat }>(CREATE_CHAT, refetch)

	const [selected, setSelected] = useState<string[]>([])
	const [name, setName] = useState("")

	const toggle = useCallback(
		(id: string) => {
			if (selected.includes(id)) {
				setSelected(selected.filter((s) => s !== id))
			} else {
				setSelected([...selected, id])
			}
		},
		[selected]
	)

	const handleCreateChat = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { data } = await createChat({
			variables: {
				userIds: selected,
				name,
			},
		})

		if (data) navigate("/chats/" + data.createChat.id)
	}

	return (
		<Modal open={open} setOpen={setOpen}>
			<Title>New Chat</Title>
			{loading && <p>Loading...</p>}
			{error && <p>{"Error: " + error}</p>}
			<form className="formFlex" onSubmit={handleCreateChat}>
				<input
					className="input"
					placeholder="Name your chat..."
					value={name}
					onChange={(e) => setName(e.target.value)}
					autoFocus
				/>
				{user &&
					user.friends.map((f) => (
						<div
							className="flexRowBetween p-4 borderGray rounded-lg"
							key={f.id}
							onClick={() => toggle(f.id)}
						>
							<label htmlFor={f.id}>{f.username}</label>
							<input type="checkbox" id={f.id} checked={selected.includes(f.id)} />
						</div>
					))}
				<IconButton type="done" className="self-end" disabled={selected.length < 1} />
			</form>
		</Modal>
	)
}
