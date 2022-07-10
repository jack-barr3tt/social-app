import { useUser } from "../Hooks/useUser"
import { Message as MessageType } from "../graphql"
import { format, isSameMinute, isToday } from "date-fns"
import { useCallback, useEffect, useState } from "react"

export default function Message(props: {
	message: MessageType
	group: boolean
	showTime: boolean
}) {
	const { message, group, showTime } = props
	const { userId } = useUser()

	const isOwnMessage = message.user.id === userId

	const calculateTime = useCallback(() => {
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
