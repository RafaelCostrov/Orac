import { MdOutlineCleaningServices } from "react-icons/md";

function ButtonLimpar({ onClick, children }) {
	return (
		<div className="grid grid-cols-6 grid-auto-rows gap-4 ">
			{children}
			<button
				onClick={e => {
					e.preventDefault();
					onClick?.();
				}}
				className="flex items-center justify-self-end self-end bg-red-600 cursor-pointer text-white px-2 space-x-1 text-lg rounded-lg hover:scale-105 transition 
                duration-300 w-fit col-start-6 row-start-1"
			>
				<MdOutlineCleaningServices />
				<p>Remover</p>
			</button>
		</div>
	);
}

export default ButtonLimpar;
