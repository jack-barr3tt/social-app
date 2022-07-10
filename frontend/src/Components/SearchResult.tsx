import { gql, useMutation } from "@apollo/client"
import { useCallback } from "react"
import { FiClock, FiMessageSquare, FiUserPlus, FiUserX } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { Chat, User } from "../graphql"

export default function SearchResult(props: { user: User; result: User; update: () => void }) {
	const { user, result, update } = props

	const navigate = useNavigate()

	const [sendFriendRequest] = useMutation(
		gql`
			mutation SendFriendRequest($senderId: String!, $receiverId: String!) {
				sendFriendRequest(senderId: $senderId, receiverId: $receiverId)
			}
		`
	)

	const [removeFriend] = useMutation(
		gql`
			mutation RemoveFriend($userId: String!, $friendId: String!) {
				unfriend(userId: $userId, friendId: $friendId)
			}
		`
	)

	const [createChat] = useMutation<{ createChat: Chat }>(
		gql`
			mutation CreateChat($userId: String!, $friendId: String!) {
				createChat(chat: { userIds: [$userId, $friendId], ownerId: $userId }) {
					id
				}
			}
		`
	)

	const sendRequest = useCallback(async () => {
		await sendFriendRequest({
			variables: {
				senderId: user.id,
				receiverId: result.id,
			},
		})

		update()
	}, [])

	const unFriend = useCallback(async () => {
		await removeFriend({
			variables: {
				userId: user.id,
				friendId: result.id,
			},
		})

        update()
	}, [])

	const startChat = useCallback(async () => {
        console.log(user)

		const chat = user.chats.find(
			(c) => c.users.some((u) => u.id === result.id) && c.users.length === 2
		)

		if (chat) return navigate("/chats/" + chat.id)

		const { data } = await createChat({
			variables: {
				userId: user.id,
				friendId: result.id,
			},
		})

        update()

		if (data) navigate("/chats/" + data.createChat.id)
	}, [])

	return (
		<div className="flex flex-row items-center justify-between px-8 py-2 border border-gray-400 border-x-0 border-t-0">
			<div>{result.username}</div>
			<div className="flex flex-row gap-2">
				{user.friends.some((u) => u.id === result.id) ? (
					<>
						<div className="greySurface iconButton" onClick={startChat}>
							<FiMessageSquare size="12" />
						</div>
						<div className="greySurface iconButton" onClick={unFriend}>
							<FiUserX size="12" />
						</div>
					</>
				) : user.sentFriendRequests.some((u) => u.receiver.id === result.id) ? (
					<div className="bg-blue-500 border border-blue-400 rounded-lg p-4">
						<FiClock size="12" />
					</div>
				) : (
					<div className="greySurface iconButton" onClick={sendRequest}>
						<FiUserPlus size="12" />
					</div>
				)}
			</div>
		</div>
	)
}
