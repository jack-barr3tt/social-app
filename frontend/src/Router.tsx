import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./Home"

export default function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route index element={<Home />} />
			</Routes>
		</BrowserRouter>
	)
}
