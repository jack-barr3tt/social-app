import { ReactElement, ReactNode } from "react"

export default function Title(props: { children: ReactNode }) {
	const { children } = props

	const canBeText = (child: ReactNode) => ["string", "number", "boolean"].includes(typeof child)

	const getEl = (child: ReactNode): any => {
		if (Array.isArray(child)) return child.map(getEl)
		if (canBeText(child)) return <h2>{child}</h2>
		const childEl = child as ReactElement
		if (!childEl.props.children) return child
		return getEl(childEl.props.children)
	}

	return (
		<div className="grayBorder lineUnder pb-4 flex-none flexRowBetween">{getEl(children)}</div>
	)
}
