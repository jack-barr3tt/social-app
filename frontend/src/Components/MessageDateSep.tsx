import { format } from "date-fns"

export default function MessageDateSep(props: { date: Date }) {
	const { date } = props

	return (
		<div className="w-full flex flex-row items-center justify-center">
			<div className="border border-gray-400 py-2 px-8 rounded-lg">
				<p>{format(date, "ccc co MMM yyyy")}</p>
			</div>
		</div>
	)
}
