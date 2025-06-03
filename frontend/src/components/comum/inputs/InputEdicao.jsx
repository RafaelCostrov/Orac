const sizes = {
	small: "w-4/10",
	medium: "w-1/2",
	large: "w-7/10",
	extraLarge: "w-9/10",
};

function InputEdicao({
	nomeInput,
	type,
	className,
	size,
	classNameLabel,
	classNameDiv,
	value,
	focado,
	onChange,
	...props
}) {
	return (
		<div className={`flex flex-col gap-1 ${classNameDiv}`}>
			<label
				title={nomeInput}
				className={`font-bold text-azul-ora truncate flex-nowrap ${classNameLabel}`}
			>
				{nomeInput}
			</label>
			<input
				type={type}
				value={value}
				className={`${
					focado ? "bg-white" : "bg-gray-200"
				} rounded-sm shadow-md border ${
					sizes[size]
				} border-gray-300 focus:outline-2 outline-offset-2 outline-laranja-ora pl-3 ${className}`}
				onChange={onChange}
				{...props}
			/>
		</div>
	);
}

export default InputEdicao;
