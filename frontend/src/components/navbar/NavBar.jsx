import oracPadrao from "../../assets/images/orac-padrao.png";
import Dropdown from "./Dropdown";

function NavBar({ nome }) {
	return (
		<nav className=" flex justify-between items-center p-8 bg-white shadow-2xl h-16 top-0 left-0 ">
			<a>
				<img
					className="h-12 w-fit min-w-fit min-h-8 cursor-pointer"
					src={oracPadrao}
					alt="Logo Orac"
				/>
			</a>
			<div className="flex items-center text-azul-ora cursor-pointer space-x-50">
				<ul className="flex space-x-8 font-semibold ">
					<li className="cursor-pointer hover:text-laranja-ora hover:scale-110 transition-all duration-300">
						<a href="">Robôs</a>
					</li>
					<li className="cursor-pointer hover:text-laranja-ora hover:scale-110 transition-all duration-300">
						<a href="">Mapeamentos</a>
					</li>
					<li className="cursor-pointer hover:text-laranja-ora hover:scale-110 transition-all duration-300">
						<a href="">Dashboards</a>
					</li>
				</ul>
				<Dropdown nome={nome}></Dropdown>
			</div>
		</nav>
	);
}

export default NavBar;
