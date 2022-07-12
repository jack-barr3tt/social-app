import { gql, useLazyQuery, useMutation, useQuery } from "@apollo/client"
import { Dispatch, FormEvent, SetStateAction, useCallback, useState } from "react"
import { FiCheck } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { CREATE_CHAT } from "../GQL/mutations"
import { FRIENDS } from "../GQL/fragments"
import { Chat, User } from "../graphql"
import { useUser } from "../Hooks/useUser"
import Modal from "./Modal"
import Title from "./Title"
import { GET_CHAT_IDS } from "../GQL/queries"

export default function NewChatModal(props: {
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
}) {
	const { open, setOpen } = props

	const { userId } = useUser()
	const navigate = useNavigate()

	const {
		data: { user } = {},
		loading,
		error,
	} = useQuery<{ user: User }>(
		gql`
			${FRIENDS}
			query GetUser($userId: String!) {
				user(id: $userId) {
					id
					...Friends
				}
			}
		`,
		{
			variables: {
				userId,
			},
		}
	)

	const refetch = {
		refetchQueries: [{ query: GET_CHAT_IDS, variables: { id: userId } }],
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
				ownerId: userId,
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
			<form className="flex flex-col gap-4 pt-4" onSubmit={handleCreateChat}>
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
							className="flex flex-row justify-between p-4 border border-gray-300 rounded-lg"
							key={f.id}
							onClick={() => toggle(f.id)}
						>
							<label htmlFor={f.id}>{f.username}</label>
							<input type="checkbox" id={f.id} checked={selected.includes(f.id)} />
						</div>
					))}
				<button
					className="greySurface iconButton self-end"
					type="submit"
					disabled={selected.length < 1}
				>
					<FiCheck size="12" />
				</button>
			</form>
		</Modal>
	)
}
