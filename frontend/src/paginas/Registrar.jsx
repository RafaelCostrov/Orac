import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../components/comum/inputs/InputLogin";
import Button from "../components/comum/buttons/ButtonLogin";
import { FaUser } from "react-icons/fa";
import { IoKey } from "react-icons/io5";
import { MdOutlineAlternateEmail } from "react-icons/md";
import oracPadrao from "../assets/images/orac-padrao.png";
import GradientText from "../utils/GradientText";
import BlurText from "../utils/BlurText";
import { Link } from "react-router-dom";
import { validarSenha } from "../utils/formatters";

function Registrar() {
	const [nome, setNome] = useState("");
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [erro, setErro] = useState("");
	const navigate = useNavigate();

	const handleRegistrar = async () => {
		try {
			setErro("");
			if (!nome || !email || !senha) {
				setErro(
					<p className="font-semibold">Todos os campos são obrigatórios.</p>
				);
				return;
			}

			const resultadoSenha = validarSenha(senha);
			if (resultadoSenha.length > 0) {
				setErro(
					<div>
						<p className="font-semibold">
							A senha não atende aos requisitos mínimos:
						</p>
						<ul>
							{resultadoSenha.map((erro, index) => (
								<li key={index} className="text-left">
									{erro}
								</li>
							))}
						</ul>
					</div>
				);

				return;
			}

			const response = await fetch(
				"http://localhost:8080/api/v1/auth/registrar",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ nome, email, senha }),
				}
			);
			if (!response.ok) {
				// detecta se veio JSON
				const isJson = response.headers
					.get("Content-Type")
					?.includes("application/json");

				let mensagemErro;

				if (isJson) {
					const data = await response.json();
					mensagemErro = data.message || JSON.stringify(data);
				} else {
					mensagemErro = await response.text();
				}

				throw new Error(mensagemErro);
			}
			const data = await response.json();
			const token = data.token;
			localStorage.setItem("token", token);
			localStorage.setItem("nome", nome);
			navigate("/");
		} catch (error) {
			console.error("Erro ao registrar:", error);
			setErro(
				<>
					<p className="font-semibold">Erro ao criar conta:</p>
					<p>{error.message}</p>
				</>
			);
		}
	};

	return (
		<div className="flex flex-col relative h-screen justify-center items-center bg-gradient-to-r from-azul-ora from-30% to-laranja-ora space-y-4 px-4">
			<BlurText
				text="Seja bem-vindo ao Orac!"
				delay={200}
				animateBy="letters"
				direction="top"
				className="text-2xl sm:text-3xl font-semibold text-laranja-ora text-center"
			/>

			<div className="flex flex-col space-y-5 bg-zinc-200 p-6 sm:p-10 shadow-lg rounded-xl items-center w-full sm:w-10/12 md:w-8/12 lg:w-5/12 max-w-lg">
				<img src={oracPadrao} alt="Orac Logo" className="w-6/12 sm:w-7/12" />

				<GradientText
					colors={["#0082C7", "#F0A23B", "#0082C7", "#F0A23B", "#0082C7"]}
					animationSpeed={8}
					showBorder={false}
					className="text-xl sm:text-2xl"
				>
					Preencha os dados abaixo
				</GradientText>

				<Input
					placeholder="Nome"
					type="text"
					icon={<FaUser />}
					value={nome}
					onChange={e => setNome(e.target.value)}
				/>
				<Input
					placeholder="Email"
					type="email"
					icon={<MdOutlineAlternateEmail />}
					value={email}
					onChange={e => setEmail(e.target.value)}
				/>
				<Input
					placeholder="Senha"
					type="password"
					icon={<IoKey />}
					value={senha}
					onChange={e => setSenha(e.target.value)}
				/>

				{erro && <div className="text-red-500 text-sm text-center">{erro}</div>}

				<Button onClick={handleRegistrar} color="azul">
					Criar conta
				</Button>

				<Link
					to={"/login"}
					className="text-azul-ora font-semibold hover:text-laranja-ora transition duration-250 text-center"
				>
					Voltar
				</Link>
			</div>
		</div>
	);
}

export default Registrar;
