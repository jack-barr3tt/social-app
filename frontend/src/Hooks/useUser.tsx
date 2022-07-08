import { createContext, PropsWithChildren, useContext, useState } from "react"

interface UserValue {
	userId: string
}

const UserContext = createContext<UserValue | undefined>(undefined)

export function useUser() {
    const context = useContext(UserContext)
    if(!context) throw new Error("No user context")
	return context
}

export function UserProvider(props: PropsWithChildren<{}>) {
	const { children } = props

	const [userId, setUserId] = useState<string>("7b308a04-8fe7-4469-bf2b-235131a1b533")

	const value = {
		userId,
	}

	return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
