import { gql, useMutation } from "@apollo/client"
import { useState } from "react"
import { FiEdit3, FiLogOut, FiSettings, FiTrash2 } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { Chat } from "../graphql"
import { useUser } from "../Hooks/useUser"
import ManageChatMembersModal from "./ManageChatMembersModal"
import RenameChatModal from "./RenameChatModal"

export default function ChatControls(props: { chat: Chat; refetchChat: () => void }) {
	const { chat, refetchChat } = props

	const navigate = useNavigate()

	const { userId } = useUser()

	const [editOpen, setEditOpen] = useState(false)
	const [manageOpen, setManageOpen] = useState(false)

	const [deleteChat] = useMutation(gql`
		mutation DeleteChat($id: String!) {
			deleteChat(id: $id)
		}
	`)

	const [leaveChat] = useMutation(gql`
		mutation LeaveChat($id: String!, $userId: String!) {
			leaveChat(id: $id, userId: $userId)
		}
	`)

	const handleDelete = async () => {
		await deleteChat({ variables: { id: chat.id } })

		navigate("/chats")

		refetchChat()
	}

	const handleLeave = async () => {
		await leaveChat({ variables: { id: chat.id, userId } })

		navigate("/chats")

		refetchChat()
	}

	return (
		<>
			<RenameChatModal
				open={editOpen}
				setOpen={setEditOpen}
				id={chat.id || ""}
				currentName={chat.name}
				onSubmit={() => refetchChat()}
			/>
			<ManageChatMembersModal
				open={manageOpen}
				setOpen={setManageOpen}
				id={chat.id}
				onSubmit={() => refetchChat()}
			/>
			<div className="flex flex-row gap-2">
				{chat.owner.id === userId ? (
					<>
						<div className="greySurface iconButton" onClick={() => setEditOpen(true)}>
							<FiEdit3 />
						</div>
						<div className="greySurface iconButton" onClick={() => setManageOpen(true)}>
							<FiSettings />
						</div>
						<div className="greySurface iconButton" onClick={() => handleDelete()}>
							<FiTrash2 />
						</div>
					</>
				) : (
					<div className="greySurface iconButton" onClick={() => handleLeave()}>
						<FiLogOut />
					</div>
				)}
			</div>
		</>
	)
}
