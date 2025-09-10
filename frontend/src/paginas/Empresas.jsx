import { IoAddCircle, IoSearchSharp } from "react-icons/io5";
import { RiImportFill, RiExportFill } from "react-icons/ri";
import { IoMdRemoveCircle } from "react-icons/io";
import { FaFilter, FaTrash, FaFileCsv, FaFilePdf } from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "react-perfect-scrollbar/dist/css/styles.css";
import Paginacao from "../components/comum/Paginacao.jsx";
import MenuFiltro from "../components/comum/MenuFiltro.jsx";
import InputUnico from "../components/comum/inputs/InputUnico.jsx";
import InputDuplo from "../components/comum/inputs/InputDuplo.jsx";
import InputEdicao from "../components/comum/inputs/InputEdicao.jsx";
import Modal from "../components/comum/Modal.jsx";
import ButtonAdd from "../components/comum/buttons/ButtonAdd.jsx";
import {
	formatarCNPJ,
	validaCNPJ,
	formatarDataEscrita,
	formatarDataBD,
} from "../utils/formatters.js";
import ButtonEdit from "../components/comum/buttons/ButtonEdit.jsx";
import ButtonRemover from "../components/comum/buttons/ButtonRemover.jsx";
import ButtonCancelar from "../components/comum/buttons/ButtonCancelar.jsx";

function Empresas({
	isFiltered,
	onClickFilter,
	onClickModal,
	onCloseModal,
	notifyAcerto,
	notifyErro,
	setLoading,
	modal,
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
	const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
	const [focado, setFocado] = useState(false);
	const [removerLote, setRemoverLote] = useState(false);
	const [empresasSelecionadas, setEmpresasSelecionadas] = useState([]);
	const [menuOpen, setMenuOpen] = useState(false);

	const camposObrigatorios = {
		cod: "Código",
		nome: "Nome",
		cnpj: "CNPJ",
	};
	const token = localStorage.getItem("token");
	const fetchEmpresas = (page = 1) => {
		setLoading(true);
		const params = new URLSearchParams();

		params.append("page", page - 1);
		if (cod) params.append("cod", cod);
		if (nome) params.append("nome", nome);
		if (cnpj) params.append("cnpj", cnpj);
		if (regime) params.append("regime", regime);
		if (cidade) params.append("cidade", cidade);
		if (vencimentoMin)
			params.append("vencimentoMin", formatarDataBD(vencimentoMin));
		if (vencimentoMax)
			params.append("vencimentoMax", formatarDataBD(vencimentoMax));

		fetch(`/api/empresas?${params.toString()}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then(response => {
				if (!response.ok) {
					throw new Error("Erro ao buscar empresas!");
				}
				return response.json();
			})
			.then(data => {
				setEmpresas(data.content);
				setTotalPages(data.totalPages);
				setLoading(false);
			})
			.catch(error => {
				console.error("Erro ao buscar empresas:", error);
			});
	};

	const fetchEmpresasSemFiltro = (page = 1) => {
		setLoading(true);
		const params = new URLSearchParams();
		params.append("page", page - 1);

		fetch(`/api/empresas?${params.toString()}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
			.then(response => {
				if (!response.ok) {
					throw new Error("Erro ao buscar empresas!");
				}
				return response.json();
			})
			.then(data => {
				setEmpresas(data.content);
				setTotalPages(data.totalPages);
				setLoading(false);
			})
			.catch(error => {
				console.error("Erro ao buscar empresas:", error);
			});
	};

	const handleAddEmpresa = async () => {
		setLoading(true);

		if (!validaCNPJ(cnpj)) {
			notifyErro("CNPJ inválido!");
			setLoading(false);
			return;
		}

		const payload = {
			cod,
			nome,
			cnpj,
			regime,
			cidade,
			vencimento,
			tipoCertificado,
			ceo,
		};

		for (const campo in camposObrigatorios) {
			if (!payload[campo]) {
				notifyErro(`O campo '${camposObrigatorios[campo]}' é obrigatório!`);
				setLoading(false);
				return;
			}
		}

		if (!payload.cod || !payload.nome || !payload.cnpj) {
			notifyErro("Preencha todos os campos obrigatórios!");
			setLoading(false);
			return;
		}

		try {
			const response = await fetch("/api/empresas", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(payload),
			});

			const message = await response.text();
			if (response.ok) {
				notifyAcerto(message);
				onCloseModal();
				limparForms();
			} else {
				notifyErro(message);
				console.log(message);
			}
		} catch (error) {
			console.error("Erro ao adicionar empresa:", error);
			notifyErro(error);
		} finally {
			setLoading(false);
		}
	};

	const handleAtualizarEmpresa = async () => {
		setLoading(true);

		if (!validaCNPJ(empresaSelecionada.cnpj)) {
			notifyErro("CNPJ inválido!");
			setLoading(false);
			return;
		}

		const payload = {
			cod: empresaSelecionada.cod,
			nome: empresaSelecionada.nome,
			cnpj: empresaSelecionada.cnpj,
			regime: empresaSelecionada.regime,
			cidade: empresaSelecionada.cidade,
			vencimento: empresaSelecionada.vencimento,
			tipoCertificado: empresaSelecionada.tipoCertificado,
			ceo: empresaSelecionada.ceo,
		};

		for (const campo in camposObrigatorios) {
			if (!payload[campo]) {
				notifyErro(`O campo '${camposObrigatorios[campo]}' é obrigatório!`);
				setLoading(false);
				return;
			}
		}

		try {
			const response = await fetch(`/api/empresas/${empresaSelecionada.cod}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(payload),
			});
			const message = await response.text();
			console.log(message);
			if (response.ok) {
				notifyAcerto("Empresa atualizada com sucesso!");
				onCloseModal();
				limparForms();
			} else {
				notifyErro(message);
				console.log(message);
			}
		} catch (error) {
			console.error("Erro ao atualizar empresa:", error);
			notifyErro(error);
		} finally {
			setLoading(false);
		}
	};

	const handleRemoverEmpresa = async () => {
		setLoading(true);
		<Modal>
			<div></div>
		</Modal>;
		try {
			const response = await fetch(`/api/empresas/${empresaSelecionada.cod}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			const message = await response.text();

			if (!response.ok) {
				notifyErro(message);
				setLoading(false);
				throw new Error(message);
			}
			setLoading(false);
			notifyAcerto(message);
			onCloseModal();
			fetchEmpresas();
		} catch (error) {
			console.error("Erro ao remover empresa:", error);
			notifyErro("Erro ao remover empresa.");
		}
	};

	const handleRemoverEmLote = async () => {
		if (empresasSelecionadas.length === 0) {
			notifyErro("Selecione pelo menos uma empresa para remover.");
			return;
		}
		setLoading(true);
		try {
			const promises = empresasSelecionadas.map(cod =>
				fetch(`/api/empresas/${cod}`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				})
			);
			const responses = await Promise.all(promises);
			const erros = [];
			for (let i = 0; i < responses.length; i++) {
				if (!responses[i].ok) {
					const message = await responses[i].text();
					erros.push(
						`Erro ao remover empresa ${empresasSelecionadas[i]}: ${message}`
					);
				}
			}
			if (erros.length) {
				erros.forEach(message => notifyErro(message));
			} else {
				notifyAcerto("Empresas removidas com sucesso!");
			}
			setEmpresasSelecionadas([]);
			setRemoverLote(false);
			fetchEmpresas();
		} catch (error) {
			console.error("Erro ao remover empresas:", error);
			notifyErro("Erro ao remover empresas.");
		} finally {
			setLoading(false);
		}
	};

	const handleExportarEmpresas = async formato => {
		setLoading(true);
		try {
			const params = new URLSearchParams();

			if (cod) params.append("cod", cod);
			if (nome) params.append("nome", nome);
			if (cnpj) params.append("cnpj", cnpj);
			if (regime) params.append("regime", regime);
			if (cidade) params.append("cidade", cidade);
			if (vencimentoMin)
				params.append("vencimentoMin", formatarDataBD(vencimentoMin));
			if (vencimentoMax)
				params.append("vencimentoMax", formatarDataBD(vencimentoMax));

			const response = await fetch(
				`/api/empresas/exportar/${formato}?${params.toString()}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			if (!response.ok) {
				const message = await response.text();
				notifyErro(`Erro ao exportar empresas: ${message}`);
				setLoading(false);
				throw new Error(message);
			}
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `empresas.${formato}`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
			notifyAcerto(
				`Empresas exportadas com sucesso para ${formato.toUpperCase()}!`
			);
			setLoading(false);
		} catch (error) {
			console.error("Erro ao exportar empresas:", error);
			notifyErro("Erro ao exportar empresas.");
			setLoading(false);
		}
	};

	const handleImportar = async () => {
		setLoading(true);
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = ".csv";
		fileInput.onchange = async e => {
			const file = e.target.files[0];
			if (!file) {
				notifyErro("Nenhum arquivo selecionado.");
				setLoading(false);
				return;
			}
			if (file.type !== "text/csv") {
				notifyErro("Por favor, selecione um arquivo CSV.");
				setLoading(false);
				return;
			}
			const formData = new FormData();
			formData.append("file", file);
			try {
				const response = await fetch("/api/empresas/importar", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
					},
					body: formData,
				});
				const message = await response.text();
				if (!response.ok) {
					notifyErro(`Erro ao importar empresas: ${message}`);
					setLoading(false);
					throw new Error(message);
				}
				notifyAcerto("Empresas importadas com sucesso!");
				onCloseModal();
				limparForms();
			} catch (error) {
				console.error("Erro ao importar empresas:", error);
				notifyErro("Erro ao importar empresas.");
				setLoading(false);
			}
		};
		fileInput.click();
	};

	const handleBaixarModelo = () => {
		const cabecalho =
			"cod;nome;cnpj;regime;cidade;vencimento;tipoCertificado;ceo";
		const exemplo1 =
			"1;Empresa A;12345678000100;Simples Nacional;São Paulo;15/07/2025;A1;CONTROLLER";
		const exemplo2 =
			"2;Empresa B;98765432000199;Lucro Presumido;Guarulhos;30/06/2025;A3;ORACULUS";

		const conteudo = "\uFEFF" + [cabecalho, exemplo1, exemplo2].join("\n");
		const blob = new Blob([conteudo], { type: "text/csv;charset=utf-8;" });

		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "modelo_empresas.csv";
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);
	};

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
			<section className="flex flex-col h-dvh p-2 md:p-4">
				<div className="flex flex-col md:flex-row md:justify-between bg-azul-ora rounded-t-2xl">
					{/*Visível apenas em md ou maior*/}
					<div className="hidden md:flex w-full px-4 py-2 justify-between items-center space-x-6">
						<h1 className="font-bold text-laranja-ora text-2xl sm:text-lg md:text-xl lg:text-2xl">
							Empresas
						</h1>
						<div className="text-laranja-ora flex space-x-4">
							<button onClick={() => onClickModal("importar")}>
								<RiImportFill
									size={28}
									className="hover:scale-120 transition-all duration-200 cursor-pointer"
									title="Importar"
								/>
							</button>
							<button onClick={() => onClickModal("exportar")}>
								<RiExportFill
									size={28}
									className="hover:scale-120 transition-all duration-200 cursor-pointer"
									title="Exportar"
								/>
							</button>
							<button onClick={() => onClickModal("adicionar")}>
								<IoAddCircle
									size={32}
									className="hover:scale-120 transition-all duration-200 cursor-pointer"
									title="Adicionar empresa"
								/>
							</button>
							<button
								onClick={() => {
									setEmpresasSelecionadas([]);
									setRemoverLote(!removerLote);
								}}
							>
								<IoMdRemoveCircle
									size={32}
									className="hover:scale-120 transition-all duration-200 cursor-pointer"
									title="Remover empresa"
								/>
							</button>
							<button onClick={onClickFilter}>
								<FaFilter
									size={24}
									className="hover:scale-120 transition-all duration-200 cursor-pointer"
									title="Filtrar empresas"
								/>
							</button>
						</div>
					</div>

					{/* Botão hamburguer visível apenas em telas pequenas */}
					<div className="flex md:hidden justify-between px-3 items-center py-1">
						<h1 className="font-bold text-laranja-ora text-xl">Empresas</h1>
						<button
							onClick={() => setMenuOpen(!menuOpen)}
							className="text-laranja-ora"
						>
							{menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
						</button>
					</div>

					{menuOpen && (
						<div className="flex flex-col px-4 py-2 items-end space-y-4 md:hidden text-laranja-ora">
							<div className="flex items-center gap-4">
								<button
									className="flex items-center gap-2 active:scale-95 transition-all duration-200"
									onClick={() => onClickModal("importar")}
								>
									Importar <RiImportFill size={24} title="Importar" />
								</button>
								<button
									className="flex items-center gap-2 active:scale-95 transition-all duration-200"
									onClick={() => onClickModal("exportar")}
								>
									Exportar
									<RiExportFill size={24} title="Exportar" />
								</button>
							</div>
							<div className="flex items-center gap-4">
								<button
									className="flex items-center gap-2 active:scale-95 transition-all duration-200"
									onClick={() => onClickModal("adicionar")}
								>
									Adicionar
									<IoAddCircle size={26} title="Adicionar empresa" />
								</button>
								<button
									className="flex items-center gap-2 active:scale-95 transition-all duration-200"
									onClick={() => setRemoverLote(!removerLote)}
								>
									Remover
									<IoMdRemoveCircle size={26} title="Remover empresa" />
								</button>
							</div>
							<button
								className="flex items-center gap-2 active:scale-95 transition-all duration-200"
								onClick={onClickFilter}
							>
								Filtrar
								<FaFilter size={22} title="Filtrar empresas" />
							</button>
						</div>
					)}
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
						classNameDiv={"md:col-start-1 md:row-start-1"}
						value={cod}
						onChange={e => setCod(e.target.value)}
					/>
					<InputUnico
						nomeInput={"Nome"}
						type={"text"}
						classNameDiv={"md:col-start-1 md:row-start-2 md:col-span-2"}
						value={nome}
						onChange={e => setNome(e.target.value)}
					/>
					<InputUnico
						nomeInput={"CNPJ"}
						type={"text"}
						classNameDiv={"md:col-start-2 md:row-start-1"}
						value={cnpj}
						onChange={e => setCnpj(formatarCNPJ(e.target.value))}
					/>
					<InputUnico
						nomeInput={"Regime"}
						type={"text"}
						classNameDiv={"md:col-start-3 md:row-start-2"}
						value={regime}
						onChange={e => setRegime(e.target.value)}
					/>
					<InputUnico
						nomeInput={"Cidade"}
						type={"text"}
						classNameDiv={"md:col-start-3 md:row-start-1"}
						value={cidade}
						onChange={e => setCidade(e.target.value)}
					/>
					<InputDuplo
						nomeInput={"Vencimento"}
						type={"text"}
						classNameDiv={"md:col-start-4 md:row-start-2"}
						onMinChange={e =>
							setVencimentoMin(formatarDataEscrita(e.target.value))
						}
						onMaxChange={e =>
							setVencimentoMax(formatarDataEscrita(e.target.value))
						}
						minValue={vencimentoMin}
						maxValue={vencimentoMax}
					></InputDuplo>
				</MenuFiltro>
				<AnimatePresence>
					<motion.div
						layout
						transition={{ duration: 0.4, ease: "easeInOut" }}
						className=" bg-white rounded-b-lg shadow-md flex flex-col max-h-[calc(100dvh-80px)] md:max-h-[calc(100dvh-150px)] p-2 md:p-4"
					>
						{/* Tabela dupla para telas maiores */}
						<div className="hidden lg:block overflow-x-auto w-full md:overflow-visible scrollbar-hide">
							<table className="bg-white border border-gray-300 w-full lg:table-fixed min-w-[800px]">
								<thead>
									<tr className="bg-gray-200 text-azul-ora">
										<th className="py-3 px-2 border-b border-gray-300 w-1/20 text-xs md:text-sm">
											Cód
										</th>
										<th className="py-3 px-2 border-b border-gray-300 text-left text-xs md:text-sm">
											Nome
										</th>
										<th className="py-3 px-2 border-b border-gray-300 w-3/20 text-xs md:text-sm">
											CNPJ
										</th>
										<th className="py-3 px-2 border-b border-gray-300 w-3/20 text-xs md:text-sm">
											Regime
										</th>
										<th className="py-3 px-2 border-b border-gray-300 w-2/20 text-xs md:text-sm">
											Cidade
										</th>
										<th className="py-3 px-2 border-b border-gray-300 w-3/20 text-xs md:text-sm">
											Vencimento Cert.
										</th>
										<th className="py-3 px-2 border-b border-gray-300 w-2/20 text-xs md:text-sm">
											C&O
										</th>
										{removerLote && (
											<th className="py-3 px-2 border-b border-gray-300 w-1/20 text-xs md:text-sm">
												<div className="flex justify-center items-center">
													<FaTrash />
												</div>
											</th>
										)}
									</tr>
								</thead>
							</table>
						</div>
						<div className="hidden md:block md:flex-1 overflow-auto scrollbar-hide ">
							<div className="overflow-x-auto w-full md:overflow-visible">
								<table className="border border-gray-300 w-full lg:table-fixed min-w-[700px]">
									<tbody className="text-center">
										{empresas.map((empresa, index) => (
											<tr
												key={empresa.cod}
												className={`transition-all duration-300 cursor-pointer ${empresa.ceo === "CONTROLLER"
													? "hover:bg-laranja-ora-200"
													: "hover:bg-azul-ora-300"
													} ${empresasSelecionadas.includes(empresa.cod)
														? "bg-red-100 hover:bg-red-200"
														: index % 2 === 0
															? "bg-white"
															: "bg-gray-100"
													}`}
												onClick={
													removerLote
														? () => {
															setEmpresasSelecionadas(prev =>
																prev.includes(empresa.cod)
																	? prev.filter(cod => cod !== empresa.cod)
																	: [...prev, empresa.cod]
															);
														}
														: () => {
															onClickModal("detalhes");
															setEmpresaSelecionada(empresa);
														}
												}
											>
												<td className="py-3 px-2 border-b border-gray-300 md:truncate md:whitespace-nowrap md:overflow-hidden 
												md:w-1/20 sm:text-xs md:text-sm">
													{empresa.cod}
												</td>
												<td
													title={empresa.nome}
													className="py-3 px-2 border-b border-gray-300 truncate whitespace-nowrap overflow-hidden text-left sm:text-xs md:text-sm"
												>
													{empresa.nome}
												</td>
												<td className="py-3 px-2 border-b border-gray-300 md:truncate md:whitespace-nowrap md:overflow-hidden md:w-3/20 sm:text-xs md:text-sm">
													{formatarCNPJ(empresa.cnpj)}
												</td>
												<td className="py-3 px-2 border-b border-gray-300 md:truncate md:whitespace-nowrap md:overflow-hidden md:w-3/20 sm:text-xs md:text-sm">
													{empresa.regime}
												</td>
												<td
													title={empresa.cidade}
													className="py-3 px-2 border-b border-gray-300 md:truncate md:whitespace-nowrap md:overflow-hidden md:w-2/20 sm:text-xs md:text-sm"
												>
													{empresa.cidade}
												</td>
												<td className="py-3 px-2 border-b border-gray-300 md:truncate md:whitespace-nowrap md:overflow-hidden md:w-3/20 sm:text-xs md:text-sm">
													{empresa.vencimento}
												</td>
												<td className="py-3 px-2 border-b border-gray-300 md:truncate md:whitespace-nowrap md:overflow-hidden md:w-2/20 sm:text-xs md:text-sm">
													{empresa.ceo}
												</td>
												{removerLote && (
													<td className="py-3 px-2 border-b border-gray-300 md:truncate md:whitespace-nowrap md:overflow-hidden md:w-1/20 sm:text-xs md:text-sm">
														<input
															type="checkbox"
															checked={empresasSelecionadas.includes(
																empresa.cod
															)}
															onChange={e => {
																if (e.target.checked) {
																	setEmpresasSelecionadas(prev => [
																		...prev,
																		empresa.cod,
																	]);
																} else {
																	setEmpresasSelecionadas(prev =>
																		prev.filter(cod => cod !== empresa.cod)
																	);
																}
															}}
														/>
													</td>
												)}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>

						{/* Tabela única para telas menores */}
						<div className="block lg:hidden overflow-x-auto scrollbar-hide w-full">
							<table className="bg-white border border-gray-300 w-full lg:table-fixed min-w-[800px]">
								<thead>
									<tr className="bg-gray-200 text-azul-ora">
										<th className="py-3 px-2 border-b border-gray-300 w-1/20 text-xs md:text-sm">
											Cód
										</th>
										<th className="py-3 px-2 border-b border-gray-300 text-left text-xs md:text-sm">
											Nome
										</th>
										<th className="py-3 px-2 border-b border-gray-300 w-3/20 text-xs md:text-sm">
											CNPJ
										</th>
										<th className="py-3 px-2 border-b border-gray-300 w-3/20 text-xs md:text-sm">
											Regime
										</th>
										<th className="py-3 px-2 border-b border-gray-300 w-2/20 text-xs md:text-sm">
											Cidade
										</th>
										<th className="py-3 px-2 border-b border-gray-300 w-3/20 text-xs md:text-sm">
											Vencimento Cert.
										</th>
										<th className="py-3 px-2 border-b border-gray-300 w-2/20 text-xs md:text-sm">
											C&O
										</th>
										{removerLote && (
											<th className="py-3 px-2 border-b border-gray-300 w-1/20 text-xs md:text-sm">
												<div className="flex justify-center items-center">
													<FaTrash />
												</div>
											</th>
										)}
									</tr>
								</thead>
								<tbody className="text-center">
									{empresas.map((empresa, index) => (
										<tr
											key={empresa.cod}
											className={`transition-all duration-300 cursor-pointer ${empresa.ceo === "CONTROLLER"
												? "hover:bg-laranja-ora-200"
												: "hover:bg-azul-ora-300"
												} ${empresasSelecionadas.includes(empresa.cod)
													? "bg-red-100 hover:bg-red-200"
													: index % 2 === 0
														? "bg-white"
														: "bg-gray-100"
												}`}
											onClick={
												removerLote
													? () => {
														setEmpresasSelecionadas(prev =>
															prev.includes(empresa.cod)
																? prev.filter(cod => cod !== empresa.cod)
																: [...prev, empresa.cod]
														);
													}
													: () => {
														onClickModal("detalhes");
														setEmpresaSelecionada(empresa);
													}
											}
										>
											<td className="py-3 px-2 border-b border-gray-300 text-xs ">
												{empresa.cod}
											</td>
											<td
												title={empresa.nome}
												className="py-3 px-2 border-b border-gray-300 text-xs max-w-[300px] truncate whitespace-nowrap overflow-hidden text-left"
											>
												{empresa.nome}
											</td>
											<td className="py-3 px-2 border-b border-gray-300 text-xs  truncate">
												{formatarCNPJ(empresa.cnpj)}
											</td>
											<td className="py-3 px-2 border-b border-gray-300 text-xs ">
												{empresa.regime}
											</td>
											<td
												title={empresa.cidade}
												className="py-3 px-2 border-b border-gray-300 text-xs "
											>
												{empresa.cidade}
											</td>
											<td className="py-3 px-2 border-b border-gray-300 text-xs ">
												{empresa.vencimento}
											</td>
											<td className="py-3 px-2 border-b border-gray-300 text-xs ">
												{empresa.ceo}
											</td>
											{removerLote && (
												<td className="py-3 px-2 border-b border-gray-300 text-xs ">
													<input
														type="checkbox"
														checked={empresasSelecionadas.includes(empresa.cod)}
														onChange={e => {
															if (e.target.checked) {
																setEmpresasSelecionadas(prev => [
																	...prev,
																	empresa.cod,
																]);
															} else {
																setEmpresasSelecionadas(prev =>
																	prev.filter(cod => cod !== empresa.cod)
																);
															}
														}}
													/>
												</td>
											)}
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div className="flex pb-5 md:pb-0 lg:flex-row justify-end md:items-end sm:gap-2 md:gap-4 lg:gap-6">
							{removerLote && (
								<div className="mt-4">
									<ButtonRemover onClick={() => onClickModal("confirmacao")} />
								</div>
							)}
							<Paginacao
								paginaAtual={currentPage}
								setPaginaAtual={setCurrentPage}
								totalPaginas={totalPages}
							/>
						</div>
					</motion.div>
				</AnimatePresence>
			</section>

			{modal === "exportar" && (
				<Modal
					onCloseModal={onCloseModal}
					size={"small"}
					title={"Exportar Empresas"}
				>
					<div className="flex space-x-4 p-4">
						<div
							onClick={() => handleExportarEmpresas("csv")}
							className="flex flex-col space-y-8 text-azul-ora hover:text-green-600 border-1 border-gray-500 rounded-lg shadow-xl p-4 h-full hover:scale-105
						 transition-all duration-300 cursor-pointer justify-center items-center"
						>
							<h2 className="text-lg font-semibold ">Exportar para CSV</h2>
							<FaFileCsv size={102} className="text-green-700"></FaFileCsv>
						</div>
						<div
							onClick={() => handleExportarEmpresas("pdf")}
							className="flex flex-col space-y-8 border-1 hover:text-red-600 text-azul-ora border-gray-500 rounded-lg shadow-xl p-4 h-full hover:scale-105
						 transition-all duration-300 cursor-pointer justify-center items-center"
						>
							<h2 className="text-lg font-semibold ">Exportar para PDF</h2>
							<FaFilePdf className="text-red-700" size={102}></FaFilePdf>
						</div>
					</div>
				</Modal>
			)}
			{modal === "importar" && (
				<Modal
					onCloseModal={onCloseModal}
					size={"small"}
					title={"Importar Empresas"}
				>
					<div className="flex flex-col space-y-4 items-center gap-4 p-4">
						<h2 className="text-lg text-azul-ora">
							Para importar, basta baixar o modelo e preencher conforme está
							descrito.
						</h2>
						<div className="flex space-x-8 items-center justify-center w-full">
							<div
								onClick={() => handleBaixarModelo()}
								className="flex flex-col space-y-8 border-1 hover:text-green-600 text-azul-ora border-gray-500 rounded-lg shadow-xl py-4 px-8 w-4/10 h-full hover:scale-105
						 transition-all duration-300 cursor-pointer justify-center items-center"
							>
								<h2 className="text-lg font-semibold ">Modelo</h2>
								<FaFileCsv className="text-green-700" size={72}></FaFileCsv>
							</div>
							<div
								onClick={() => handleImportar()}
								className="flex flex-col space-y-8 border-1 hover:text-laranja-ora text-azul-ora border-gray-500 rounded-lg shadow-xl py-4 px-8 w-4/10 h-full hover:scale-105
						 transition-all duration-300 cursor-pointer justify-center items-center"
							>
								<h2 className="text-lg font-semibold ">Importar</h2>
								<RiImportFill
									className="text-laranja-ora"
									size={72}
								></RiImportFill>
							</div>
						</div>
					</div>
				</Modal>
			)}
			{modal === "adicionar" && (
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
						className="p-4 grid grid-cols-7 auto-rows-auto space-x-4 h-full"
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
							classNameDiv={"col-start-5 row-start-1  col-span-3"}
							value={regime}
							onChange={e => setRegime(e.target.value)}
						/>
						<InputUnico
							nomeInput={"Nome"}
							type={"text"}
							classNameDiv={"col-start-1 row-start-3  col-span-4"}
							value={nome}
							onChange={e => setNome(e.target.value)}
						/>
						<InputUnico
							nomeInput={"Cidade"}
							type={"text"}
							classNameDiv={"col-start-5 row-start-3  col-span-2"}
							value={cidade}
							onChange={e => setCidade(e.target.value)}
						/>
						<InputUnico
							nomeInput={"Vencimento do certificado"}
							classNameDiv={"col-start-1 row-start-5 col-span-3"}
							value={vencimento}
							onChange={e => setVencimento(formatarDataEscrita(e.target.value))}
						/>
						<InputUnico
							nomeInput={"Tipo do certificado"}
							type={"text"}
							classNameDiv={"col-start-4 row-start-5 col-span-2"}
							value={tipoCertificado}
							onChange={e => setTipoCertificado(e.target.value)}
						/>
						<InputUnico
							nomeInput={"C&O"}
							type={"text"}
							classNameDiv={"col-start-6 row-start-5 col-span-2"}
							value={ceo}
							onChange={e => setCeO(e.target.value)}
						/>
						<div className="flex justify-center gap-4 col-start-4 row-start-7">
							<ButtonAdd></ButtonAdd>
						</div>
					</form>
				</Modal>
			)}
			{modal === "detalhes" && empresaSelecionada && (
				<Modal
					size={"medium"}
					onCloseModal={() => {
						onCloseModal();
						setEmpresaSelecionada(null);
						setFocado(false);
					}}
					title={"Detalhes da Empresa"}
				>
					<form
						onClick={() => {
							setFocado(true);
						}}
						onSubmit={e => {
							e.preventDefault();
							handleAtualizarEmpresa();
						}}
						className="p-4 grid grid-cols-7 auto-rows-auto space-x-4 h-full"
					>
						<InputEdicao
							nomeInput={"Código"}
							type={"number"}
							value={empresaSelecionada.cod}
							classNameDiv={"col-start-1 row-start-1"}
							disabled={true}
						></InputEdicao>
						<InputEdicao
							nomeInput={"CNPJ"}
							value={formatarCNPJ(empresaSelecionada.cnpj)}
							classNameDiv={"col-start-2 row-start-1  col-span-3"}
							onChange={e =>
								setEmpresaSelecionada({
									...empresaSelecionada,
									cnpj: e.target.value,
								})
							}
							focado={focado}
						></InputEdicao>
						<InputEdicao
							nomeInput={"Regime Tributário"}
							value={empresaSelecionada.regime}
							classNameDiv={"col-start-5 row-start-1 col-span-3"}
							onChange={e =>
								setEmpresaSelecionada({
									...empresaSelecionada,
									regime: e.target.value,
								})
							}
							focado={focado}
						></InputEdicao>
						<InputEdicao
							nomeInput={"Nome"}
							value={empresaSelecionada.nome}
							classNameDiv={"col-start-1 row-start-2 col-span-4 row-start-3"}
							onChange={e =>
								setEmpresaSelecionada({
									...empresaSelecionada,
									nome: e.target.value,
								})
							}
							focado={focado}
						></InputEdicao>
						<InputEdicao
							nomeInput={"Cidade"}
							value={empresaSelecionada.cidade}
							classNameDiv={"col-start-5 row-start-2 col-span-2 row-start-3"}
							onChange={e =>
								setEmpresaSelecionada({
									...empresaSelecionada,
									cidade: e.target.value,
								})
							}
							focado={focado}
						></InputEdicao>
						<InputEdicao
							nomeInput={"Vencimento do certificado"}
							value={empresaSelecionada.vencimento}
							classNameDiv={"col-start-1 row-start-3 col-span-3 row-start-5"}
							onChange={e =>
								setEmpresaSelecionada({
									...empresaSelecionada,
									vencimento: formatarDataEscrita(e.target.value),
								})
							}
							focado={focado}
						></InputEdicao>
						<InputEdicao
							nomeInput={"Tipo do certificado"}
							value={empresaSelecionada.tipoCertificado}
							classNameDiv={"col-start-4 row-start-3 col-span-2 row-start-5"}
							onChange={e =>
								setEmpresaSelecionada({
									...empresaSelecionada,
									tipoCertificado: e.target.value,
								})
							}
							focado={focado}
						></InputEdicao>
						<InputEdicao
							nomeInput={"C&O"}
							value={empresaSelecionada.ceo}
							classNameDiv={"col-start-6 row-start-3 col-span-2 row-start-5"}
							onChange={e =>
								setEmpresaSelecionada({
									...empresaSelecionada,
									ceo: e.target.value,
								})
							}
							focado={focado}
						></InputEdicao>
						<div className="flex space-x-10 justify-center gap-4 col-start-4 row-start-7">
							<ButtonRemover
								onClick={() => onClickModal("confirmacao")}
							></ButtonRemover>
							<ButtonEdit focado={focado}></ButtonEdit>
						</div>
					</form>
				</Modal>
			)}
			{modal === "confirmacao" &&
				(empresaSelecionada || empresasSelecionadas.length > 0) && (
					<Modal
						onCloseModal={onCloseModal}
						size={"mini"}
						title={"Remover Empresas"}
					>
						<div
							className={`flex flex-col items-center ${removerLote ? "gap-12" : "gap-6"
								}  px-5`}
						>
							{!removerLote && (
								<>
									<p>
										Deseja excluir a empresa:
										<br />
										<br /> {empresaSelecionada.cod} - {empresaSelecionada.nome}
									</p>
									<div className="flex gap-4">
										<ButtonCancelar
											onClickModal={onClickModal}
										></ButtonCancelar>
										<ButtonRemover
											onClick={handleRemoverEmpresa}
										></ButtonRemover>
									</div>
								</>
							)}
							{removerLote && (
								<>
									<p>Deseja excluir as empresas selecionadas?</p>
									<div className="flex gap-4">
										<ButtonCancelar
											onClickModal={onClickModal}
										></ButtonCancelar>
										<ButtonRemover
											onClick={handleRemoverEmLote}
										></ButtonRemover>
									</div>
								</>
							)}
						</div>
					</Modal>
				)}
		</>
	);
}

export default Empresas;
