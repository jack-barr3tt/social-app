import { format } from "date-fns"

export default function MessageDateSep(props: { date: Date }) {
	const { date } = props

	return (
		<div className="w-full flexRowCenter justify-center">
			<div className="cBorder py-2 px-8 rounded-lg">
				<p>{format(date, "ccc co MMM yyyy")}</p>
			</div>
		</div>
	)
}
