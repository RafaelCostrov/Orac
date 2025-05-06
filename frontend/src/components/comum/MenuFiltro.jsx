import { motion, AnimatePresence } from "framer-motion";
import { IoSearchSharp } from "react-icons/io5";

function MenuFiltro({ isFiltered, children, onClick }) {
	return (
		<AnimatePresence>
			{isFiltered && (
				<motion.form
					layout
					initial={{ opacity: 0, y: -20, height: "auto" }}
					animate={{ opacity: 1, y: 0, height: "auto" }}
					exit={{ opacity: 0, y: -20, height: "auto" }}
					transition={{ duration: 0.4, ease: "easeInOut" }}
					action=""
					method="get"
					className={`bg-azul-ora p-4 flex flex-col 
					}`}
				>
					<div className="grid grid-cols-6 grid-auto-rows gap-4 ">
						{children}
						<button
							type="submit"
							onClick={e => {
								e.preventDefault();
								onClick?.();
							}}
							className="flex items-center justify-self-end self-end bg-laranja-ora cursor-pointer text-azul-ora px-2 space-x-1 text-lg rounded-lg hover:scale-105 transition duration-300 w-fit col-start-6 row-start-2"
						>
							<IoSearchSharp></IoSearchSharp>
							<p>Filtrar</p>
						</button>
					</div>
				</motion.form>
			)}
		</AnimatePresence>
	);
}

export default MenuFiltro;
