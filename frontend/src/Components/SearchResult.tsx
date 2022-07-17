import { useQuery } from "@apollo/client"
import { USER_NAME } from "../GQL/queries"
import { User } from "../graphql"
import UserControls from "./UserControls"

export default function SearchResult(props: { id: string }) {
	const { id } = props

	const { data: { userById: user } = {} } = useQuery<{ userById: User }>(USER_NAME, { variables: { id } })

	return (
		<div className="flexRowCenter justify-between px-8 py-2 cBorder lineUnder">
			<div>{user?.username}</div>
			<UserControls id={id} />
		</div>
	)
}
