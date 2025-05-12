function ButtonCancelar({ onClickModal }) {
	return (
		<button
			type="button"
			className={`
					 bg-indigo-700 active:ring-offset-indigo-700 text-white hover:bg-white hover:text-indigo-700 border-indigo-700 border-2 active:outline-3
			} self-center h-fit w-fit  font-medium
              px-2 space-x-1 text-md rounded-lg cursor-pointer hover:scale-105 transition-all duration-300`}
			onClick={() => {
				onClickModal("detalhes");
			}}
		>
			Cancelar
		</button>
	);
}

export default ButtonCancelar;
