import { ButtonHTMLAttributes, useMemo } from "react"
import { IconType } from "react-icons"
import {
	FiCheck,
	FiEdit3,
	FiHome,
	FiLogOut,
	FiMessageSquare,
	FiPlus,
	FiSave,
	FiSend,
	FiSettings,
	FiSlash,
	FiTrash2,
	FiUserPlus,
	FiUsers,
	FiUserX,
} from "react-icons/fi"

type DefaultIcons = { [key: string]: { el: IconType; style?: string } }

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
	type?: string
	className?: string
}

const icons: DefaultIcons = {
	home: { el: FiHome, style: "violet" },
	delete: { el: FiTrash2, style: "red" },
	edit: { el: FiEdit3, style: "yellow" },
	settings: { el: FiSettings, style: "dark-gray" },
	save: { el: FiSave, style: "blue" },
	new: { el: FiPlus, style: "blue" },
	leave: { el: FiLogOut, style: "red" },
	message: { el: FiMessageSquare, style: "blue" },
	friends: { el: FiUsers, style: "pink" },
	"add-friend": { el: FiUserPlus, style: "green" },
	unfriend: { el: FiUserX, style: "red" },
	done: { el: FiCheck, style: "green" },
	cancel: { el: FiSlash, style: "red" },
	send: { el: FiSend, style: "dark-blue" },
}

export default function IconButton(props: IconButtonProps) {
	const { type, className, children, ...rest } = props

	if (type && type in icons) {
		let styledClass = className + " " || ""

		const style = icons[type].style

		if (style) styledClass += style

		return (
			<button
				{...rest}
				className={`${style ? "" : "cSurface"} iconButton ${styledClass}`}
				type="submit"
			>
				{icons[type].el({ size: 18 })}
			</button>
		)
	}

	return (
		<button className={`cSurface iconButton ${className}`} {...rest}>
			{children}
		</button>
	)
}
