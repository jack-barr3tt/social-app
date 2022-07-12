import { useQuery } from "@apollo/client"
import { USER_NAME } from "../GQL/queries"
import { User } from "../graphql"
import UserControls from "./UserControls"

export default function FriendDisplay(props: { id: string }) {
	const { id } = props

	const { data: { user } = {} } = useQuery<{ user: User }>(USER_NAME, { variables: { id } })

	return (
		<div className="border border-gray-300 rounded-lg p-2 pl-8 items-center flex flex-row justify-between">
			<h3>{user?.username}</h3>
			<UserControls id={id} />
		</div>
	)
}
