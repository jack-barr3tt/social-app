import { useMutation } from "@apollo/client"
import { FiEdit3, FiHeart } from "react-icons/fi"
import { client } from "../App"
import relativeTime from "../functions/time"
import { POSTS_INFO } from "../GQL/fragments"
import { LIKE_POST } from "../GQL/mutations"
import { GET_POST_LIKES } from "../GQL/queries"
import { Post as APIPost } from "../graphql"
import { useUser } from "../Hooks/useUser"
import PostTools from "./PostTools"

export default function Post(props: { id: string }) {
	const { id } = props

	const { userId } = useUser()

	const post = client.readFragment<APIPost>({
		id: `Post:${id}`,
		fragment: POSTS_INFO,
	})

	const [likePost] = useMutation(LIKE_POST, {
		variables: { userId, postId: id },
		refetchQueries: [{ query: GET_POST_LIKES, variables: { id } }],
	})

	if (!post) return <></>

	return (
		<div className="w-2/3 rounded-3xl border border-gray-300 p-8 flex flex-row items-center group">
			{post.user.id === userId && <PostTools id={id} />}
			<div className="w-full">
				<div className="flex flex-row justify-between">
					<h4>{post.title}</h4>
					<p>{relativeTime(new Date(post.createdAt))}</p>
				</div>
				<p className="py-4">{post.content}</p>
				<div className="flex flex-row justify-between border border-gray-300 border-x-0 border-b-0 py-4">
					<p>{post.user.username}</p>
					<div className="flex flex-row items-center gap-4">
						<FiHeart
							size="24"
							className={
								post.likedBy.some((u) => u.id === userId)
									? "fill-pink-700 stroke-pink-700"
									: ""
							}
							onClick={() => likePost()}
						/>
						<p>{post.likes}</p>
					</div>
				</div>
				{post.edited && (
					<div className="flex flex-row gap-2">
						<FiEdit3 className="text-xs text-gray-600" />
						<p className="text-xs text-gray-600">This post has been edited</p>
					</div>
				)}
			</div>
		</div>
	)
}
