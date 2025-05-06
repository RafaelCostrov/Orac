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
			<label className={`font-bold text-white ${classNameLabel}`}>
				{nomeInput}
			</label>
			<input
				type={type}
				className={`bg-slate-100 rounded-sm shadow-md border ${sizes[size]} border-gray-300 focus:outline-2 outline-offset-2 outline-laranja-ora pl-3${className}`}
				{...props}
			/>
		</div>
	);
}

export default InputUnico;
