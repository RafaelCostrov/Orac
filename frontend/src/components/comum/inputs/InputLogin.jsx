function Input({ icon, ...props }) {
	return (
		<div className="w-full flex rounded-2xl bg-white shadow-md focus-within:ring-2 focus-within:ring-laranja-ora transition border border-gray-300">
			{icon && (
				<span className=" placeholder-azul-ora px-4 py-1.5  shadow-l-xl text-azul-ora">
					{icon && <span className="text-xl">{icon}</span>}
				</span>
			)}
			<input
				className="  placeholder-azul-ora py-1.5 text-azul-ora w-full max-w-md outline-none"
				{...props}
			></input>
		</div>
	);
}

export default Input;
