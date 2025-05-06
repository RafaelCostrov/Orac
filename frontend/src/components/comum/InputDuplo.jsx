function InputDuplo({ nomeInput, classNameDiv }) {
	return (
		<div className={`flex flex-col gap-1 ${classNameDiv}`}>
			<label className="font-bold text-white">{nomeInput}</label>
			<div className="flex gap-2">
				<input
					type="number"
					className={`bg-slate-100 rounded-sm shadow-md border w-1/2  border-gray-300 focus:outline-2 outline-offset-2 outline-laranja-ora`}
					placeholder="Min"
				/>
				<input
					type="number"
					className={`bg-slate-100 rounded-sm shadow-md border w-1/2  border-gray-300 focus:outline-2 outline-offset-2 outline-laranja-ora`}
					placeholder="Max"
				/>
			</div>
		</div>
	);
}

export default InputDuplo;
