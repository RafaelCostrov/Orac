import React, { useState, useRef, useEffect } from "react";
import { FaRegCircleUser } from "react-icons/fa6";
import { CgDarkMode } from "react-icons/cg";
import { motion, AnimatePresence } from "framer-motion";

function Dropdown({ nome }) {
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef(null);

	const toggleDropdown = () => {
		setOpen(prev => !prev);
	};

	useEffect(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("nome");
		localStorage.removeItem("tasks");
		window.location.href = "/login";
	};

	return (
		<div className="relative inline-block text-left" ref={dropdownRef}>
			<div
				className="flex space-x-2 justify-center items-center cursor-pointer"
				onClick={toggleDropdown}
			>
				<h2>{nome}</h2>
				<FaRegCircleUser size={36} />
			</div>

			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
						className="absolute right-0 bg-white border border-gray-300 mt-2 rounded shadow-lg z-10"
					>
						<ul className="p-2">
							<li className="py-1 px-2 hover:bg-gray-100 transition-all duration-300 cursor-pointer">
								Meu Perfil
							</li>
							<li className="py-1 px-2 hover:bg-gray-100 transition-all duration-300 cursor-pointer flex items-center space-x-2">
								<span className="text-nowrap">Modo Escuro</span>
								<CgDarkMode />
							</li>
							<li
								className="py-1 px-2 text-red-500 hover:bg-gray-100 transition-all duration-300 cursor-pointer"
								onClick={handleLogout}
							>
								Sair
							</li>
						</ul>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default Dropdown;
