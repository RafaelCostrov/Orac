import { useEffect, useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

function Paginacao({ paginaAtual, setPaginaAtual, totalPaginas }) {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkWidth = () => setIsMobile(window.innerWidth < 640); // sm breakpoint
		checkWidth();
		window.addEventListener("resize", checkWidth);
		return () => window.removeEventListener("resize", checkWidth);
	}, []);

	function gerarPaginas(currentPage, totalPages) {
		const pages = [];

		if (isMobile) {
			// Lógica simplificada para mobile
			if (totalPages <= 5) {
				for (let i = 1; i <= totalPages; i++) pages.push(i);
			} else if (currentPage <= 3) {
				pages.push(1, 2, 3, "...", totalPages);
			} else if (currentPage >= totalPages - 2) {
				pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
			} else {
				pages.push(1, "...", currentPage, "...", totalPages);
			}
		} else {
			// Lógica normal para desktop
			if (totalPages <= 7) {
				for (let i = 1; i <= totalPages; i++) pages.push(i);
			} else if (currentPage <= 4) {
				pages.push(1, 2, 3, 4, 5, "...", totalPages);
			} else if (currentPage >= totalPages - 3) {
				pages.push(
					1,
					"...",
					totalPages - 4,
					totalPages - 3,
					totalPages - 2,
					totalPages - 1,
					totalPages
				);
			} else {
				pages.push(
					1,
					"...",
					currentPage - 1,
					currentPage,
					currentPage + 1,
					"...",
					totalPages
				);
			}
		}

		return pages;
	}

	const paginas = gerarPaginas(paginaAtual, totalPaginas);

	return (
		<div className="flex justify-end mt-4 ml-2 space-x-1 text-xs">
			<button
				onClick={() => setPaginaAtual(paginaAtual - 1)}
				disabled={paginaAtual === 1}
				className="px-2 rounded-full bg-laranja-ora-300 hover:bg-azul-ora hover:text-laranja-ora transition-all duration-300 disabled:opacity-50 not-disabled:cursor-pointer"
			>
				<GrFormPrevious />
			</button>

			{paginas.map((num, idx) =>
				num === "..." ? (
					<span key={`ellipsis-${idx}`} className="px-2 py-1 text-gray-500">
						...
					</span>
				) : (
					<button
						key={`page-${idx}-${num}`}
						onClick={() => setPaginaAtual(num)}
						className={`px-2 py-1 rounded-full cursor-pointer ${
							paginaAtual === num
								? "bg-azul-ora text-laranja-ora hover:bg-laranja-ora hover:text-azul-ora transition-all duration-300"
								: "bg-laranja-ora-300 hover:bg-laranja-ora hover:text-azul-ora transition-all duration-300"
						}`}
					>
						{num}
					</button>
				)
			)}

			<button
				onClick={() => setPaginaAtual(paginaAtual + 1)}
				disabled={paginaAtual === totalPaginas}
				className="px-2 rounded-full bg-laranja-ora-300 hover:bg-azul-ora hover:text-laranja-ora transition-all duration-300 disabled:opacity-50 not-disabled:cursor-pointer"
			>
				<GrFormNext />
			</button>
		</div>
	);
}

export default Paginacao;
