import { gql, useQuery } from "@apollo/client"
import { useUser } from "../Hooks/useUser"
import Posts from "./Posts"

export default function Home() {
	const { userId } = useUser()

	const { data, loading, error } = useQuery(
		gql`
			query GetUser($userId: String!) {
				user(id: $userId) {
					id
					username
				}
			}
		`,
		{
			variables: {
				userId,
			},
		}
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
