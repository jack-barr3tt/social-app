import { useQuery } from "@apollo/client"
import { USER_NAME } from "../GQL/queries"
import { User } from "../graphql"
import UserControls from "./UserControls"

export default function SearchResult(props: { id: string }) {
	const { id } = props

	const { data: { user } = {} } = useQuery<{ user: User }>(USER_NAME, { variables: { id } })

	return (
		<div className="flex flex-row items-center justify-between px-8 py-2 border border-gray-400 border-x-0 border-t-0">
			<div>{user?.username}</div>
			<UserControls id={id} />
		</div>
	)
}
