import { useQuery } from "@apollo/client"
import { USER_NAME } from "../GQL/queries"
import { User } from "../graphql"
import UserControls from "./UserControls"

export default function FriendDisplay(props: { id: string }) {
	const { id } = props

	const { data: { user } = {} } = useQuery<{ user: User }>(USER_NAME, { variables: { id } })

	return (
		<div className="grayBorder rounded-lg p-2 pl-8 items-center flexRowBetween bg-white">
			<h3>{user?.username}</h3>
			<UserControls id={id} />
		</div>
	)
}
