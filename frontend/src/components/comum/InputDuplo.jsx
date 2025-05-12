function InputDuplo({
	nomeInput,
	classNameDiv,
	minValue,
	onMinChange,
	maxValue,
	onMaxChange,
}) {
	return (
		<div className={`flex flex-col gap-1 ${classNameDiv}`}>
			<label className="font-bold text-azul-ora">{nomeInput}</label>
			<div className="flex gap-2">
				<input
					type="text"
					className={`bg-white rounded-sm shadow-md border w-1/2  border-gray-300 focus:outline-2 outline-offset-2 outline-laranja-ora pl-1`}
					placeholder="Min"
					value={minValue}
					onChange={onMinChange}
				/>
				<input
					type="text"
					className={`bg-white rounded-sm shadow-md border w-1/2  border-gray-300 focus:outline-2 outline-offset-2 outline-laranja-ora pl-1`}
					placeholder="Max"
					value={maxValue}
					onChange={onMaxChange}
				/>
			</div>
		</div>
	);
}

export default InputDuplo;
