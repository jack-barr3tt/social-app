import { FiHome, FiMessageSquare, FiUsers } from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import SearchBar from "./SearchBar"

export default function NavBar() {
	const navigate = useNavigate()

	return (
		<>
			<div className="fixed top-0 left-0 w-full py-4 px-8 flex flex-row justify-between items-center h-20">
				<div className="greySurface iconButton mr-16" onClick={() => navigate("/")}>
					<FiHome size="12" />
				</div>
				<SearchBar />
				<div className="flex flex-row gap-4">
					<div className="greySurface iconButton" onClick={() => navigate("/friends")}>
						<FiUsers size="12" />
					</div>
					<div className="greySurface iconButton" onClick={() => navigate("/chats")}>
						<FiMessageSquare size="12" />
					</div>
				</div>
			</div>
			<div className="flex-none p-10" />
		</>
	)
}
