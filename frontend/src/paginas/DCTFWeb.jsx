import { IoAddCircle, IoSearchSharp } from "react-icons/io5";
import { RiImportFill, RiExportFill } from "react-icons/ri";
import { IoMdRemoveCircle, IoIosArrowDown } from "react-icons/io";
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

function DCTFWeb({
    isFiltered,
    onClickFilter,
    onClickModal,
    onCloseModal,
    notifyAcerto,
    notifyErro,
    setLoading,
    modal, }) {
    const token = localStorage.getItem("token");
    const [empresas, setEmpresas] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [cod, setCod] = useState("");
    const [nome, setNome] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [regime, setRegime] = useState("");
    const [responsavel, setResponsavel] = useState("");
    const [cidade, setCidade] = useState("");
    const [competenciaMin, setCompetenciaMin] = useState("");
    const [competenciaMax, setCompetenciaMax] = useState("");
    const [removerLote, setRemoverLote] = useState(false);
    const [empresasSelecionadas, setEmpresasSelecionadas] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);


    const limparForms = () => {
        setCod("");
        setNome("");
        setCnpj("");
        setRegime("");
        setResponsavel("");
        setCompetenciaMin("");
        setCompetenciaMax("");
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
            responsavel ||
            competenciaMin ||
            competenciaMax
        );
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

    // const handleCriar = () => {
    //     setLoading(true);
    //     try {

    //         fetch(
    //             `/api/obrigacoes/criar-dctf-web?competencia=08/2025`,
    //             {
    //                 method: "POST",
    //                 headers: {
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             }
    //         );
    //         setLoading(false);
    //     } catch (error) {
    //         console.error("Erro ao exportar empresas:", error);
    //         notifyErro("Erro ao exportar empresas.");
    //         setLoading(false);
    //     }
    // };


    const fetchEmpresas = (page = 1) => {
        setLoading(true);
        const params = new URLSearchParams();

        params.append("page", page - 1);
        if (cod) params.append("empresaCod", cod);
        if (nome) params.append("empresaNome", nome);
        if (cnpj) params.append("empresaCnpj", cnpj);
        if (regime) params.append("empresaRegime", regime);
        if (responsavel) params.append("responsavel", responsavel);
        if (competenciaMin)
            params.append("competenciaMin", formatarDataBD(competenciaMin));
        if (competenciaMax)
            params.append("competenciaMax", formatarDataBD(competenciaMax));
        fetch(`/api/obrigacoes/filtrar?tipoObrigacao=DCTF_WEB&${params.toString()}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar empresas!");
                }
                var resposta = response.json();
                console.log(resposta);
                return resposta;
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
        fetch(`/api/obrigacoes/filtrar?tipoObrigacao=DCTF_WEB`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao buscar empresas!");
                }
                var resposta = response.json();
                console.log(resposta);
                return resposta;
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

    useEffect(() => {
        fetchEmpresas(currentPage);
    }, [currentPage]);

    const handleStatusChange = async (obrigacaoId, novoStatus) => {
        try {
            const response = await fetch(`/api/obrigacoes/${obrigacaoId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: novoStatus }),
            });

            if (!response.ok) {
                throw new Error("Erro ao atualizar status");
            }

            setEmpresas((prev) =>
                prev.map((empresa) =>
                    empresa.cod === obrigacaoId ? { ...empresa, status: novoStatus } : empresa
                )
            );
        } catch (error) {
            console.error(error);
            notifyErro("Não foi possível atualizar o status.");
        }
    };



    return <>
        <section className="flex flex-col h-dvh p-2 md:p-4">
            <div className="flex flex-col md:flex-row md:justify-between bg-azul-ora rounded-t-2xl">
                {/*Visível apenas em md ou maior*/}
                <div className="hidden md:flex w-full px-4 py-2 justify-between items-center space-x-6">
                    <h1 className="font-bold text-laranja-ora text-2xl sm:text-lg md:text-xl lg:text-2xl">
                        DCTF Web
                    </h1>
                    <div className="text-laranja-ora flex space-x-4">
                        <button onClick={() => onClickModal("exportar")}>
                            <RiExportFill
                                size={28}
                                className="hover:scale-120 transition-all duration-200 cursor-pointer"
                                title="Exportar"
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
                    nomeInput={"Responsável"}
                    type={"text"}
                    classNameDiv={"md:col-start-3 md:row-start-1"}
                    value={responsavel}
                    onChange={e => setResponsavel(e.target.value)}
                />
                <InputDuplo
                    nomeInput={"Competência"}
                    type={"text"}
                    classNameDiv={"md:col-start-4 md:row-start-1"}
                    onMinChange={e =>
                        setCompetenciaMin(formatarDataEscrita(e.target.value))
                    }
                    onMaxChange={e =>
                        setCompetenciaMax(formatarDataEscrita(e.target.value))
                    }
                    minValue={competenciaMin}
                    maxValue={competenciaMax}
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
                                        Cód.
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
                                    <th className="py-3 px-2 border-b border-gray-300 w-3/20 text-xs md:text-sm">
                                        Responsável
                                    </th>
                                    <th className="py-3 px-2 border-b border-gray-300 w-3/20 text-xs md:text-sm">
                                        Competência
                                    </th>
                                    <th className="py-3 px-2 border-b border-gray-300 w-2/20 text-xs md:text-sm">
                                        Status
                                    </th>
                                    {/* <th className="py-3 px-2 border-b border-gray-300 w-2/20 text-xs md:text-sm">
                                        Arquivos
                                    </th> */}
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
                                                }`}
                                        >
                                            <td

                                                className="py-3 px-2 border-b border-gray-300 truncate whitespace-nowrap overflow-hidden 
                                                md:w-1/20 sm:text-xs md:text-sm"
                                            >
                                                {empresa.empresaCod}
                                            </td>
                                            <td
                                                title={empresa.nome}
                                                className="py-3 px-2 border-b border-gray-300 truncate whitespace-nowrap overflow-hidden 
                                                text-left sm:text-xs md:text-sm"
                                            >
                                                {empresa.nome}
                                            </td>
                                            <td className="py-3 px-2 border-b border-gray-300 md:truncate md:whitespace-nowrap md:overflow-hidden 
                                             md:w-3/20 sm:text-xs md:text-sm">
                                                {formatarCNPJ(empresa.cnpj)}
                                            </td>
                                            <td className="py-3 px-2 border-b border-gray-300 md:truncate md:whitespace-nowrap md:overflow-hidden 
                                             md:w-3/20 sm:text-xs md:text-sm">
                                                {empresa.regime}
                                            </td>
                                            <td className="py-3 px-2 border-b border-gray-300 md:truncate md:whitespace-nowrap md:overflow-hidden 
                                             md:w-3/20 sm:text-xs md:text-sm">
                                                {empresa.responsavel}
                                            </td>
                                            <td className="py-3 px-2 border-b border-gray-300 md:truncate md:whitespace-nowrap md:overflow-hidden 
                                             md:w-3/20 sm:text-xs md:text-sm">
                                                {empresa.competencia}
                                            </td>
                                            <td className="py-3 px-1 border-b border-gray-300 md:truncate md:whitespace-nowrap md:overflow-hidden 
                                             md:w-2/20 sm:text-xs md:text-sm relative">

                                                <select
                                                    value={empresa.status}
                                                    onChange={(e) => handleStatusChange(empresa.cod, e.target.value)}
                                                    className={`w-full rounded-xl px-3 py-2 border focus:outline-none focus:ring-2 
                                                        appearance-none cursor-pointer
                                                        ${empresa.status === "CONCLUIDO"
                                                            ? "bg-green-100 text-green-700 border-green-300"
                                                            : empresa.status === "EM_ANDAMENTO"
                                                                ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                                                                : empresa.status === "PENDENTE"
                                                                    ? "bg-red-100 text-red-700 border-red-300"
                                                                    : "bg-gray-100 text-gray-700 border-gray-300"
                                                        }`}
                                                >
                                                    <option value="CONCLUIDO">Concluído</option>
                                                    <option value="EM_ANDAMENTO">Em andamento</option>
                                                    <option value="PENDENTE">Pendente</option>
                                                </select>
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <IoIosArrowDown className={`${empresa.status === "CONCLUIDO"
                                                        ? "bg-green-100 text-green-700 border-green-300"
                                                        : empresa.status === "EM_ANDAMENTO"
                                                            ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                                                            : empresa.status === "PENDENTE"
                                                                ? "bg-red-100 text-red-700 border-red-300"
                                                                : "bg-gray-100 text-gray-700 border-gray-300"
                                                        }`} />
                                                </div>
                                            </td>
                                            {/* <td className="py-3 px-2 border-b border-gray-300 md:truncate md:whitespace-nowrap md:overflow-hidden 
                                             md:w-2/20 sm:text-xs md:text-sm">
                                                {empresa.arquivos}
                                            </td> */}
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
                        <Paginacao
                            paginaAtual={currentPage}
                            setPaginaAtual={setCurrentPage}
                            totalPaginas={totalPages}
                        />
                    </div>
                </motion.div>
            </AnimatePresence>
        </section >

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
        )
        }
    </>
}

export default DCTFWeb