import { IoAddCircle, IoSearchSharp } from "react-icons/io5";
import { IoMdRemoveCircle } from "react-icons/io";
import { FaFilter } from "react-icons/fa";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import Paginacao from "../components/comum/Paginacao";
import MenuFiltro from "../components/comum/MenuFiltro";
import InputUnico from "../components/comum/InputUnico";
import InputDuplo from "../components/comum/InputDuplo";
import Modal from "../components/comum/Modal";
import ButtonAdd from "../components/comum/ButtonAdd.jsx";

function Empresas({
	isFiltered,
	onClickFilter,
	onClickModal,
	onCloseModal,
	notifyAcerto,
	notifyErro,
	setLoading,
	modal,
	setModal,
}) {
	const [empresas, setEmpresas] = useState([]);
	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(1);
	const [cod, setCod] = useState("");
	const [nome, setNome] = useState("");
	const [cnpj, setCnpj] = useState("");
	const [regime, setRegime] = useState("");
	const [cidade, setCidade] = useState("");
	const [vencimento, setVencimento] = useState("");
	const [vencimentoMin, setVencimentoMin] = useState("");
	const [vencimentoMax, setVencimentoMax] = useState("");
	const [tipoCertificado, setTipoCertificado] = useState("");
	const [ceo, setCeO] = useState("");

	const fetchEmpresas = (page = 1) => {
		const params = new URLSearchParams();

		params.append("page", page - 1);
		if (cod) params.append("cod", cod);
		if (nome) params.append("nome", nome);
		if (cnpj) params.append("cnpj", cnpj);
		if (regime) params.append("regime", regime);
		if (cidade) params.append("cidade", cidade);

		fetch(`/api/empresas?${params.toString()}`)
			.then(response => {
				if (!response.ok) {
					throw new Error("Erro ao buscar empresas!");
				}
				return response.json();
			})
			.then(data => {
				setEmpresas(data.content);
				setTotalPages(data.totalPages);
			})
			.catch(error => {
				console.error("Erro ao buscar empresas:", error);
			});
	};

	const fetchEmpresasSemFiltro = (page = 1) => {
		const params = new URLSearchParams();
		params.append("page", page - 1);

		fetch(`/api/empresas?${params.toString()}`)
			.then(response => {
				if (!response.ok) {
					throw new Error("Erro ao buscar empresas!");
				}
				return response.json();
			})
			.then(data => {
				setEmpresas(data.content);
				setTotalPages(data.totalPages);
			})
			.catch(error => {
				console.error("Erro ao buscar empresas:", error);
			});
	};

	const handleAddEmpresa = async () => {
		setLoading(true);

		const formData = new FormData();
		formData.append("cod", cod);
		formData.append("nome", nome);
		formData.append("cnpj", cnpj);
		formData.append("regime", regime);
		formData.append("cidade", cidade);
		formData.append("vencimento", vencimento);
		formData.append("tipoCertificado", tipoCertificado);
		formData.append("ceo", ceo);

		try {
			const response = await fetch("/api/empresas", {
				method: "POST",
				body: formData,
			});

			const message = await response.text();
			if (response.ok) {
				notifyAcerto();
				onCloseModal();
			} else {
				toast.error("Erro ao adicionar empresa!");
				console.log(message);
			}
		} catch (error) {
			console.error("Erro ao adicionar empresa:", error);
			notifyErro();
		} finally {
			setLoading(false);
			limparForms();
		}
	};

	function formatarCNPJ(cnpj) {
		if (!cnpj) return "";
		return cnpj
			.replace(/\D/g, "")
			.replace(/^(\d{2})(\d)/, "$1.$2")
			.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
			.replace(/\.(\d{3})(\d)/, ".$1/$2")
			.replace(/(\d{4})(\d)/, "$1-$2")
			.slice(0, 18);
	}

	function formatarData(data) {
		if (!data) return "-";
		return data.replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$3/$2/$1");
	}

	function formatarDataEscrita(data) {
		if (!data) return "";
		const numeros = data.replace(/\D/g, "");
		let formatado = "";

		if (numeros.length <= 2) {
			formatado = numeros;
		} else if (numeros.length <= 4) {
			formatado = numeros.replace(/(\d{2})(\d{1,2})/, "$1/$2");
		} else {
			formatado = numeros.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
		}

		return formatado.slice(0, 10);
	}

	useEffect(() => {
		fetchEmpresas(currentPage);
	}, [currentPage]);

	const limparForms = () => {
		setCod("");
		setNome("");
		setCnpj("");
		setRegime("");
		setCidade("");
		setVencimento("");
		setVencimentoMin("");
		setVencimentoMax("");
		setTipoCertificado("");
		setCeO("");
		setCurrentPage(1);
		setTimeout(() => {
			fetchEmpresasSemFiltro(1);
		}, 0);
	};

	const algumFiltroAtivo = () => {
		return (
			cod ||
			nome ||
			cnpj ||
			regime ||
			cidade ||
			vencimentoMin ||
			vencimentoMax ||
			tipoCertificado ||
			ceo
		);
	};

	return (
		<>
			<section className="flex flex-col  p-4 h-screen  ">
				<div className="flex justify-between bg-azul-ora rounded-t-2xl py-2 px-10  ">
					<h1 className="text-3xl font-bold text-laranja-ora ">Empresas</h1>
					<div className="flex justify-between items-center text-laranja-ora space-x-6">
						<button onClick={() => onClickModal("adicionar")}>
							<IoAddCircle
								size={32}
								className="hover:scale-120 transition-all duration-200 cursor-pointer"
								title="Adicionar empresa"
							/>
						</button>
						<IoMdRemoveCircle
							size={32}
							className="hover:scale-120 transition-all duration-200 cursor-pointer"
							title="Remover empresa"
						/>
						<button onClick={onClickFilter}>
							<FaFilter
								size={24}
								className="hover:scale-120 transition-all duration-200 cursor-pointer"
								title="Filtrar empresas"
							/>
						</button>
					</div>
				</div>
				<MenuFiltro
					isFiltered={isFiltered}
					onClick={() => {
						setCurrentPage(1);
						fetchEmpresas(1);
					}}
					onClear={limparForms}
					filtrosAtivos={algumFiltroAtivo()}
				>
					<InputUnico
						nomeInput={"Código"}
						type={"number"}
						classNameDiv={"col-start-1 row-start-1"}
						value={cod}
						onChange={e => setCod(e.target.value)}
					/>
					<InputUnico
						nomeInput={"Nome"}
						type={"text"}
						classNameDiv={"col-start-1 row-start-2 col-span-2"}
						value={nome}
						onChange={e => setNome(e.target.value)}
					/>
					<InputUnico
						nomeInput={"CNPJ"}
						type={"text"}
						classNameDiv={"col-start-3 row-start-1 "}
						value={cnpj}
						onChange={e => setCnpj(formatarCNPJ(e.target.value))}
					/>
					<InputUnico
						nomeInput={"Regime"}
						type={"text"}
						classNameDiv={"col-start-3 row-start-2"}
						value={regime}
						onChange={e => setRegime(e.target.value)}
					/>
					<InputUnico
						nomeInput={"Cidade"}
						type={"text"}
						classNameDiv={"col-start-4 row-start-1"}
						value={cidade}
						onChange={e => setCidade(e.target.value)}
					/>
					<InputDuplo
						nomeInput={"Vencimento"}
						classNameDiv={"col-start-4 row-start-2"}
					></InputDuplo>
					<InputUnico
						nomeInput={"Status certificado"}
						type={"text"}
						classNameDiv={"col-start-5 row-start-2"}
					/>
					<InputUnico
						nomeInput={"Grupo"}
						type={"text"}
						classNameDiv={"col-start-2 row-start-1"}
					/>
				</MenuFiltro>
				<AnimatePresence>
					<motion.div
						layout
						transition={{ duration: 0.4, ease: "easeInOut" }}
						className=" bg-white p-4 rounded-b-lg shadow-md flex flex-col max-h-[calc(100vh-150px)]"
					>
						<table className="bg-white border border-gray-300 w-full table-fixed">
							<thead>
								<tr className="bg-gray-200 text-azul-ora">
									<th className="py-3 px-2 border-b border-gray-300 w-1/20">
										Cód
									</th>
									<th className="py-3 px-2 border-b border-gray-300 text-left">
										Nome
									</th>
									<th className="py-3 px-2 border-b border-gray-300 w-3/20">
										CNPJ
									</th>
									<th className="py-3 px-2 border-b border-gray-300 w-3/20">
										Regime
									</th>
									<th className="py-3 px-2 border-b border-gray-300 w-2/20">
										Cidade
									</th>
									<th className="py-3 px-2 border-b border-gray-300 w-3/20">
										Vencimento certificado
									</th>
									<th className="py-3 px-2 border-b border-gray-300 w-2/20">
										C&O
									</th>
								</tr>
							</thead>
						</table>
						<div className="flex-1 overflow-auto">
							<PerfectScrollbar>
								<table className="border border-gray-300 w-full table-fixed">
									<tbody className="text-center">
										{empresas.map((empresa, index) => (
											<tr
												key={empresa.cod}
												className={`transition-all duration-300 ${
													index % 2 === 0 ? "bg-white" : "bg-gray-100"
												} ${
													empresa.ceo === "CONTROLLER"
														? "hover:bg-laranja-ora-200"
														: "hover:bg-azul-ora-300"
												}`}
											>
												<td className="py-3 px-2 border-b border-gray-300 truncate whitespace-nowrap overflow-hidden w-1/20">
													{empresa.cod}
												</td>
												<td
													title={empresa.nome}
													className="py-3 px-2 border-b border-gray-300 truncate whitespace-nowrap overflow-hidden text-left"
												>
													{empresa.nome}
												</td>
												<td className="py-3 px-2 border-b border-gray-300 truncate whitespace-nowrap overflow-hidden w-3/20">
													{formatarCNPJ(empresa.cnpj)}
												</td>
												<td className="py-3 px-2 border-b border-gray-300 truncate whitespace-nowrap overflow-hidden w-3/20">
													{empresa.regime}
												</td>
												<td
													title={empresa.cidade}
													className="py-3 px-2 border-b border-gray-300 truncate whitespace-nowrap overflow-hidden w-2/20"
												>
													{empresa.cidade}
												</td>
												<td className="py-3 px-2 border-b border-gray-300 truncate whitespace-nowrap overflow-hidden w-3/20">
													{formatarData(empresa.vencimento)}
												</td>
												<td className="py-3 px-2 border-b border-gray-300 truncate whitespace-nowrap overflow-hidden w-2/20">
													{empresa.ceo}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</PerfectScrollbar>
						</div>
						<Paginacao
							paginaAtual={currentPage}
							setPaginaAtual={setCurrentPage}
							totalPaginas={totalPages}
						></Paginacao>
					</motion.div>
				</AnimatePresence>
			</section>
			{modal === "adicionar" && (
				<div className="relative w-screen h-screen overflow-visible z-50">
					<Modal
						onCloseModal={onCloseModal}
						size={"medium"}
						title={"Adicionar Empresas"}
					>
						<form
							onSubmit={e => {
								e.preventDefault();
								handleAddEmpresa();
							}}
							className="px-4 grid grid-cols-7 auto-rows-auto gap-4"
						>
							<InputUnico
								nomeInput={"Código"}
								type={"text"}
								classNameDiv={"col-start-1 row-start-1"}
								value={cod}
								onChange={e => setCod(e.target.value)}
							/>
							<InputUnico
								nomeInput={"CNPJ"}
								type={"text"}
								classNameDiv={"col-start-2 row-start-1  col-span-3"}
								value={cnpj}
								onChange={e => setCnpj(formatarCNPJ(e.target.value))}
							/>
							<InputUnico
								nomeInput={"Regime Tributario"}
								type={"text"}
								classNameDiv={"col-start-5 row-start-1  col-span-2"}
								value={regime}
								onChange={e => setRegime(e.target.value)}
							/>
							<InputUnico
								nomeInput={"Nome"}
								type={"text"}
								classNameDiv={"col-start-1 row-start-2  col-span-4"}
								value={nome}
								onChange={e => setNome(e.target.value)}
							/>
							<InputUnico
								nomeInput={"Cidade"}
								type={"text"}
								classNameDiv={"col-start-5 row-start-2  col-span-2"}
								value={cidade}
								onChange={e => setCidade(e.target.value)}
							/>
							<InputUnico
								nomeInput={"Vencimento do certificado"}
								type={"text"}
								classNameDiv={"col-start-1 row-start-3 col-span-3"}
								value={vencimento}
								onChange={e =>
									setVencimento(formatarDataEscrita(e.target.value))
								}
							/>
							<InputUnico
								nomeInput={"Tipo do certificado"}
								type={"text"}
								classNameDiv={"col-start-4 row-start-3 col-span-2"}
								value={tipoCertificado}
								onChange={e => setTipoCertificado(e.target.value)}
							/>
							<InputUnico
								nomeInput={"C&O"}
								type={"text"}
								classNameDiv={"col-start-6 row-start-3 col-span-2"}
								value={ceo}
								onChange={e => setCeO(e.target.value)}
							/>
							<div className="flex justify-center mb-5 gap-4 col-start-4 row-start-6">
								<ButtonAdd></ButtonAdd>
							</div>
						</form>
					</Modal>
				</div>
			)}
		</>
	);
}

export default Empresas;
