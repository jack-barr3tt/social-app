import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import { UserProvider } from "./Hooks/useUser"
import Router from "./Router"

const client = new ApolloClient({
	uri: "http://192.168.0.98:3000/graphql",
	cache: new InMemoryCache(),
	defaultOptions: {
		watchQuery: {
			fetchPolicy: "cache-and-network",
		},
	},
})

function App() {
	return (
		<ApolloProvider client={client}>
			<UserProvider>
				<div className="p-8 h-full flex flex-col">
					<Router />
				</div>
			</UserProvider>
		</ApolloProvider>
	)
}

export default App
