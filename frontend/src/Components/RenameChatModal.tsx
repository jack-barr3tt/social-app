import { useMutation } from "@apollo/client"
import { Dispatch, SetStateAction, useState } from "react"
import { FiSave } from "react-icons/fi"
import { EDIT_CHAT_NAME } from "../GQL/mutations"
import Modal from "./Modal"
import Title from "./Title"

export default function RenameChatModal(props: {
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>,
    id: string,
    currentName: string,
    onSubmit: () => void
}) {
	const { open, setOpen, id, currentName, onSubmit } = props

	const [name, setName] = useState(currentName)

	const [editName] = useMutation(EDIT_CHAT_NAME)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await editName({
            variables: {
                id,
                name
            }
        })

        setOpen(false)
        onSubmit()
    }

	return (
		<Modal open={open} setOpen={setOpen}>
			<Title>Rename Chat</Title>
			<form className="flex flex-col gap-4 pt-4" onSubmit={handleSubmit}>
				<input
					className="input"
					type="text"
					placeholder="Chat Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
				<button className="greySurface iconButton self-end" type="submit">
					<FiSave size="12" />
				</button>
			</form>
		</Modal>
	)
}
