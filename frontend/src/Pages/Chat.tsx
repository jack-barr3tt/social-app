import { gql, useMutation, useQuery } from "@apollo/client"
import { isSameDay } from "date-fns"
import { FormEvent, useEffect, useRef, useState } from "react"
import { FiSend } from "react-icons/fi"
import { useParams } from "react-router-dom"
import ChatControls from "../Components/ChatControls"
import Message from "../Components/Message"
import MessageDateSep from "../Components/MessageDateSep"
import Title from "../Components/Title"
import { Chat as ChatType, Message as MessageType } from "../graphql"
import { useUser } from "../Hooks/useUser"

export default function Chat() {
	const { id } = useParams()
	const {
		data: { chat } = {},
		loading,
		error,
		refetch,
	} = useQuery<{ chat: ChatType }>(
		gql`
			query GetChat($chatId: String!) {
				chat(id: $chatId) {
                    id
					name
					messages {
						user {
							id
							username
						}
						content
						createdAt
					}
					users {
						id
					}
					owner {
						id
					}
				}
			}
		`,
		{
			variables: {
				chatId: id,
			},
		}
	)

	const [sendMutation] = useMutation<MessageType>(gql`
		mutation SendMessage($userId: String!, $chatId: String!, $content: String!) {
			createMessage(message: { userId: $userId, chatId: $chatId, content: $content }) {
				id
				content
			}
		}
	`)

	const { userId } = useUser()

	const scrollRef = useRef<HTMLDivElement>(null)
	const [message, setMessage] = useState("")

	const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (message.length < 1) return

		await sendMutation({
			variables: {
				userId,
				chatId: id,
				content: message,
			},
		})

		await refetch()

		if (scrollRef && scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" })

		setMessage("")
	}

	useEffect(() => {
		if (scrollRef && scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" })
	}, [scrollRef])

	return (
		<>
			{loading && <p>Loading chat...</p>}
			{error && <p>{error.message}</p>}
			{chat && (
				<>
					<Title>
						{chat.name}
						<ChatControls chat={chat} refetchChat={() => refetch()} />
					</Title>
					<div className="flex flex-col gap-2 p-8 grow overflow-x-auto">
						{[...chat.messages]
							.sort(
								(a, b) =>
									new Date(a.createdAt).getTime() -
									new Date(b.createdAt).getTime()
							)
							.map((m, i, a) => {
								let showTime = false
								if (i === a.length - 1) showTime = true
								else if (a[i + 1].user.id !== m.user.id) showTime = true

								const messageComponent = (
									<Message
										message={m}
										group={chat.users.length > 2}
										key={m.id}
										showTime={showTime}
									/>
								)

								if (
									i + 1 < a.length &&
									!isSameDay(new Date(a[i + 1].createdAt), new Date(m.createdAt))
								) {
									return (
										<>
											{messageComponent}
											<MessageDateSep date={new Date(a[i + 1].createdAt)} />
										</>
									)
								} else {
									return messageComponent
								}
							})}
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
						<button type="submit" className="greySurface iconButton">
							<FiSend size="12" />
						</button>
					</form>
				</>
			)}
		</>
	)
}
