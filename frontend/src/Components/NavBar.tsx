import { useNavigate } from "react-router-dom"
import IconButton from "./IconButton"
import SearchBar from "./SearchBar"
import ThemeToggle from "./ThemeToggle"

export default function NavBar() {
	const navigate = useNavigate()

	return (
		<>
			<div className="bgAccent fixed top-0 left-0 w-full py-4 px-8 flexRowBetween items-center h-20">
				<IconButton type="home" className="mr-32" onClick={() => navigate("/")} />
				<SearchBar />
				<div className="flex flex-row gap-4">
					<IconButton type="friends" onClick={() => navigate("/friends")} />
					<IconButton type="message" onClick={() => navigate("/chats")} />
					<ThemeToggle />
				</div>
			</div>
			<div className="flex-none p-10" />
		</>
	)
}
