import { useMutation } from "@apollo/client"
import { useState } from "react"
import { FiEdit3, FiHeart } from "react-icons/fi"
import { client } from "../ApolloClient"
import relativeTime from "../Functions/time"
import { POSTS_INFO } from "../GQL/fragments"
import { LIKE_POST } from "../GQL/mutations"
import { GET_POST_LIKES } from "../GQL/queries"
import { Post as APIPost } from "../graphql"
import { useUser } from "../Hooks/useUser"
import EditPostModal from "./EditPostModal"
import PostTools from "./PostTools"

export default function Post(props: { id: string }) {
	const { id } = props

	const { userId } = useUser()

	const [editOpen, setEditOpen] = useState(false)

	const post = client.readFragment<APIPost>({
		id: `Post:${id}`,
		fragment: POSTS_INFO,
	})

	const [likePost] = useMutation(LIKE_POST, {
		variables: { postId: id },
		refetchQueries: [{ query: GET_POST_LIKES, variables: { id } }],
	})

	if (!post) return <></>

	return (
		<>
			<EditPostModal open={editOpen} setOpen={setEditOpen} id={id} />
			<div className="w-2/3 rounded-3xl cBorder p-8 flexRowCenter group bgAccent">
				{post.user.id === userId && (
					<PostTools id={id} openEdit={() => setEditOpen(true)} />
				)}
				<div className="w-full">
					<div className="flexRowBetween">
						<h4>{post.title}</h4>
						<p>{relativeTime(new Date(post.createdAt))}</p>
					</div>
					<p className="py-4">{post.content}</p>
					<div className="flexRowBetween cBorder lineOver py-4">
						<p>{post.user.username}</p>
						<div className="flexRowCenter gap-4">
							<FiHeart
								size="24"
								className={
									post.likedBy.some((u) => u.id === userId)
										? "fill-pink-600 stroke-pink-600"
										: ""
								}
								onClick={() => likePost()}
							/>
							<p>{post.likes}</p>
						</div>
					</div>
					{post.edited && (
						<div className="flex flex-row gap-2">
							<FiEdit3 className="text-xs subtleText" />
							<p className="text-xs subtleText">This post has been edited</p>
						</div>
					)}
				</div>
			</div>
		</>
	)
}
