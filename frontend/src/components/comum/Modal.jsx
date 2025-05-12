import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosClose } from "react-icons/io";

function Modal({ onCloseModal, modal, buttons, size, title, children }) {
	const sizes = {
		mini: "w-2/10 h-4/10",
		small: "w-3/10 h-5/10",
		medium: "w-4/10 h-6/10",
		large: "w-5/10 h-7/10",
		extraLarge: "w-6/10 h-8/10",
	};

	const modalRef = useRef(null);

	const [clickInside, setClickInside] = useState(false);

	const handleMouseUp = () => {
		if (!clickInside) {
			onCloseModal();
		}
	};

	const handleMouseDown = mouse => {
		if (modalRef.current?.contains(mouse.target)) {
			setClickInside(true);
		} else {
			setClickInside(false);
		}
	};

	return (
		<AnimatePresence>
			{modal !== null && (
				<motion.div
					className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onMouseDown={handleMouseDown}
					onMouseUp={handleMouseUp}
				>
					<motion.div
						className={`relative bg-white rounded-lg shadow-lg ${sizes[size]} flex flex-col justify-between`}
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.8, opacity: 0 }}
						ref={modalRef}
					>
						<button
							className="absolute top-0 right-0 m-4 opacity-50 hover:scale-130 cursor-pointer transition duration-300 hover:text-red-700 hover:opacity-100"
							onClick={onCloseModal}
						>
							<IoIosClose size={24} />
						</button>
						<h2 className="text-xl text-azul-ora font-semibold p-4 border-b border-gray-200">
							{title}
						</h2>
						<div className="h-full flex items-center justify-center">
							{children}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default Modal;
