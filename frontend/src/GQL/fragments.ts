import { gql } from "@apollo/client"

export const CHAT_MEMBERS = gql`
	fragment ChatMemberIDs on Chat {
		users {
			id
		}
	}
`

export const FRIENDS = gql`
	fragment Friends on User {
		friends {
			id
			username
		}
	}
`

export const FRIENDS_IDS = gql`
	fragment FriendsIDs on User {
		friends {
			id
		}
	}
`

export const USER_CHAT_MEMBERS = gql`
	fragment UserChatMembers on User {
		chats {
			id
			users {
				id
			}
		}
	}
`

export const FRIEND_REQUESTS = gql`
	fragment FriendRequests on User {
		sentFriendRequests {
			id
			receiver {
				id
				username
			}
		}
		receivedFriendRequests {
			id
			sender {
				id
				username
			}
		}
	}
`

export const BASIC_CHAT_INFO = gql`
	fragment BasicChatInfo on Chat {
		id
		name
		owner {
			id
		}
	}
`

export const BASIC_USER_INFO = gql`
	fragment BasicUserInfo on User {
		id
		username
	}
`

export const POSTS_INFO = gql`
	fragment PostsInfo on Post {
		id
		user {
			id
			username
		}
		likes
		likedBy {
			id
		}
		edited
		title
		content
		createdAt
	}
`
