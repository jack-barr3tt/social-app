import { User } from "../graphql"
import UserControls from "./UserControls"

export default function SearchResult(props: { user: User; result: User; update: () => void }) {
	const { user, result, update } = props

	return (
		<div className="flex flex-row items-center justify-between px-8 py-2 border border-gray-400 border-x-0 border-t-0">
			<div>{result.username}</div>
			<UserControls currentUser={user} user={result} update={update} />
		</div>
	)
}
