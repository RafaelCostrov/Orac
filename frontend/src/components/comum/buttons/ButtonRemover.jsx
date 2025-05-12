function ButtonRemover({ onClick }) {
	return (
		<button
			type="button"
			className={`
					 bg-red-500 active:ring-offset-red-500 text-white hover:bg-white hover:text-red-500 border-red-500 border-2 active:outline-3
			} self-center h-fit w-fit  font-medium
              px-2 space-x-1 text-md rounded-lg cursor-pointer hover:scale-105 transition-all duration-300`}
			onClick={onClick}
		>
			Remover
		</button>
	);
}

export default ButtonRemover;
