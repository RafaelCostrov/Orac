function Button(props) {
	return (
		<button
			className=" rounded-lg w-full bg-laranja-ora text-gray-800 px-2 py-1.5 shadow-lg hover:bg-azul-ora 
            hover:text-laranja-ora transition duration-300 active:outline-2 active:transition-none active:outline-offset-2 active:outline-azul-ora"
			{...props}
		>
			{props.children}
		</button>
	);
}

export default Button;
