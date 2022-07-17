import { useQuery } from "@apollo/client"
import { USER_NAME } from "../GQL/queries"
import { User } from "../graphql"
import UserControls from "./UserControls"

export default function FriendDisplay(props: { id: string }) {
	const { id } = props

	const { data: { userById: user } = {} } = useQuery<{ userById: User }>(USER_NAME, {
		variables: { id },
	})

	return (
		<div className="cBorder rounded-lg p-2 pl-8 items-center flexRowBetween bgAccent">
			<h3>{user?.username}</h3>
			<UserControls id={id} />
		</div>
	)
}
