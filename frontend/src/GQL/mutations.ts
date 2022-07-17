import { gql } from "@apollo/client"

export const DELETE_CHAT = gql`
	mutation DeleteChat($id: String!) {
		deleteChat(id: $id)
	}
`

export const LEAVE_CHAT = gql`
	mutation LeaveChat($id: String!) {
		leaveChat(id: $id)
	}
`

export const UPDATE_MEMBERS = gql`
	mutation UpdateMembers($id: String!, $userIds: [String!]!) {
		editMembers(changes: { id: $id, userIds: $userIds })
	}
`

export const EDIT_CHAT_NAME = gql`
	mutation EditChatName($id: String!, $name: String!) {
		renameChat(id: $id, name: $name)
	}
`

export const SEND_FRIEND_REQUEST = gql`
	mutation SendFriendRequest($receiverId: String!) {
		sendFriendRequest(receiverId: $receiverId)
	}
`
export const REMOVE_FRIEND = gql`
	mutation RemoveFriend($friendId: String!) {
		unfriend(friendId: $friendId)
	}
`

export const CREATE_CHAT = gql`
	mutation CreateChat($userIds: [String!]!, $name: String) {
		createChat(chat: { userIds: $userIds, name: $name }) {
			id
		}
	}
`

export const ACCEPT_FRIEND_REQUEST = gql`
	mutation AcceptFriendRequest($id: String!) {
		acceptFriendRequest(id: $id)
	}
`

export const REJECT_FRIEND_REQUEST = gql`
	mutation RejectRequest($id: String!) {
		rejectFriendRequest(id: $id)
	}
`

export const REVOKE_FRIEND_REQUEST = gql`
	mutation RevokeRequest($id: String!) {
		revokeFriendRequest(id: $id)
	}
`

export const SEND_MESSAGE = gql`
	mutation SendMessage($chatId: String!, $content: String!) {
		createMessage(message: { chatId: $chatId, content: $content }) {
			id
			content
		}
	}
`

export const LIKE_POST = gql`
	mutation LikePost($postId: String!) {
		like(postId: $postId) {
			id
		}
	}
`

export const DELETE_POST = gql`
	mutation DeletePost($id: String!) {
		deletePost(id: $id)
	}
`

export const EDIT_POST = gql`
	mutation EditPost($id: String!, $title: String!, $content: String!) {
		editPost(id: $id, changes: { title: $title, content: $content }) {
			id
		}
	}
`

export const CREATE_POST = gql`
	mutation CreatePost($title: String!, $content: String!) {
		createPost(input: { title: $title, content: $content }) {
			id
		}
	}
`
