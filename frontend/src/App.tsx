import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import { UserProvider } from "./Hooks/useUser"
import Router from "./Router"

const client = new ApolloClient({
	uri: "http://localhost:3000/graphql",
	cache: new InMemoryCache(),
})

function App() {
	return (
		<ApolloProvider client={client}>
			<UserProvider>
				<div className="p-8 h-full">
					<Router />
				</div>
			</UserProvider>
		</ApolloProvider>
	)
}

export default App
