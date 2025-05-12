function ButtonAdd() {
	return (
		<button
			type="submit"
			className={`self-center h-fit w-fit bg-green-600 cursor-pointer font-medium text-white px-2 space-x-1 text-md rounded-lg hover:scale-105 active:outline-3 active:ring-offset-green-600 hover:bg-white border-2 border-green-600 hover:text-green-600 transition duration-300`}
		>
			Adicionar
		</button>
	);
}

export default ButtonAdd;
