import { useQuery } from "@apollo/client"
import { useState } from "react"
import { FiPlus } from "react-icons/fi"
import IconButton from "../Components/IconButton"
import NewPostModal from "../Components/NewPostModal"
import Post from "../Components/Post"
import { GET_FRIENDS_POSTS } from "../GQL/queries"
import { Post as APIPost } from "../graphql"
import { useUser } from "../Hooks/useUser"

export default function Posts() {
	const { userId } = useUser()

	const [open, setOpen] = useState(false)

	const { data: { friendPosts: posts = [] } = {} } = useQuery<{ friendPosts: APIPost[] }>(
		GET_FRIENDS_POSTS,
		{
			variables: {
				userId,
			},
		}
	)

	return (
		<>
			{posts.length < 1 && <p className="pt-4">Nobody has posted anything yet...</p>}
			<NewPostModal open={open} setOpen={setOpen} />
			<div className="flex flex-col gap-8 items-center pt-8">
				{[...posts]
					.sort(
						(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
					)
					.map((p) => (
						<Post id={p.id} key={p.id}/>
					))}
			</div>
			<IconButton
				onClick={() => setOpen(true)}
				className="fixed right-8 bottom-8"
				type="new"
			/>
		</>
	)
}
