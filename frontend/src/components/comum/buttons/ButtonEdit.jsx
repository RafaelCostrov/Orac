function ButtonEdit({ focado }) {
	return (
		<button
			type="submit"
			className={`${
				focado
					? "bg-azul-ora active:ring-offset-laranja-ora text-white hover:bg-white hover:text-azul-ora border-azul-ora  active:outline-3 border-2 "
					: "bg-gray-200 text-gray-800 border-gray-200 border-2"
			} self-center h-fit text-xs md:text-lg w-fit font-medium
              px-2 space-x-1 text-md rounded-lg cursor-pointer hover:scale-105 transition-all duration-300`}
			disabled={!focado}
		>
			{focado ? "Salvar" : "Editar"}
		</button>
	);
}

export default ButtonEdit;
