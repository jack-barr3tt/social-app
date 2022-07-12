import { gql, useQuery } from "@apollo/client"
import { useUser } from "../Hooks/useUser"
import { User as UserType } from "../graphql"
import Title from "../Components/Title"
import FriendDisplay from "../Components/FriendDisplay"

export default function Friends() {
	const { userId } = useUser()

	const {
		data: { user } = {},
		loading,
		error,
	} = useQuery<{ user: UserType }>(
		gql`
			query GetUser($id: String!) {
				user(id: $id) {
					id
					friends {
						id
					}
					sentFriendRequests {
						receiver {
							id
						}
					}
					receivedFriendRequests {
						sender {
							id
						}
					}
				}
			}
		`,
		{
			variables: {
				id: userId,
			},
		}
	)

	if (!user) return <></>

	return (
		<>
			{user.sentFriendRequests.length > 0 && (
				<>
					<Title>Sent Requests</Title>
					<div className="flex flex-col gap-4 p-4">
						{user.sentFriendRequests.map((request) => (
							<FriendDisplay id={request.receiver.id} key={request.id} />
						))}
					</div>
				</>
			)}
			{user.receivedFriendRequests.length > 0 && (
				<>
					<Title>Received Requests</Title>
					<div className="flex flex-col gap-4 p-4">
						{user.receivedFriendRequests.map((request) => (
							<FriendDisplay id={request.sender.id} key={request.id} />
						))}
					</div>
				</>
			)}
			<Title>Friends</Title>
			{loading && <p>Loading friends...</p>}
			{error && <p>{error.message}</p>}
			<div className="flex flex-col gap-4 p-4">
				{user.friends.length > 0 ? (
					user.friends.map((friend) => <FriendDisplay id={friend.id} key={friend.id} />)
				) : (
					<p>You have no friends</p>
				)}
			</div>
		</>
	)
}
