import { useUser } from "../Hooks/useUser"
import { Message as APIMessage } from "../graphql"
import { useCallback, useEffect, useState } from "react"
import { useQuery } from "@apollo/client"
import { MESSAGE } from "../GQL/queries"
import relativeTime from "../Functions/time"

export default function Message(props: { id: string; group: boolean; showTime: boolean }) {
	const { id, group, showTime } = props
	const { userId } = useUser()

	const { data: { message } = {} } = useQuery<{ message: APIMessage }>(MESSAGE, {
		variables: { id },
	})

	const isOwnMessage = message && message.user.id === userId

	const calculateTime = useCallback(() => {
		if (!message) return ""

		const created = new Date(message.createdAt)

		return relativeTime(created)
	}, [])

	const [time, setTime] = useState(calculateTime())

	useEffect(() => {
		if (!showTime) return
		const interval = setInterval(() => {
			setTime(calculateTime())
		}, 1000)
		return () => clearInterval(interval)
	}, [])

	if (!message) return <></>

	return (
		<div className={`w-full flex flex-row ${isOwnMessage ? "justify-end" : "justify-start"}`}>
			<div className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}>
				<div
					className={`p-2 rounded-lg border-2 ${
						isOwnMessage ? "blue" : "msgGray"
					}`}
				>
					{group && <h4 className="pb-4">{message.user.username}</h4>}
					<p>{message.content}</p>
				</div>
				{showTime && (
					<p className={`timeDisplay ${isOwnMessage ? "pr-1" : "pl-1"}`}>{time}</p>
				)}
			</div>
		</div>
	)
}
