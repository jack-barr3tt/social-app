import { Dispatch, PropsWithChildren, SetStateAction } from "react"

export default function Modal(
	props: PropsWithChildren<{ open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }>
) {
	const { children, open, setOpen } = props

	if (!open) return <></>

	return (
		<div
			className="h-full w-full fixed top-0 left-0 bg-[#000000cc] flex items-center justify-center"
			onClick={() => setOpen(false)}
		>
			<div className="p-8 bgAccent z-2 w-1/2 max-h-1/2 rounded-3xl" onClick={(e) => e.stopPropagation()}>
				{children}
			</div>
		</div>
	)
}
