import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../components/comum/inputs/InputLogin";
import Button from "../components/comum/buttons/ButtonLogin";
import { FaUser } from "react-icons/fa";
import { IoKey } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import oracPadrao from "../assets/images/orac-padrao.png";
import GradientText from "../utils/GradientText";
import BlurText from "../utils/BlurText";

function Login() {
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [erro, setErro] = useState("");
	const navigate = useNavigate();
	const GOOGLE_AUTH_URL = "http://localhost:8080/oauth2/authorization/google";

	const handleLogin = async () => {
		try {
			const response = await fetch(
				"http://localhost:8080/api/v1/auth/autenticar",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, senha }),
				}
			);
			if (!response.ok) {
				const errorData = await response.json();
				throw new Error("Erro ao autenticar: " + errorData.message);
			}

			const data = await response.json();
			const { token, nome } = data;
			localStorage.setItem("token", token);
			localStorage.setItem("nome", nome);
			localStorage.setItem("email", email);
			navigate("/");
		} catch (error) {
			console.error("Erro ao fazer login:", error);
			setErro("Usuário ou senha inválidos");
		}
	};

	const handleGoogleLogin = () => {
		const popup = window.open(
			GOOGLE_AUTH_URL,
			"Google Login",
			"width=500,height=600"
		);

		window.addEventListener("message", event => {
			if (event.origin !== "http://localhost:8080") return;

			const { token, nome, email } = event.data;

			localStorage.setItem("token", token);
			localStorage.setItem("nome", nome);
			localStorage.setItem("email", email);
		});
	};

	useEffect(() => {
		const receiveMessage = event => {
			if (event.origin !== "http://localhost:8080") return;
			const { token, nome } = event.data;

			localStorage.setItem("token", token);
			localStorage.setItem("nome", nome);
			window.location.href = "/";
		};

		window.addEventListener("message", receiveMessage);

		return () => {
			window.removeEventListener("message", receiveMessage);
		};
	}, []);

	return (
		<div className="flex flex-col relative h-screen justify-center items-center bg-[url('/background.png')] bg-cover space-y-4 px-4">
			<BlurText
				text="Seja bem-vindo ao orac!"
				delay={200}
				animateBy="letters"
				direction="top"
				className="text-2xl sm:text-3xl font-semibold text-slate-200 text-center"
			/>

			<div className="flex flex-col space-y-5 bg-white/80 backdrop-blur-sm p-6 sm:p-10 shadow-lg rounded-xl items-center w-full sm:w-10/12 md:w-8/12 lg:w-5/12 max-w-lg">
				<img src={oracPadrao} alt="Orac Logo" className="w-6/12 sm:w-7/12" />

				<GradientText
					colors={["#0082C7", "#F0A23B", "#0082C7", "#F0A23B", "#0082C7"]}
					animationSpeed={8}
					showBorder={false}
					className="text-xl sm:text-2xl"
				>
					Acesse sua conta
				</GradientText>

				<Input
					placeholder="Usuário"
					type="text"
					icon={<FaUser />}
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

				{erro && <p className="text-red-500 text-sm text-center">{erro}</p>}

				<div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
					<Button onClick={handleLogin} color="laranja">
						Entrar
					</Button>
					<Button link={"/registrar"} color="azul">
						Primeiro acesso?
					</Button>
				</div>
				<a
					href=""
					className="text-azul-ora font-semibold hover:text-laranja-ora transition duration-250 text-center"
				>
					Esqueceu a senha?
				</a>
				<div
					className="relative w-full py-2 px-6 items-center flex rounded-2xl shadow-lg border-1 border-gray-400/50
				 bg-white cursor-pointer hover:bg-gray-200 transition duration-300"
					onClick={handleGoogleLogin}
				>
					<FcGoogle size={24} />
					<span className="absolute text-gray-700 flex justify-center items-center inset-0">
						Entrar com o Google
					</span>
				</div>
			</div>
		</div>
	);
}

export default Login;
