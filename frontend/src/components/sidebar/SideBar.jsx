import { useState } from "react";
function SideBar({ isOpen, setIsOpen }) {
	const [openMenu, setOpenMenu] = useState(null);

	const toggleMenu = menu => {
		setOpenMenu(openMenu === menu ? null : menu);
	};

	return (
		<aside
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
			className={`fixed top-16 w-48 left-0 h-full shadow-2xl z-10 bg-white text-azul-ora transition-transform duration-400 transform flex flex-col justify-start py-40 px-6 ${
				isOpen ? "" : "-translate-x-32"
			}`}
		>
			<ul
				className={`flex flex-col space-y-2 transition-all duration-300 ${
					isOpen ? "" : "opacity-0"
				}`}
			>
				<li>
					<div
						onMouseEnter={() => toggleMenu("fiscal")}
						onMouseLeave={() => setOpenMenu(null)}
					>
						<button className="text-left font-semibold transition-all duration-300 hover:text-laranja-ora cursor-pointer">
							Fiscal
						</button>
						<ul
							className={`pl-4 space-y-1 overflow-hidden transition-all duration-500 ease-in-out ${
								openMenu === "fiscal" ? "max-h-40" : "max-h-0"
							}`}
						>
							<li className="transition-all duration-300 hover:text-laranja-ora cursor-pointer">
								SPED Fiscal
							</li>
							<li className="transition-all duration-300 hover:text-laranja-ora cursor-pointer">
								Apuração de ICMS
							</li>
							<li className="transition-all duration-300 hover:text-laranja-ora cursor-pointer">
								DCTF
							</li>
						</ul>
					</div>
				</li>
				<li>
					<div
						onMouseEnter={() => toggleMenu("pessoal")}
						onMouseLeave={() => setOpenMenu(null)}
					>
						<button className="w-full text-left font-semibold  transition-all duration-300 hover:text-laranja-ora cursor-pointer">
							Pessoal
						</button>
						<ul
							className={`pl-4 overflow-hidden transition-all duration-500 ease-in-out ${
								openMenu === "pessoal" ? "max-h-40" : "max-h-0"
							}`}
						>
							<li className="transition-all duration-300 hover:text-laranja-ora cursor-pointer">
								eSocial
							</li>
							<li className="transition-all duration-300 hover:text-laranja-ora cursor-pointer">
								RAIS
							</li>
						</ul>
					</div>
				</li>
				<li>
					<button className="w-full text-left font-semibold  transition-all duration-300 hover:text-laranja-ora cursor-pointer">
						Onboarding
					</button>
				</li>
				<li>
					<button className="w-full text-left font-semibold  transition-all duration-300 hover:text-laranja-ora cursor-pointer">
						Empresas
					</button>
				</li>
			</ul>
		</aside>
	);
}

export default SideBar;
