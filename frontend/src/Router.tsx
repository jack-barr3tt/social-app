import { BrowserRouter, Route, Routes } from "react-router-dom"
import NavBar from "./Components/NavBar"
import Home from "./Pages/Home"
import Friends from "./Pages/Friends"

export default function Router() {
	return (
		<>
			<BrowserRouter>
				<NavBar />
				<Routes>
					<Route index element={<Home />} />
                    <Route path="friends" element={<Friends />} />
				</Routes>
			</BrowserRouter>
		</>
	)
}
