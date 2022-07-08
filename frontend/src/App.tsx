import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
    uri: "http://localhost:3000/graphql",
    cache: new InMemoryCache()
})

function App() {
	return <ApolloProvider client={client}>
    </ApolloProvider>
}

export default App
