import { gql, useMutation } from "@apollo/client"
import { useCallback } from "react"
import {
	FiMessageSquare,
	FiUserX,
	FiUserPlus,
	FiCheck,
	FiX,
	FiSlash,
} from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { Chat, User } from "../graphql"

export default function UserControls(props: { currentUser: User; user: User; update: () => void }) {
	const { currentUser, user, update } = props

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

	const [acceptRequest] = useMutation(
		gql`
			mutation AcceptRequest($id: String!) {
				acceptFriendRequest(id: $id)
			}
		`
	)

	const [rejectRequest] = useMutation(
		gql`
			mutation RejectRequest($id: String!) {
				rejectFriendRequest(id: $id)
			}
		`
	)

	const [revokeRequest] = useMutation(
		gql`
			mutation RevokeRequest($id: String!) {
				revokeFriendRequest(id: $id)
			}
		`
	)

	const sendRequest = useCallback(async () => {
		await sendFriendRequest({
			variables: {
				senderId: currentUser.id,
				receiverId: user.id,
			},
		})

		update()
	}, [])

	const unFriend = useCallback(async () => {
		await removeFriend({
			variables: {
				userId: currentUser.id,
				friendId: user.id,
			},
		})

		update()
	}, [])

	const startChat = useCallback(async () => {
		const chat = currentUser.chats.find(
			(c) => c.users.some((u) => u.id === user.id) && c.users.length === 2
		)

		if (chat) return navigate("/chats/" + chat.id)

		const { data } = await createChat({
			variables: {
				userId: currentUser.id,
				friendId: user.id,
			},
		})

		update()

		if (data) navigate("/chats/" + data.createChat.id)
	}, [])

	const acceptFriendRequest = useCallback(async () => {
		const request = currentUser.receivedFriendRequests.find((r) => r.sender.id === user.id)

		if (!request) return

		await acceptRequest({
			variables: {
				id: request.id,
			},
		})

		update()
	}, [])

	const rejectFriendRequest = useCallback(async () => {
		const request = currentUser.receivedFriendRequests.find((r) => r.sender.id === user.id)

		if (!request) return

		await rejectRequest({
			variables: {
				id: request.id,
			},
		})

		update()
	}, [])

	const revokeFriendRequest = useCallback(async () => {
		const request = currentUser.sentFriendRequests.find((r) => r.receiver.id === user.id)

		if (!request) return

		await revokeRequest({
			variables: {
				id: request.id,
			},
		})

		update()
	}, [])

	return (
		<div className="flex flex-row gap-2">
			{currentUser.friends.some((u) => u.id === user.id) ? (
				<>
					<div className="greySurface iconButton" onClick={startChat}>
						<FiMessageSquare size="12" />
					</div>
					<div className="greySurface iconButton" onClick={unFriend}>
						<FiUserX size="12" />
					</div>
				</>
			) : currentUser.sentFriendRequests.some((u) => u.receiver.id === user.id) ? (
				<div className="greySurface iconButton" onClick={revokeFriendRequest}>
					<FiSlash size="12" />
				</div>
			) : currentUser.receivedFriendRequests.some((u) => u.sender.id === user.id) ? (
				<>
					<div className="greySurface iconButton" onClick={acceptFriendRequest}>
						<FiCheck size="12" />
					</div>
					<div className="greySurface iconButton" onClick={rejectFriendRequest}>
						<FiX size="12" />
					</div>
				</>
			) : (
				<div className="greySurface iconButton" onClick={sendRequest}>
					<FiUserPlus size="12" />
				</div>
			)}
		</div>
	)
}
