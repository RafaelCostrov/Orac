import { TbReceiptTax } from "react-icons/tb";
import { BsPeopleFill } from "react-icons/bs";
import { RiShip2Fill } from "react-icons/ri";
import { HiBuildingOffice2 } from "react-icons/hi2";
import CeO from "../../assets/images/c&o.png";
function SideBar({ isOpen, setIsOpen }) {
	return (
		<aside
			onMouseEnter={() => setIsOpen(true)}
			onMouseLeave={() => setIsOpen(false)}
			className={`absolute top-16 left-0 h-full shadow-2xl bg-white text-azul-ora transition-all duration-400 flex flex-col z-10 items-center pt-30 ${
				isOpen ? "w-48" : "w-16"
			}`}
		>
			<ul
				className={`absolute flex flex-col space-y-8 transition-all items-center duration-400  ${
					isOpen ? "opacity-0" : ""
				}`}
			>
				<li>
					<TbReceiptTax size={36} />
				</li>
				<li>
					<BsPeopleFill size={32} />
				</li>
				<li>
					<RiShip2Fill size={32} />
				</li>
				<li>
					<HiBuildingOffice2 size={32} />
				</li>
			</ul>
			<ul
				className={`flex flex-col space-y-4 transition-all duration-400 ${
					isOpen ? "" : "opacity-0"
				}`}
			>
				<li>
					<button className="text-left font-semibold pb-1 transition-all duration-300 hover:text-laranja-ora cursor-pointer flex gap-1 items-center">
						<TbReceiptTax size={24} /> Fiscal
					</button>
					<ul
						className={`pl-4 space-y-1.5 overflow-hidden transition-all duration-500 ease-in-out`}
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
				</li>
				<li>
					<button className="w-full text-left font-semibold pb-1 transition-all duration-300 hover:text-laranja-ora cursor-pointer flex gap-1 items-center">
						<BsPeopleFill size={20} />
						Pessoal
					</button>
					<ul
						className={`pl-4 space-y-1.5 overflow-hidden transition-all duration-500 ease-in-out`}
					>
						<li className="transition-all duration-300 hover:text-laranja-ora cursor-pointer">
							eSocial
						</li>
						<li className="transition-all duration-300 hover:text-laranja-ora cursor-pointer">
							RAIS
						</li>
					</ul>
				</li>
				<li>
					<button className="w-full text-left font-semibold pb-1 transition-all duration-300 hover:text-laranja-ora cursor-pointer flex gap-1 items-center">
						<RiShip2Fill size={20} /> Onboarding
					</button>
				</li>
				<li>
					<button className="w-full text-left font-semibold pb-1 transition-all duration-300 hover:text-laranja-ora cursor-pointer flex gap-1 items-center">
						<HiBuildingOffice2 size={20} /> Empresas
					</button>
					<ul
						className={`pl-4 space-y-1.5 overflow-hidden transition-all duration-500 ease-in-out`}
					>
						<li className="transition-all duration-300 hover:text-laranja-ora cursor-pointer">
							Certificados
						</li>
					</ul>
				</li>
			</ul>
			<a
				className="mt-auto pb-20"
				href="https://www.instagram.com/controllereoraculus/"
				target="_blank"
			>
				<img
					className="w-14 cursor-pointer transition-all duration-300 hover:scale-120 "
					src={CeO}
					alt="Logo C&O"
				/>
			</a>
		</aside>
	);
}

export default SideBar;
