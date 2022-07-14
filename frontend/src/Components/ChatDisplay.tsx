import { useQuery } from "@apollo/client"
import { useNavigate } from "react-router-dom"
import { CHAT_NAME } from "../GQL/queries"
import { Chat } from "../graphql"
import ChatControls from "./ChatControls"

export default function ChatDisplay(props: { id: string }) {
	const { id } = props

	const { data: { chat } = {} } = useQuery<{ chat: Chat }>(CHAT_NAME, { variables: { id } })

	const navigate = useNavigate()

	return (
		<div className="cBorder rounded-lg flexRowCenter bgAccent">
			<div className="grow h-full rounded-lg flexRowCenter pl-4" onClick={() => navigate(id)}>
				<h3>{chat?.name}</h3>
			</div>
			<div className="p-2">
				<ChatControls id={id} />
			</div>
		</div>
	)
}
