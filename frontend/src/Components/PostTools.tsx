import { useMutation } from "@apollo/client"
import { useState } from "react"
import { DELETE_POST } from "../GQL/mutations"
import { GET_FRIENDS_POSTS } from "../GQL/queries"
import { useUser } from "../Hooks/useUser"
import EditPostModal from "./EditPostModal"
import IconButton from "./IconButton"

export default function PostTools(props: { id: string }) {
	const { id } = props

	const { userId } = useUser()

	const [editOpen, setEditOpen] = useState(false)

	const [deletePost] = useMutation(DELETE_POST, {
		variables: { id },
		refetchQueries: [{ query: GET_FRIENDS_POSTS, variables: { userId } }],
	})

	return (
		<div className="h-0 w-0 flexRowCenter scale-0 group-hover:scale-100 origin-left transition-all duration-300">
			<EditPostModal open={editOpen} setOpen={setEditOpen} id={id} />
			<div className="w-20 relative top-0 -left-24 flex flex-col gap-2 pr-8">
				<IconButton type="delete" onClick={() => deletePost()} />
				<IconButton type="edit" onClick={() => setEditOpen(true)} />
			</div>
		</div>
	)
}
