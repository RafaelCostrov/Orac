import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { ClockLoader } from "react-spinners";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from "react-router-dom";
import Login from "./paginas/Login";
import Empresas from "./paginas/Empresas";
import SideBar from "./components/sidebar/SideBar";
import NavBar from "./components/navbar/NavBar";
import PrivateRoute from "./utils/PrivateRoute";
import Registrar from "./paginas/Registrar";
import { useAuth } from "./utils/UseAuth";

function AppContent() {
	const location = useLocation();
	const autenticado = useAuth();
	const [isOpen, setIsOpen] = useState(false);
	const [isFiltered, setIsFiltered] = useState(false);
	const [modal, setModal] = useState(null);
	const [loading, setLoading] = useState(false);
	const notifyAcerto = e => toast.success(e);
	const notifyErro = e => toast.error(e);

	const hideLayout =
		location.pathname === "/login" ||
		location.pathname === "/registrar" ||
		!autenticado.isAuthenticated;

	return (
		<>
			{!hideLayout && <NavBar nome={autenticado.nome} />}
			{!hideLayout && <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />}
			<main
				className={`transition-all duration-400 transform-all bg-gray-300 ${
					!hideLayout ? (isOpen ? "pl-32 md:pl-48" : "pl-12 md:pl-16") : ""
				}`}
			>
				<Routes>
					<Route
						path="/"
						element={
							<PrivateRoute>
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
							</PrivateRoute>
						}
					/>
					<Route path="/login" element={<Login />} />
					<Route path="/registrar" element={<Registrar />} />
				</Routes>
			</main>
			<Toaster
				toastOptions={{
					error: {
						style: {
							background: "red",
							color: "white",
						},
						iconTheme: {
							primary: "white",
							secondary: "red",
						},
					},
				}}
			/>
			{loading && (
				<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
					<ClockLoader color="#0082c7" />
				</div>
			)}
		</>
	);
}

function App() {
	return (
		<Router>
			<AppContent />
		</Router>
	);
}

export default App;
