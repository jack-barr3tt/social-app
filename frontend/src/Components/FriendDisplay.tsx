import { User } from "../graphql"
import UserControls from "./UserControls"

export default function FriendDisplay(props: {
	currentUser: User
	user: User
	refetch: () => void
}) {
	const { currentUser, user, refetch } = props
	return (
		<div className="border border-gray-300 rounded-lg p-2 pl-8 items-center flex flex-row justify-between">
			<h3>{user.username}</h3>
			<UserControls currentUser={currentUser} user={user} update={refetch} />
		</div>
	)
}
