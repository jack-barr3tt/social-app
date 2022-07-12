import { useUser } from "../Hooks/useUser"
import { Message as APIMessage } from "../graphql"
import { format, isSameMinute, isToday } from "date-fns"
import { useCallback, useEffect, useState } from "react"
import { useQuery } from "@apollo/client"
import { MESSAGE } from "../GQL/queries"

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

		if (isSameMinute(new Date(), created)) {
			return "Now"
		} else if (isToday(created)) {
			return format(created, "HH:mm")
		} else {
			return format(created, "dd/MM/yyyy")
		}
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
						isOwnMessage ? "bg-blue-100 border-blue-300" : "bg-gray-100 border-gray-300"
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
