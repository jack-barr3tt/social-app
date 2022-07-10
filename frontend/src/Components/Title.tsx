export default function Title(props: { children: string }) {
	return (
		<div className="border border-gray-400 border-t-0 border-x-0 pb-4 flex-none">
			<h2>{props.children}</h2>
		</div>
	)
}
