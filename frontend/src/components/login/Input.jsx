function Input({ icon, ...props }) {
	return (
		<div className="w-full flex">
			{icon && (
				<span className="border border-azul-ora bg-gray-200 placeholder-azul-ora px-4 py-1.5 rounded-l-xl shadow-md text-azul-ora">
					{icon && <span className="text-xl">{icon}</span>}
				</span>
			)}
			<input
				className="border border-azul-ora bg-gray-100 placeholder-azul-ora  px-4 py-1.5 rounded-r-xl shadow-md text-azul-ora w-full max-w-md"
				{...props}
			></input>
		</div>
	);
}

export default Input;
