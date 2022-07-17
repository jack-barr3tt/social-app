import { useEffect, useState } from "react"
import { Navigate, useSearchParams } from "react-router-dom"
import { useUser } from "../Hooks/useUser"

export default function AuthReturn() {
	const params = useSearchParams()
	const { setUser } = useUser()

	const [redirect, setRedirect] = useState(false)

	useEffect(() => {
		const token = params[0].get("token")
		const id = params[0].get("id")
		if (token && id) {
			setUser(token, id)
			setRedirect(true)
		}
	}, [params])

	if (redirect) return <Navigate to="/" />
	return <div>Please wait...</div>
}
