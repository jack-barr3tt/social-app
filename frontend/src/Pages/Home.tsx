import { gql, useQuery } from "@apollo/client"
import Posts from "./Posts"

export default function Home() {
	const { data, loading, error } = useQuery(
		gql`
			query GetUser {
				user {
					id
					username
				}
			}
		`
	)
	if (loading) return <p>Loading...</p>
	if (error) return <p>{"Error: " + error.message}</p>

	const { user } = data

	return (
		<>
			<h2>{`Welcome, ${user.username}`}</h2>
			<Posts />
		</>
	)
}
