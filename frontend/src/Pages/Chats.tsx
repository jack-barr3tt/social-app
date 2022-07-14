import { useQuery } from "@apollo/client"
import { useState } from "react"
import { FiPlus } from "react-icons/fi"
import ChatDisplay from "../Components/ChatDisplay"
import IconButton from "../Components/IconButton"
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
			<div className="cBorder lineUnder pb-4 flex-none">
				<h2>Chats</h2>
			</div>
			{loading && <p>Loading chats...</p>}
			{error && <p>{error.message}</p>}
			<div className="flex flex-col gap-4 p-4">
				{!!user && user.chats.map((chat) => <ChatDisplay id={chat.id} key={chat.id} />)}
			</div>
			<IconButton
				type="new"
				className="absolute right-8 bottom-8"
				onClick={() => setModalOpen(true)}
			/>
			<NewChatModal open={modalOpen} setOpen={setModalOpen} />
		</>
	)
}
