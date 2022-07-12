import { Dispatch, PropsWithChildren, SetStateAction } from "react";

export default function Modal(props: PropsWithChildren<{ open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }>) {

    const { children, open, setOpen } = props

	if(open) return (
		<div
			className="h-full w-full absolute top-0 left-0 bg-[#000000cc] flex items-center justify-center"
			onClick={() => setOpen(false)}
		>
			<div
				className="p-8 bg-white z-2 w-1/2 max-h-1/2"
				onClick={(e) => e.stopPropagation()}
			>
                {children}
            </div>
		</div>
	)

    return <></>
}
