import { FiMoon, FiSun } from "react-icons/fi"
import useDarkMode from "../Hooks/useDarkMode"
import IconButton from "./IconButton"

export default function ThemeToggle() {
	const [_, toggle] = useDarkMode()

	return (
		<IconButton onClick={() => toggle()} className="darkThemeToggle">
			<FiMoon className="hidden dark:block" />
			<FiSun className="block dark:hidden" />
		</IconButton>
	)
}
