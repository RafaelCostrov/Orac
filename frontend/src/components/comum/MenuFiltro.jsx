import { motion, AnimatePresence } from "framer-motion";
import { IoSearchSharp } from "react-icons/io5";
import { MdOutlineCleaningServices } from "react-icons/md";
import { useState } from "react";

function MenuFiltro({ isFiltered, children, onClick, onClear, filtrosAtivos }) {
	const [filtrado, setFiltrado] = useState(false);
	return (
		<AnimatePresence>
			{isFiltered && (
				<motion.div className="bg-white p-4">
					<form
						action=""
						method="get"
						className={`bg-gray-200 p-4 border shadow-lg border-gray-300 rounded-xl flex flex-col 
					}`}
					>
						<div className="grid grid-cols-6 grid-auto-rows gap-4 ">
							{children}
							{filtrado && (
								<button
									type="button"
									onClick={e => {
										e.preventDefault();
										onClear?.();
										setFiltrado(false);
									}}
									className="flex w-6/10 items-center justify-center justify-self-end self-end bg-red-500 cursor-pointer 
									font-medium text-white px-2 space-x-1 text-lg rounded-lg hover:scale-105 active:outline-3 active:ring-offset-black
									 hover:bg-white hover:text-red-500 border-1 border-red-500 hover:border-red-500 transition duration-300 col-start-6 row-start-1"
								>
									<MdOutlineCleaningServices />
									<p>Limpar</p>
								</button>
							)}
							<button
								type="submit"
								onClick={e => {
									e.preventDefault();
									if (filtrosAtivos) {
										setFiltrado(true);
										onClick?.();
									}
								}}
								className={`flex w-6/10 items-center justify-center justify-self-end self-end bg-azul-ora cursor-pointer font-medium text-laranja-ora px-2 space-x-1 text-lg rounded-lg hover:scale-105 active:outline-3 active:ring-offset-azul-ora hover:bg-laranja-ora border-1 border-azul-ora hover:text-azul-ora transition duration-300 col-start-6 row-start-2`}
							>
								<IoSearchSharp></IoSearchSharp>
								<p>Filtrar</p>
							</button>
						</div>
					</form>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default MenuFiltro;
