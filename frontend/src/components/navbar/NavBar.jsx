import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import oracPadrao from "../../assets/images/orac-padrao.png";
import Dropdown from "./Dropdown";

function NavBar({ nome }) {
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<nav className="bg-white shadow-2xl p-4">
			<div className="flex justify-between items-center">
				<a>
					<img
						className="h-6 md:h-8 lg:h-10 w-auto min-w-[40px] cursor-pointer"
						src={oracPadrao}
						alt="Logo Orac"
					/>
				</a>

				{/* Botão do menu hamburguer para telas médias */}
				<div className="md:hidden">
					<button
						onClick={() => setMenuOpen(!menuOpen)}
						className="text-azul-ora"
					>
						{menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
					</button>
				</div>

				{/* Menu horizontal - visível apenas em telas médias */}
				<div className="hidden md:flex items-center space-x-6 text-azul-ora">
					<ul className="flex space-x-6 font-semibold">
						<li className="hover:text-laranja-ora hover:scale-110 transition-all duration-300">
							<a href="">Robôs</a>
						</li>
						<li className="hover:text-laranja-ora hover:scale-110 transition-all duration-300">
							<a href="">Mapeamentos</a>
						</li>
						<li className="hover:text-laranja-ora hover:scale-110 transition-all duration-300">
							<a href="">Dashboards</a>
						</li>
					</ul>
					<Dropdown nome={nome} />
				</div>
			</div>

			{menuOpen && (
				<div className="fixed inset-0 z-50 bg-white/70 backdrop-blur-md flex flex-col items-center justify-center space-y-8 md:hidden text-azul-ora text-lg font-semibold">
					<a href="/">
						<img
							className="h-10 sm:h-8 w-auto min-w-[40px] cursor-pointer"
							src={oracPadrao}
							alt="Logo Orac"
						/>
					</a>
					<a href="" className="active:scale-95 transition-all duration-200">
						Robôs
					</a>
					<a href="" className="active:scale-95 transition-all duration-200">
						Mapeamentos
					</a>
					<a href="" className="active:scale-95 transition-all duration-200">
						Dashboards
					</a>
					<Dropdown nome={nome} />

					{/* Botão de fechar adicional opcional */}
					<button
						className="absolute top-4 right-4 text-azul-ora"
						onClick={() => setMenuOpen(false)}
					>
						<FiX size={28} />
					</button>
				</div>
			)}
		</nav>
	);
}

export default NavBar;
