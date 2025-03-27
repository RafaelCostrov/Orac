// import { useState } from "react";
import "./App.css";
import Login from "./components/login/Login";

function App() {
	return (
		<div className="flex flex-col relative h-screen justify-center items-center bg-linear-to-r/srgb from-indigo-500 from-30% to-orange-200 space-y-4">
			<h1 className="text-laranja-ora text-3xl font-bold">Bem vindo!</h1>
			<Login />
		</div>
	);
}

export default App;
