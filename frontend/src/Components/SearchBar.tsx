import { gql, useLazyQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { User } from "../graphql"
import SearchResult from "./SearchResult"

export default function SearchBar() {
	const location = useLocation()

	const [query, setQuery] = useState<string>("")

	const [fetch, { data: { search = [] } = {} }] = useLazyQuery<{ search: User[] }>(
		gql`
			query SearchUsers($query: String!) {
				search(query: $query) {
					id
				}
			}
		`,
		{
			variables: {
				query,
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
				{query.length > 3 && (
					<div
						className="absolute w-full rounded-lg grayBorder p-4 bg-white"
						onBlur={() => setQuery("")}
					>
						<div className="grayBorder lineOver" />
						{search.map((result) => (
							<SearchResult key={result.id} id={result.id} />
						))}
					</div>
				)}
			</form>
		</>
	)
}
