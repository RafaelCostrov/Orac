import { IoAddCircle, IoSearchSharp } from "react-icons/io5";
import { IoMdRemoveCircle } from "react-icons/io";
import { FaFilter, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import Paginacao from "../components/comum/Paginacao.jsx";
import MenuFiltro from "../components/comum/MenuFiltro.jsx";
import InputUnico from "../components/comum/InputUnico.jsx";
import InputDuplo from "../components/comum/InputDuplo.jsx";
import InputEdicao from "../components/comum/InputEdicao.jsx";
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

	const camposObrigatorios = {
		cod: "Código",
		nome: "Nome",
		cnpj: "CNPJ",
	};

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
						<button onClick={() => setRemoverLote(!removerLote)}>
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
						classNameDiv={"col-start-2 row-start-1 "}
						value={cnpj}
						onChange={e => setCnpj(formatarDataEscrita(e.target.value))}
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
						classNameDiv={"col-start-3 row-start-1"}
						value={cidade}
						onChange={e => setCidade(e.target.value)}
					/>
					<InputDuplo
						nomeInput={"Vencimento"}
						type={"text"}
						classNameDiv={"col-start-4 row-start-2"}
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
									{removerLote && (
										<th className="py-3 px-2 border-b border-gray-300 w-1/20">
											<div className="flex justify-center items-center">
												<FaTrash />
											</div>
										</th>
									)}
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
												className={`transition-all duration-300 cursor-pointer ${
													index % 2 === 0 ? "bg-white" : "bg-gray-100"
												} ${
													empresa.ceo === "CONTROLLER"
														? "hover:bg-laranja-ora-200"
														: "hover:bg-azul-ora-300"
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
													{empresa.vencimento}
												</td>
												<td className="py-3 px-2 border-b border-gray-300 truncate whitespace-nowrap overflow-hidden w-2/20">
													{empresa.ceo}
												</td>
												{removerLote && (
													<td className="py-3 px-2 border-b border-gray-300 truncate whitespace-nowrap overflow-hidden w-1/20">
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
							</PerfectScrollbar>
						</div>
						<div className="flex justify-end gap-6 items-end">
							{removerLote && (
								<div>
									<ButtonRemover
										onClick={() => onClickModal("confirmacao")}
									></ButtonRemover>
								</div>
							)}
							<Paginacao
								paginaAtual={currentPage}
								setPaginaAtual={setCurrentPage}
								totalPaginas={totalPages}
							></Paginacao>
						</div>
					</motion.div>
				</AnimatePresence>
			</section>
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
							className={`flex flex-col items-center ${
								removerLote ? "gap-12" : "gap-6"
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
