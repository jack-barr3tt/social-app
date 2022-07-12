import { gql, useMutation, useQuery } from "@apollo/client"
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react"
import { FiSave } from "react-icons/fi"
import { Chat, User } from "../graphql"
import { useUser } from "../Hooks/useUser"
import Modal from "./Modal"
import Title from "./Title"

export default function ManageChatMembersModal(props: {
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
	id: string,
    onSubmit: () => void
}) {
	const { open, setOpen, id, onSubmit } = props

	const { userId } = useUser()

	const { data: { chat } = {} } = useQuery<{ chat: Chat }>(
		gql`
			query GetChat($id: String!) {
				chat(id: $id) {
					users {
						id
					}
				}
			}
		`,
		{
			variables: {
				id,
			},
		}
	)

	const { data: { user } = {} } = useQuery<{ user: User }>(
		gql`
			query GetUser($userId: String!) {
				user(id: $userId) {
					friends {
						id
						username
					}
				}
			}
		`,
		{
			variables: {
				userId,
			},
		}
	)

	const [updateMembers] = useMutation(gql`
		mutation UpdateMembers($id: String!, $userIds: [String!]!) {
			editMembers(changes: { id: $id, userIds: $userIds })
		}
	`)

	const [selected, setSelected] = useState<string[]>([])

	const toggle = (id: string) => {
		if (selected.includes(id)) {
			setSelected(selected.filter((userId) => userId !== id))
		} else {
			setSelected([...selected, id])
		}
	}

	useEffect(() => {
		console.log(chat)
		if (chat) setSelected(chat.users.map((user) => user.id))
	}, [chat])

	const saveUsers = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		await updateMembers({
			variables: {
				id,
				userIds: selected,
			},
		})

		setOpen(false)
        onSubmit()
	}

	return (
		<Modal open={open} setOpen={setOpen}>
			<Title>Manage Members</Title>
			<form className="flex flex-col gap-4 pt-4" onSubmit={saveUsers}>
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
				<button type="submit" className="greySurface iconButton self-end">
					<FiSave size="12" />
				</button>
			</form>
		</Modal>
	)
}
