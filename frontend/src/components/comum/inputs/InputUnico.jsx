const sizes = {
	small: "md:w-4/10",
	medium: "md:w-1/2",
	large: "md:w-7/10",
	extraLarge: "md:w-9/10",
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
				className={`bg-white rounded-sm shadow-md border ${sizes[size]} border-gray-300 focus:outline-2 outline-offset-2 outline-laranja-ora pl-3 ${className}`}
				{...props}
			/>
		</div>
	);
}

export default InputUnico;
