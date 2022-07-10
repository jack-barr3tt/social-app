import { gql, useLazyQuery, useQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { User } from "../graphql"
import { useUser } from "../Hooks/useUser"
import SearchResult from "./SearchResult"

export default function SearchBar() {
	const location = useLocation()
	const { userId } = useUser()
	const [query, setQuery] = useState<string>("")

	const { data: { user } = {}, refetch } = useQuery<{ user: User }>(
		gql`
			query GetUser($userId: String!) {
				user(id: $userId) {
					username
					id
					friends {
						id
					}
					sentFriendRequests {
						receiver {
							id
						}
					}
					chats {
						id
						users {
							id
						}
					}
				}
			}
		`,
		{
			variables: { userId },
		}
	)

	const [fetch, { data: { search = [] } = {} }] = useLazyQuery<{ search: User[] }>(
		gql`
			query SearchUsers($query: String!) {
				search(query: $query) {
					id
					username
				}
			}
		`,
		{
			variables: {
				query: "" + query,
			},
		}
	)

	useEffect(() => {
		if (query.length > 3) fetch()
	}, [query])

	useEffect(() => {
		setQuery("")
	}, [location])
	return (
		<>
			{query.length > 3 && (
				<div
					className="absolute right-0 top-16 w-screen h-screen"
					onClick={() => setQuery("")}
				/>
			)}
			<form className="w-2/5 relative" onSubmit={(e) => e.preventDefault()}>
				<input
					className="input"
					placeholder="Search for a user..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
				{user && query.length > 3 && (
					<div
						className="absolute w-full rounded-lg border border-gray-400 p-4 bg-white"
						onBlur={() => setQuery("")}
					>
						<div className="border border-gray-400 border-x-0 border-b-0" />
						{search.map((result) => (
							<SearchResult
								key={result.id}
								user={user}
								result={result}
								update={() => {
									fetch()
									refetch()
								}}
							/>
						))}
					</div>
				)}
			</form>
		</>
	)
}
