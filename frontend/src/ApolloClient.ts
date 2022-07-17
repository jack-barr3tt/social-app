import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client"
import { setContext } from "@apollo/client/link/context"

const httpLink = createHttpLink({
	uri: "http://localhost:3000/graphql",
})

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem("sa-token")
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${JSON.parse(token)}` : "",
		},
	}
})

export const client = new ApolloClient({
	uri: "http://localhost:3000/graphql",
	cache: new InMemoryCache(),
	link: authLink.concat(httpLink),
	defaultOptions: {
		watchQuery: {
			fetchPolicy: "cache-and-network",
		},
	},
})
