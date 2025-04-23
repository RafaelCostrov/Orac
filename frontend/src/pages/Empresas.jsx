function Empresas() {
	return (
		<section className="px-4 py-8 h-screen">
			<h1 className="text-3xl font-bold mb-4">Empresas</h1>
			<table className="bg-white border border-gray-300 rounded-lg shadow-md">
				<thead>
					<tr className="bg-gray-200">
						<th className="py-2 px-4 border-b">ID</th>
						<th className="py-2 px-4 border-b">Nome</th>
						<th className="py-2 px-4 border-b">CNPJ</th>
						<th className="py-2 px-4 border-b">Ações</th>
					</tr>
				</thead>
				<tbody>
					<tr className="hover:bg-gray-100">
						<td className="py-2 px-4 border-b">1</td>
						<td className="py-2 px-4 border-b">Empresa A</td>
						<td className="py-2 px-4 border-b">12.345.678/0001-90</td>
						<td className="py-2 px-4 border-b">
							<button className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600">
								Editar
							</button>
							<button className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 ml-2">
								Excluir
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</section>
	);
}

export default Empresas;
