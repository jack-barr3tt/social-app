import { useEffect } from "react"
import useLocalStorage from "./useLocalStorage"

const useDarkMode = () => {
	const [enabled, setEnabled] = useLocalStorage<boolean>({
		key: "dark-theme",
		initialValue: false,
	})

	useEffect(() => {
		const className = "dark"
		const bodyClass = window.document.body.classList

		enabled ? bodyClass.add(className) : bodyClass.remove(className)
	}, [enabled])

	const toggle = () => setEnabled((curr) => !curr)

    
	useEffect(() => {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
		systemTheme.addEventListener("change", () => {
			if (systemTheme.matches != null) setEnabled(systemTheme.matches)
		})

	}, [setEnabled])

	return [enabled, toggle] as [boolean, () => void]
}

export default useDarkMode
