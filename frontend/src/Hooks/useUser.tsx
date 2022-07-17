import { createContext, PropsWithChildren, useContext, useState } from "react"
import useLocalStorage from "./useLocalStorage"

interface UserValue {
	userId: string
	setUser: (token: string, id: string) => void
	token: string
	loggedIn: boolean
}

const UserContext = createContext<UserValue | undefined>(undefined)

export function useUser() {
	const context = useContext(UserContext)
	if (!context) throw new Error("No user context")
	return context
}

export function UserProvider(props: PropsWithChildren<{}>) {
	const { children } = props

	const [userId, setUserId] = useState<string>("")

	const [token, setToken] = useLocalStorage<string>({
		key: "token",
		initialValue: "",
	})

	const setUser = (token: string, id: string) => {
		setUserId(id)
		setToken(token)
	}

	const value = {
		userId,
		setUser,
		token,
		get loggedIn() {
			return token.length > 0 && userId.length > 0
		},
	}

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
