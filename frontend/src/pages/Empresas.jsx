import { IoAddCircle } from "react-icons/io5";
import { IoMdRemoveCircle } from "react-icons/io";
import { FaFilter } from "react-icons/fa";
import { use, useState, useEffect } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

function Empresas() {
	const [empresas, setEmpresas] = useState([]);
	const [cod, setCod] = useState("");
	const [empresa, setEmpresa] = useState("");
	const [cnpj, setCnpj] = useState("");
	const [regimeTributario, setRegimeTributario] = useState("");
	const [cidade, setCidade] = useState("");
	const [vencimento, setVencimento] = useState("");
	const [tipoCertificado, setTipoCertificado] = useState("");
	const [ceo, setCeO] = useState("");

	useEffect(() => {
		fetch("/api/empresas")
			.then(response => {
				if (!response.ok) {
					throw new Error("Erro ao buscar empresas!");
				}
				return response.json();
			})
			.then(data => setEmpresas(data))

			.catch(error => {
				console.error("Erro ao buscar empresas:", error);
			});
	}, []);

	return (
		<section className="flex flex-col px-4 py-8 h-screen">
			<div className="flex justify-between bg-azul-ora rounded-t-2xl py-2 px-10 ">
				<h1 className="text-3xl font-bold text-laranja-ora">Empresas</h1>
				<div className="flex justify-between items-center text-laranja-ora  space-x-6 cursor-pointer">
					<IoAddCircle
						size={32}
						className="hover:scale-120 transition-all duration-200"
					/>
					<IoMdRemoveCircle
						size={32}
						className="hover:scale-120 transition-all duration-200"
					/>
					<FaFilter
						size={24}
						className="hover:scale-120 transition-all duration-200"
					/>
				</div>
			</div>
			<PerfectScrollbar>
				<div className=" bg-white p-3 mb-10 rounded-b-lg shadow-md flex-grow overflow-y-auto ">
					<table className="bg-white border border-gray-300 overflow-hidden rounded-md shadow-md w-full">
						<thead>
							<tr className="bg-gray-200">
								<th className="py-2 px-4 border-b border-gray-300">Cód</th>
								<th className="py-2 px-4 border-b border-gray-300">Nome</th>
								<th className="py-2 px-4 border-b border-gray-300">CNPJ</th>
								<th className="py-2 px-4 border-b border-gray-300">Regime</th>
								<th className="py-2 px-4 border-b border-gray-300">Cidade</th>
								<th className="py-2 px-4 border-b border-gray-300">
									Vencimento certificado
								</th>
								<th className="py-2 px-4 border-b border-gray-300">C&O</th>
							</tr>
						</thead>
						<tbody className="text-center">
							{empresas.map(empresa => (
								<tr
									key={empresa.cod}
									className={`transition-all duration-300 ${
										empresa.ceo === "CONTROLLER"
											? "hover:bg-laranja-ora-200"
											: "hover:bg-azul-ora-300"
									}`}
								>
									<td className="py-2 px-4 border-b border-gray-300">
										{empresa.cod}
									</td>
									<td className="py-2 px-4 border-b border-gray-300">
										{empresa.empresa}
									</td>
									<td className="py-2 px-4 border-b border-gray-300">
										{empresa.cnpj}
									</td>
									<td className="py-2 px-4 border-b border-gray-300">
										{empresa.regimeTributario}
									</td>
									<td className="py-2 px-4 border-b border-gray-300">
										{empresa.cidade}
									</td>
									<td className="py-2 px-4 border-b border-gray-300">
										{empresa.vencimento}
									</td>
									<td className="py-2 px-4 border-b border-gray-300">
										{empresa.ceo}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</PerfectScrollbar>
		</section>
	);
}

export default Empresas;
