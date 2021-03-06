import { useMutation, useQuery } from "@apollo/client"
import { isSameDay } from "date-fns"
import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { FiSend } from "react-icons/fi"
import { useParams } from "react-router-dom"
import ChatControls from "../Components/ChatControls"
import IconButton from "../Components/IconButton"
import Message from "../Components/Message"
import MessageDateSep from "../Components/MessageDateSep"
import Title from "../Components/Title"
import { SEND_MESSAGE } from "../GQL/mutations"
import { GET_CHAT } from "../GQL/queries"
import { Chat as ChatType, Message as MessageType } from "../graphql"

export default function Chat() {
	const { id } = useParams()
	const {
		data: { chat } = {},
		loading,
		error,
	} = useQuery<{ chat: ChatType }>(GET_CHAT, {
		variables: {
			chatId: id,
		},
	})

	const [sendMutation] = useMutation<MessageType>(SEND_MESSAGE, {
		refetchQueries: [{ query: GET_CHAT, variables: { chatId: id } }],
	})

	const scrollRef = useRef<HTMLDivElement>(null)
	const [message, setMessage] = useState("")

	const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (message.length < 1) return

		await sendMutation({
			variables: {
				chatId: id,
				content: message,
			},
		})

		setMessage("")
	}

	useEffect(() => {
		if (scrollRef && scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" })
	}, [scrollRef, chat])

	const messages = useMemo(() => {
		if (!chat) return []
		return [...chat.messages]
			.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
			.map((m, i, a) => {
				let showTime = false
				if (i == a.length - 1) showTime = true
				else if (a[i + 1].user.id !== m.user.id) showTime = true

				const messageComponent = (
					<Message
						id={m.id}
						group={chat.users.length > 2}
						key={m.id}
						showTime={showTime}
					/>
				)

				const date = () => new Date(a[i + 1].createdAt)

				if (i + 1 < a.length && !isSameDay(date(), new Date(m.createdAt))) {
					return (
						<>
							{messageComponent}
							<MessageDateSep date={date()} key={date().toString()} />
						</>
					)
				} else {
					return messageComponent
				}
			})
	}, [chat])

	return (
		<>
			{loading && <p>Loading chat...</p>}
			{error && <p>{error.message}</p>}
			{chat && (
				<>
					<Title>
						{chat.name}
						<ChatControls id={id || ""} />
					</Title>
					<div className="flex flex-col gap-2 p-8 grow overflow-x-auto">
						{messages}
						<div ref={scrollRef} className="flex-none h-12" />
					</div>
					<form className="flex-none w-full flex flex-row gap-8" onSubmit={sendMessage}>
						<input
							className="input"
							placeholder="Enter message..."
							autoFocus
							value={message}
							onChange={(e) => setMessage(e.target.value)}
						/>
						<IconButton type="send" />
					</form>
				</>
			)}
		</>
	)
}
