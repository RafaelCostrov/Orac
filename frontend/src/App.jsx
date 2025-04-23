import "./App.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Empresas from "./pages/Empresas";
import SideBar from "./components/sidebar/SideBar";

function App() {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<Router>
			<SideBar isOpen={isOpen} toggleSideBar={() => setIsOpen(!isOpen)} />
			<main
				className={`transition-transform duration-300 transform bg-stone-300 ${
					isOpen ? "translate-x-48" : "translate-x-16"
				}`}
			>
				<Routes>
					<Route path="/" element={<Empresas />} />
					<Route path="/login" element={<Login />} />
				</Routes>
			</main>
		</Router>
	);
}

export default App;
