import { useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Chat } from "../graphql"
import { useUser } from "../Hooks/useUser"
import { DELETE_CHAT, LEAVE_CHAT } from "../GQL/mutations"
import ManageChatMembersModal from "./ManageChatMembersModal"
import RenameChatModal from "./RenameChatModal"
import { CHAT_OWNER_ID, GET_CHAT_IDS } from "../GQL/queries"
import IconButton from "./IconButton"

export default function ChatControls(props: { id: string }) {
	const { id } = props

	const navigate = useNavigate()

	const { userId } = useUser()

	const [editOpen, setEditOpen] = useState(false)
	const [manageOpen, setManageOpen] = useState(false)

	const refetch = {
		refetchQueries: [{ query: GET_CHAT_IDS }],
	}

	const [deleteChat] = useMutation(DELETE_CHAT, refetch)
	const [leaveChat] = useMutation(LEAVE_CHAT, refetch)

	const { data: { chat } = {} } = useQuery<{ chat: Chat }>(CHAT_OWNER_ID, {
		variables: { id },
	})

	const handleDelete = async () => {
		await deleteChat({ variables: { id } })

		navigate("/chats")
	}

	const handleLeave = async () => {
		await leaveChat({ variables: { id } })

		navigate("/chats")
	}

	return (
		<>
			<RenameChatModal open={editOpen} setOpen={setEditOpen} id={id} />
			<ManageChatMembersModal open={manageOpen} setOpen={setManageOpen} id={id} />
			<div className="flex flex-row gap-2">
				{chat?.owner.id === userId ? (
					<>
						<IconButton onClick={() => setEditOpen(true)} type="edit" />
						<IconButton onClick={() => setManageOpen(true)} type="settings" />
						<IconButton onClick={() => handleDelete()} type="delete" />
					</>
				) : (
					<IconButton onClick={() => handleLeave()} type="leave" />
				)}
			</div>
		</>
	)
}
