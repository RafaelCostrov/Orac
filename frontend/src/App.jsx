import "./App.css";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ClockLoader } from "react-spinners";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Empresas from "./pages/Empresas";
import SideBar from "./components/sidebar/SideBar";
import NavBar from "./components/navbar/NavBar";

function App() {
	const [isOpen, setIsOpen] = useState(false);
	const [isFiltered, setIsFiltered] = useState(false);
	const [modal, setModal] = useState(null);
	const [loading, setLoading] = useState(false);
	const notifyAcerto = () => toast.success("Adicionado com sucesso!");
	const notifyErro = () => toast.error("Erro ao adicionar!");

	return (
		<Router>
			<NavBar />
			<SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
			<main
				className={`transition-all duration-400 transform-all bg-gray-300 ${
					isOpen ? "pl-48" : "pl-16"
				}`}
			>
				<Routes>
					<Route
						path="/"
						element={
							<Empresas
								isFiltered={isFiltered}
								onClickFilter={() => setIsFiltered(!isFiltered)}
								modal={modal}
								onClickModal={e => setModal(e)}
								onCloseModal={() => setModal(null)}
								notifyAcerto={notifyAcerto}
								notifyErro={notifyErro}
								setLoading={setLoading}
							/>
						}
					/>
					<Route path="/login" element={<Login />} />
				</Routes>
			</main>
			<Toaster />
			{loading && (
				<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
					<ClockLoader color="#0082c7" />
				</div>
			)}
		</Router>
	);
}

export default App;
