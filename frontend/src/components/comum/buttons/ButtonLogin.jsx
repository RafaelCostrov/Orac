import { Link } from "react-router-dom";

function Button({ color, children, link, onClick, ...props }) {
	const button = (
		<button
			onClick={onClick}
			className={`rounded-lg w-full ${
				color === "laranja"
					? "bg-laranja-ora text-white hover:bg-laranja-ora-500 hover:text-white active:outline-azul-ora"
					: "bg-azul-ora text-white hover:bg-azul-ora-800 hover:text-white active:outline-laranja-ora"
			} px-2 py-1.5 shadow-lg hover:cursor-pointer
				transition duration-300 active:outline-2 active:transition-none active:outline-offset-2`}
			{...props}
		>
			{children}
		</button>
	);

	return link ? (
		<Link className="w-5/12" to={link}>
			{button}
		</Link>
	) : (
		<div className="w-5/12">{button}</div>
	);
}

export default Button;
