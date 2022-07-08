import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./Pages/Home"

export default function Router() {
	return (
		<>
			<BrowserRouter>
				<NavBar />
				<Routes>
					<Route index element={<Home />} />
				</Routes>
			</BrowserRouter>
		</>
	)
}
