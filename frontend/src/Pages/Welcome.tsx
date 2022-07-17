import GoogleButton from "react-google-button"

export default function Welcome() {
	const google = () => {
		window.open("http://localhost:3500", "_self")
	}

	return (
		<div className="flex flex-col items-center justify-center w-full h-full">
			<div className="flex flex-col gap-8 w-1/4 items-center">
				<h2>Social App</h2>
				<p className="text-center">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
					incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
					nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
				</p>
				<GoogleButton className="text-white" onClick={google} />
			</div>
		</div>
	)
}
