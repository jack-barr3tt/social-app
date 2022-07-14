import { gql } from "@apollo/client"
import {
	BASIC_USER_INFO,
	FRIENDS,
	FRIEND_REQUESTS,
	POSTS_INFO,
	USER_CHAT_MEMBERS,
} from "./fragments"

export const CHAT_NAME = gql`
	query ChatName($id: String!) {
		chat(id: $id) {
			id
			name
		}
	}
`

export const CHAT_OWNER_ID = gql`
	query ChatOwnerId($id: String!) {
		chat(id: $id) {
			id
			owner {
				id
			}
		}
	}
`

export const USER_NAME = gql`
	query UserName($id: String!) {
		user(id: $id) {
			id
			username
		}
	}
`

export const USER_SOCIAL = gql`
	${BASIC_USER_INFO}
	${FRIENDS}
	${FRIEND_REQUESTS}
	${USER_CHAT_MEMBERS}
	query GetUser($id: String!) {
		user(id: $id) {
			id
			...BasicUserInfo
			...Friends
			...FriendRequests
			...UserChatMembers
		}
	}
`

export const GET_CHAT_IDS = gql`
	query GetChatIDs($id: String!) {
		user(id: $id) {
			id
			chats {
				id
			}
		}
	}
`

export const GET_CHAT = gql`
	query GetChat($chatId: String!) {
		chat(id: $chatId) {
			id
			name
			messages {
				id
				user {
					id
				}
				createdAt
			}
			users {
				id
			}
		}
	}
`

export const MESSAGE = gql`
	query GetMessage($id: String!) {
		message(id: $id) {
			id
			user {
				id
				username
			}
			content
			createdAt
		}
	}
`

export const GET_FRIENDS_POSTS = gql`
	${POSTS_INFO}
	query GetFriendsPosts($userId: String!) {
		friendPosts(userId: $userId) {
			...PostsInfo
		}
	}
`
export const GET_POST = gql`
	${POSTS_INFO}
	query GetPost($id: String!) {
		post(id: $id) {
			...PostsInfo
		}
	}
`

export const GET_POST_LIKES = gql`
	query GetPostLikes($id: String!) {
		post(id: $id) {
			id
			likes
			likedBy {
				id
			}
		}
	}
`
