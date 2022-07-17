import { useMutation } from "@apollo/client"
import { FormEvent, useState } from "react"
import IconButton from "../Components/IconButton"
import Title from "../Components/Title"
import { SET_USERNAME } from "../GQL/mutations"
import { USER_NAME } from "../GQL/queries"
import { useUser } from "../Hooks/useUser"

export default function ChooseUsername() {
	const { userId } = useUser()

	const [newUsername, setNewUsername] = useState("")

	const [setUsername] = useMutation(SET_USERNAME, {
		refetchQueries: [{ query: USER_NAME, variables: { id: userId } }],
	})

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		setUsername({ variables: { username: newUsername } })
	}

	return (
		<div className="flex flex-col items-center justify-center w-full h-full">
			<div className="flex flex-col gap-8 w-1/3 min-w-[400px] items-center">
				<form onSubmit={handleSubmit} className="formFlex">
                    <Title>Choose a username</Title>
					<input className="input" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
					<IconButton type="done" />
				</form>
			</div>
		</div>
	)
}
