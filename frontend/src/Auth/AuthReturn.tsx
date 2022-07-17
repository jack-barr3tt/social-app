import { useQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { Navigate, useSearchParams } from "react-router-dom"
import { USER_NAME } from "../GQL/queries"
import { User } from "../graphql"
import { useUser } from "../Hooks/useUser"
import ChooseUsername from "./ChooseUsername"

export default function AuthReturn() {
	const params = useSearchParams()
	const { setUser, token } = useUser()

	const [redirect, setRedirect] = useState(false)
	const [id, setId] = useState("")

	const { data: { userById: user } = {}, refetch } = useQuery<{ userById: User }>(USER_NAME, {
		variables: { id },
	})

	useEffect(() => {
		const token = params[0].get("token")
		const id = params[0].get("id")
		if (token && id) {
			setUser(token, id)

			setId(id)
			refetch()
		}
	}, [params])

	useEffect(() => {
		if (user?.username) setRedirect(true)
	}, [user])

	useEffect(() => {
		refetch()
	}, [id, token])

	if (redirect) return <Navigate to="/" />
	if (user && !user.username) return <ChooseUsername />
	return <div>Please wait...</div>
}
