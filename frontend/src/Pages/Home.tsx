import { gql, useQuery } from "@apollo/client"
import { useState } from "react"
import { useUser } from "../Hooks/useUser"

export default function Home() {
	const { userId } = useUser()

	const { data, loading, error } = useQuery(
		gql`
			query GetUser($userId: String!) {
				user(id: $userId) {
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
		</>
	)
}