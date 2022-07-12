import { useMutation, useQuery } from "@apollo/client"
import { useCallback } from "react"
import { FiMessageSquare, FiUserX, FiUserPlus, FiCheck, FiX, FiSlash } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import {
	ACCEPT_FRIEND_REQUEST,
	CREATE_CHAT,
	REJECT_FRIEND_REQUEST,
	REMOVE_FRIEND,
	REVOKE_FRIEND_REQUEST,
	SEND_FRIEND_REQUEST,
} from "../GQL/mutations"
import { USER_SOCIAL } from "../GQL/queries"
import { Chat, User } from "../graphql"
import { useUser } from "../Hooks/useUser"

export default function UserControls(props: { id: string }) {
	const { id } = props

	const { userId } = useUser()

	const navigate = useNavigate()

	const refetch = {
		refetchQueries: [{ query: USER_SOCIAL, variables: { id: userId } }],
	}

	const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST, refetch)
	const [removeFriend] = useMutation(REMOVE_FRIEND, refetch)
	const [acceptRequest] = useMutation(ACCEPT_FRIEND_REQUEST, refetch)
	const [rejectRequest] = useMutation(REJECT_FRIEND_REQUEST, refetch)
	const [revokeRequest] = useMutation(REVOKE_FRIEND_REQUEST, refetch)
	const [createChat] = useMutation<{ createChat: Chat }>(CREATE_CHAT)

	const { data: { user } = {} } = useQuery<{ user: User }>(USER_SOCIAL, {
		variables: { id: userId },
	})

	const sendRequest = useCallback(async () => {
		await sendFriendRequest({
			variables: {
				senderId: userId,
				receiverId: id,
			},
		})
	}, [])

	const unFriend = useCallback(async () => {
		await removeFriend({
			variables: {
				userId: userId,
				friendId: id,
			},
		})
	}, [])

	const startChat = useCallback(async () => {
		if (!user) return

		const chat = user.chats.find(
			(c) => c.users.some((u) => u.id === id) && c.users.length === 2
		)

		if (chat) return navigate("/chats/" + chat.id)

		const { data } = await createChat({
			variables: {
				ownerId: userId,
				userIds: [id],
			},
		})

		if (data) navigate("/chats/" + data.createChat.id)
	}, [])

	const acceptFriendRequest = useCallback(async () => {
		if (!user) return

		const request = user.receivedFriendRequests.find((r) => r.sender.id === id)

		if (!request) return

		await acceptRequest({
			variables: {
				id: request.id,
			},
		})
	}, [])

	const rejectFriendRequest = useCallback(async () => {
		if (!user) return

		const request = user.receivedFriendRequests.find((r) => r.sender.id === id)

		if (!request) return

		await rejectRequest({
			variables: {
				id: request.id,
			},
		})
	}, [])

	const revokeFriendRequest = useCallback(async () => {
		if (!user) return

		const request = user.sentFriendRequests.find((r) => r.receiver.id === id)

		if (!request) return

		await revokeRequest({
			variables: {
				id: request.id,
			},
		})
	}, [])

	if (!user) return <></>

	return (
		<div className="flex flex-row gap-2">
			{user.friends.some((u) => u.id === id) ? (
				<>
					<div className="greySurface iconButton" onClick={startChat}>
						<FiMessageSquare size="12" />
					</div>
					<div className="greySurface iconButton" onClick={unFriend}>
						<FiUserX size="12" />
					</div>
				</>
			) : user.sentFriendRequests.some((u) => u.receiver.id === id) ? (
				<div className="greySurface iconButton" onClick={revokeFriendRequest}>
					<FiSlash size="12" />
				</div>
			) : user.receivedFriendRequests.some((u) => u.sender.id === id) ? (
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
