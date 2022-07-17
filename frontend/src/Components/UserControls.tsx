import { useMutation, useQuery } from "@apollo/client"
import { useCallback } from "react"
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
import IconButton from "./IconButton"

export default function UserControls(props: { id: string }) {
	const { id } = props

	const navigate = useNavigate()

	const refetch = {
		refetchQueries: [{ query: USER_SOCIAL }],
	}

	const [sendFriendRequest] = useMutation(SEND_FRIEND_REQUEST, refetch)
	const [removeFriend] = useMutation(REMOVE_FRIEND, refetch)
	const [acceptRequest] = useMutation(ACCEPT_FRIEND_REQUEST, refetch)
	const [rejectRequest] = useMutation(REJECT_FRIEND_REQUEST, refetch)
	const [revokeRequest] = useMutation(REVOKE_FRIEND_REQUEST, refetch)
	const [createChat] = useMutation<{ createChat: Chat }>(CREATE_CHAT)

	const { data: { user } = {} } = useQuery<{ user: User }>(USER_SOCIAL)

	const sendRequest = useCallback(async () => {
		await sendFriendRequest({
			variables: {
				receiverId: id,
			},
		})
	}, [])

	const unFriend = useCallback(async () => {
		await removeFriend({
			variables: {
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
					<IconButton type="message" onClick={startChat} />
					<IconButton type="unfriend" onClick={unFriend} />
				</>
			) : user.sentFriendRequests.some((u) => u.receiver.id === id) ? (
				<IconButton type="cancel" onClick={revokeFriendRequest} />
			) : user.receivedFriendRequests.some((u) => u.sender.id === id) ? (
				<>
					<IconButton type="done" onClick={acceptFriendRequest} />
					<IconButton type="cancel" onClick={rejectFriendRequest} />
				</>
			) : (
				<IconButton type="add-friend" onClick={sendRequest} />
			)}
		</div>
	)
}
