import { gql, useQuery } from "@apollo/client"
import { useUser } from "../Hooks/useUser"
import { User as UserType } from "../graphql"
import Title from "../Components/Title"
import FriendDisplay from "../Components/FriendDisplay"
import { BASIC_USER_INFO, FRIENDS, FRIEND_REQUESTS, USER_CHAT_MEMBERS } from "../GQL/fragments"

export default function Friends() {
	const { userId } = useUser()

	const {
		data: { user } = {},
		loading,
		error,
		refetch,
	} = useQuery<{ user: UserType }>(
		gql`
			${BASIC_USER_INFO}
			${FRIENDS}
			${FRIEND_REQUESTS}
			${USER_CHAT_MEMBERS}
			query GetUser($id: String!) {
				user(id: $id) {
					...BasicUserInfo
					...Friends
					...FriendRequests
					...UserChatMembers
				}
			}
		`,
		{
			variables: {
				id: userId,
			},
		}
	)

	return (
		<>
			{!!user && user.sentFriendRequests.length > 0 && (
				<>
					<Title>Sent Requests</Title>
					<div className="flex flex-col gap-4 p-4">
						{user.sentFriendRequests.map((request) => (
							<FriendDisplay
								currentUser={user}
								user={request.receiver}
								refetch={refetch}
								key={request.id}
							/>
						))}
					</div>
				</>
			)}
			{!!user && user.receivedFriendRequests.length > 0 && (
				<>
					<Title>Received Requests</Title>
					<div className="flex flex-col gap-4 p-4">
						{user.receivedFriendRequests.map((request) => (
							<FriendDisplay
								currentUser={user}
								user={request.sender}
								refetch={refetch}
								key={request.id}
							/>
						))}
					</div>
				</>
			)}
			<Title>Friends</Title>
			{loading && <p>Loading friends...</p>}
			{error && <p>{error.message}</p>}
			<div className="flex flex-col gap-4 p-4">
				{!!user && user.friends.length > 0 ? (
					user.friends.map((friend) => (
						<FriendDisplay
							currentUser={user}
							user={friend}
							refetch={refetch}
							key={friend.id}
						/>
					))
				) : (
					<p>You have no friends</p>
				)}
			</div>
		</>
	)
}
