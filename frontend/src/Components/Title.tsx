import { ReactElement, ReactNode } from "react"

export default function Title(props: { children: ReactNode }) {
	const { children } = props

	const canBeText = (child: ReactNode) => ["string", "number", "boolean"].includes(typeof child)

	const getEl = (child: ReactNode): any => {
		if (Array.isArray(child)) return child.map(getEl)
		if (canBeText(child)) return <h2>{child}</h2>
		const childEl = child as ReactElement
		if (childEl.props.children.length > 1) return getEl(childEl.props.children)
		return child
	}

	return (
		<div className="border border-gray-400 border-t-0 border-x-0 pb-4 flex-none flex flex-row justify-between">
			{getEl(children)}
		</div>
	)
}
