import { Route, Routes } from "react-router-dom"
import NavBar from "./Components/NavBar"
import Home from "./Pages/Home"
import Chats from "./Pages/Chats"
import Chat from "./Pages/Chat"
import Friends from "./Pages/Friends"
import RouteProtector from "./Auth/RouteProtector"

export default function Router() {
	return (
		<RouteProtector>
			<NavBar />
			<Routes>
				<Route index element={<Home />} />
				<Route path="chats">
					<Route index element={<Chats />} />
					<Route path=":id" element={<Chat />} />
				</Route>
				<Route path="friends" element={<Friends />} />
			</Routes>
		</RouteProtector>
	)
}
