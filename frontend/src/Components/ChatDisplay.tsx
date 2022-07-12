import { useNavigate } from "react-router-dom"
import { Chat } from "../graphql"
import ChatControls from "./ChatControls"

export default function ChatDisplay(props: { chat: Chat; refresh: () => void }) {
	const { chat, refresh } = props

	const navigate = useNavigate()

	return (
		<div className="border border-grey-400 rounded-lg flex flex-row items-center">
			<div
				className="grow h-full rounded-lg flex flex-row items-center pl-4"
				onClick={() => navigate(chat.id)}
			>
				<h3>{chat.name}</h3>
			</div>
			<div className="p-2">
				<ChatControls chat={chat} refetchChat={refresh} />
			</div>
		</div>
	)
}
