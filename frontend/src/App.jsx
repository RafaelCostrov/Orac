import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Empresas from "./pages/Empresas";
import SideBar from "./components/sidebar/SideBar";
import NavBar from "./components/navbar/NavBar";

function App() {
	const [isOpen, setIsOpen] = useState(false);
	const [isFiltered, setIsFiltered] = useState(false);
	return (
		<Router>
			<NavBar />
			<SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
			<main
				className={`transition-all duration-400 transform bg-gray-300 ${
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
							/>
						}
					/>
					<Route path="/login" element={<Login />} />
				</Routes>
			</main>
		</Router>
	);
}

export default App;
