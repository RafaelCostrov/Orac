const sizes = {
	small: "w-4/10",
	medium: "w-1/2",
	large: "w-7/10",
	extraLarge: "w-9/10",
};

function InputUnico({
	nomeInput,
	type,
	className,
	size,
	classNameLabel,
	classNameDiv,
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
				className={`bg-white rounded-sm shadow-md border ${sizes[size]} border-gray-300 focus:outline-2 outline-offset-2 outline-laranja-ora pl-3${className} pl-1`}
				{...props}
			/>
		</div>
	);
}

export default InputUnico;
