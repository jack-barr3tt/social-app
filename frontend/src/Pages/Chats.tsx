import { gql, useQuery } from "@apollo/client"
import { useState } from "react"
import { FiPlus } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { User } from "../graphql"
import { useUser } from "../Hooks/useUser"

export default function Chats() {
	const { userId } = useUser()
	const navigate = useNavigate()

	const {
		data: { user } = {},
		error,
		loading,
	} = useQuery<{ user: User }>(
		gql`
			query GetChats($userId: String!) {
				user(id: $userId) {
					chats {
						id
						name
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

	const ChatDisplay = (props: { chat: any }) => {
		const { chat } = props
		return (
			<div className="greySurface button" onClick={() => navigate(chat.id)}>
				<h3>{chat.name}</h3>
			</div>
		)
	}

	return (
		<>
			<div className="border border-gray-400 border-t-0 border-x-0 pb-4 flex-none">
				<h2>Chats</h2>
			</div>
			{loading && <p>Loading chats...</p>}
			{error && <p>{error.message}</p>}
			<div className="flex flex-col gap-4 p-4">
				{!!user && user.chats.map((chat) => <ChatDisplay chat={chat} key={chat.id} />)}
			</div>
		</>
	)
}
