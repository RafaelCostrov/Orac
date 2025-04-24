import { FaRegCircleUser } from "react-icons/fa6";
import oracPadrao from "../../assets/images/orac-padrao.png";

function NavBar() {
	return (
		<div className=" flex justify-between items-center p-8 bg-white shadow-2xl z-10 h-16 top-0 left-0 ">
			<a>
				<img
					className="h-12 w-fit min-w-fit min-h-8 cursor-pointer"
					src={oracPadrao}
					alt="Logo Orac"
				/>
			</a>
			<div className="flex items-center space-x-4 text-azul-ora cursor-pointer">
				<h2 className="text-lg">Rafael Costrov</h2>
				<a>
					<FaRegCircleUser size={36} />
				</a>
			</div>
		</div>
	);
}

export default NavBar;
