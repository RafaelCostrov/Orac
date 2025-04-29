import { IoAddCircle } from "react-icons/io5";
import { IoMdRemoveCircle } from "react-icons/io";
import { FaFilter } from "react-icons/fa";

function Empresas() {
	return (
		<section className="px-4 py-8 h-screen">
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
			<div className="bg-white p-6 rounded-b-lg shadow-md ">
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
						<tr className="transition-all duration-300 hover:bg-azul-ora-300">
							<td className="py-2 px-4 border-b border-gray-300">1</td>
							<td className="py-2 px-4 border-b border-gray-300">Empresa A</td>
							<td className="py-2 px-4 border-b border-gray-300">
								12.345.678/0001-90
							</td>
							<td className="py-2 px-4 border-b border-gray-300">
								Lucro Presumido
							</td>
							<td className="py-2 px-4 border-b border-gray-300">Guarulhos</td>
							<td className="py-2 px-4 border-b border-gray-300">14/10/2025</td>
							<td className="py-2 px-4 border-b border-gray-300">O</td>
						</tr>
						<tr className="transition-all duration-300 hover:bg-laranja-ora-200">
							<td className="py-2 px-4 border-b border-gray-300">2</td>
							<td className="py-2 px-4 border-b border-gray-300">Empresa B</td>
							<td className="py-2 px-4 border-b border-gray-300">
								00.371.829/0001-09
							</td>
							<td className="py-2 px-4 border-b border-gray-300">
								Lucro Presumido
							</td>
							<td className="py-2 px-4 border-b border-gray-300">Sao Paulo</td>
							<td className="py-2 px-4 border-b border-gray-300">19/06/2025</td>
							<td className="py-2 px-4 border-b border-gray-300">C</td>
						</tr>
						<tr className="transition-all duration-300 hover:bg-azul-ora-300">
							<td className="py-2 px-4 border-b border-gray-300">3</td>
							<td className="py-2 px-4 border-b border-gray-300">Empresa C</td>
							<td className="py-2 px-4 border-b border-gray-300">
								05.703.793/0001-29
							</td>
							<td className="py-2 px-4 border-b border-gray-300">
								Simples Nacional
							</td>
							<td className="py-2 px-4 border-b border-gray-300">Guarulhos</td>
							<td className="py-2 px-4 border-b border-gray-300">20/05/2025</td>
							<td className="py-2 px-4 border-b border-gray-300">O</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>
	);
}

export default Empresas;
