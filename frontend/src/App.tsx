import { ApolloProvider } from "@apollo/client"
import { client } from "./ApolloClient"
import { UserProvider } from "./Hooks/useUser"
import Router from "./Router"

function App() {
	return (
		<ApolloProvider client={client}>
			<UserProvider>
				<div className="p-8 h-full flex flex-col bg overflow-y-auto">
					<Router />
				</div>
			</UserProvider>
		</ApolloProvider>
	)
}

export default App
