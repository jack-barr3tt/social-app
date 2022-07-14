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
	type: string
	className?: string
	onClick?: () => void
}

const styles: { [key: string]: string } = {
	red: "bg-red-50 border-red-200 hover:bg-red-100 hover:border-red-300",
	yellow: "bg-yellow-50 border-yellow-300 hover:bg-yellow-100",
	"dark-gray": "bg-gray-200 border-gray-400 hover:bg-gray-300",
	blue: "bg-blue-50 border-blue-300 hover:bg-blue-100",
	"dark-blue": "bg-blue-100 border-blue-300 hover:bg-blue-200",
	pink: "bg-fuchsia-50 border-fuchsia-300 hover:bg-fuchsia-100",
	green: "bg-green-50 border-green-300 hover:bg-green-100",
	violet: "bg-violet-50 border-violet-300 hover:bg-violet-100",
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
	const { type, className, onClick, children, ...rest } = props

	if (type && type in icons) {
		let styledClass = className + " " || ""

		const style = icons[type].style

		if (style) if (style in styles) styledClass += styles[style]

		return (
			<button
				{...rest}
				className={`graySurface iconButton ${styledClass}`}
				onClick={onClick}
				type="submit"
			>
				{icons[type].el({ size: 18 })}
			</button>
		)
	}

	return <div className="graySurface iconButton">{children}</div>
}
