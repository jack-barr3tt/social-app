import { useQuery } from "@apollo/client"
import { useState } from "react"
import { FiPlus } from "react-icons/fi"
import ChatDisplay from "../Components/ChatDisplay"
import NewChatModal from "../Components/NewChatModal"
import { GET_CHAT_IDS } from "../GQL/queries"
import { User } from "../graphql"
import { useUser } from "../Hooks/useUser"

export default function Chats() {
	const { userId } = useUser()
	const [modalOpen, setModalOpen] = useState(false)

	const {
		data: { user } = {},
		error,
		loading,
	} = useQuery<{ user: User }>(GET_CHAT_IDS, {
		variables: {
			id: userId,
		},
	})

	return (
		<>
			<div className="border border-gray-400 border-t-0 border-x-0 pb-4 flex-none">
				<h2>Chats</h2>
			</div>
			{loading && <p>Loading chats...</p>}
			{error && <p>{error.message}</p>}
			<div className="flex flex-col gap-4 p-4">
				{!!user && user.chats.map((chat) => <ChatDisplay id={chat.id} key={chat.id} />)}
			</div>

			<div
				className="greySurface iconButton absolute right-8 bottom-8"
				onClick={() => setModalOpen(true)}
			>
				<FiPlus size="12" />
			</div>
			<NewChatModal open={modalOpen} setOpen={setModalOpen} />
		</>
	)
}
