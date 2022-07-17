import { ReactNode } from "react"
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom"
import AuthReturn from "./AuthReturn"
import { useUser } from "../Hooks/useUser"
import Welcome from "../Pages/Welcome"

function RequireAuth(props: { children: ReactNode }) {
	const { loggedIn } = useUser()
	const location = useLocation()

	if (!loggedIn) return <Navigate to="welcome" state={{ from: location }} replace />

	return <>{props.children}</>
}

export default function RouteProtector(props: { children: ReactNode }) {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="welcome" element={<Welcome />} />
				<Route path="auth" element={<AuthReturn />} />
				<Route path="*" element={<RequireAuth>{props.children}</RequireAuth>} />
			</Routes>
		</BrowserRouter>
	)
}
