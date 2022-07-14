import { gql, useMutation, useQuery } from "@apollo/client"
import { Dispatch, FormEvent, SetStateAction, useEffect, useState } from "react"
import { UPDATE_MEMBERS } from "../GQL/mutations"
import { CHAT_MEMBERS, FRIENDS } from "../GQL/fragments"
import { Chat, User } from "../graphql"
import { useUser } from "../Hooks/useUser"
import Modal from "./Modal"
import Title from "./Title"
import IconButton from "./IconButton"

export default function ManageChatMembersModal(props: {
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
	id: string
}) {
	const { open, setOpen, id } = props

	const { userId } = useUser()

	const { data: { chat } = {} } = useQuery<{ chat: Chat }>(
		gql`
			${CHAT_MEMBERS}
			query GetChat($id: String!) {
				chat(id: $id) {
					id
					...ChatMemberIDs
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

	const [updateMembers] = useMutation(UPDATE_MEMBERS)

	const [selected, setSelected] = useState<string[]>([])

	const toggle = (id: string) => {
		if (selected.includes(id)) {
			setSelected(selected.filter((userId) => userId !== id))
		} else {
			setSelected([...selected, id])
		}
	}

	useEffect(() => {
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
	}

	return (
		<Modal open={open} setOpen={setOpen}>
			<Title>Manage Members</Title>
			<form className="formFlex" onSubmit={saveUsers}>
				{user &&
					user.friends.map((f) => (
						<div
							className="flexRowBetween p-4 grayBorder rounded-lg"
							key={f.id}
							onClick={() => toggle(f.id)}
						>
							<label htmlFor={f.id}>{f.username}</label>
							<input type="checkbox" id={f.id} checked={selected.includes(f.id)} />
						</div>
					))}
				<IconButton type="save" className="self-end" />
			</form>
		</Modal>
	)
}
