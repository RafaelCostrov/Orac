function Button(props) {
	return (
		<button
			className=" rounded-lg w-full bg-laranja-ora text-gray-800 px-2 py-1.5 shadow-md hover:bg-azul-ora 
            hover:text-laranja-ora transition duration-250 "
			{...props}
		>
			{props.children}
		</button>
	);
}

export default Button;
