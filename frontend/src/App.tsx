import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import Router from "./Router"

const client = new ApolloClient({
    uri: "http://localhost:3000/graphql",
    cache: new InMemoryCache()
})

function App() {
	return <ApolloProvider client={client}>
        <Router/>
    </ApolloProvider>
}

export default App
