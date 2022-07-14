import { useMutation } from "@apollo/client"
import { useState } from "react"
import { FiEdit3, FiTrash2 } from "react-icons/fi"
import { DELETE_POST } from "../GQL/mutations"
import { GET_FRIENDS_POSTS } from "../GQL/queries"
import { useUser } from "../Hooks/useUser"
import EditPostModal from "./EditPostModal"

export default function PostTools(props: { id: string }) {
	const { id } = props

	const { userId } = useUser()

	const [editOpen, setEditOpen] = useState(false)

	const [deletePost] = useMutation(DELETE_POST, {
		variables: { id },
		refetchQueries: [{ query: GET_FRIENDS_POSTS, variables: { userId } }],
	})

	return (
		<div className="h-0 w-0 flex flex-row items-center scale-0 group-hover:scale-100 origin-left transition-all duration-300">
			<EditPostModal open={editOpen} setOpen={setEditOpen} id={id} />
			<div className="w-12 relative top-0 -left-24 flex flex-col gap-2">
				<div className="greySurface iconButton" onClick={() => deletePost()}>
					<FiTrash2 />
				</div>
				<div className="greySurface iconButton" onClick={() => setEditOpen(true)}>
					<FiEdit3 />
				</div>
			</div>
		</div>
	)
}
