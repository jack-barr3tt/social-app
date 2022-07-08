import { useState } from "react"
import { FiHome, FiMessageSquare } from "react-icons/fi"
import { useNavigate } from "react-router-dom"

export default function NavBar() {
	const [search, setSearch] = useState<string>()
    const navigate = useNavigate()

	return (
		<>
			<div className="fixed top-0 left-0 w-full py-4 px-8 flex flex-row justify-between items-center h-20">
				<div className="iconButton" onClick={() => navigate("/")}>
					<FiHome />
				</div>
				<form className="w-1/3">
					<input
						className="input"
						placeholder="Search for a user..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</form>
				<div className="iconButton" onClick={() => navigate("/messages")}>
					<FiMessageSquare />
				</div>
			</div>
			<div className="p-10" />
		</>
	)
}
