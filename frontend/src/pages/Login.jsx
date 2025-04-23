import Input from "../components/login/Input";
import Button from "../components/login/Button";
import { FaUser } from "react-icons/fa";
import { IoKey } from "react-icons/io5";
import oracPadrao from "../assets/images/orac-padrao.png";

function Login() {
	return (
		<div className="flex flex-col relative h-screen justify-center items-center bg-linear-to-r/srgb from-azul-ora from-30% to-laranja-ora space-y-4">
			<h1 className="text-laranja-ora text-3xl font-bold text-stroke-2 ">
				Bem vindo!
			</h1>
			<div className="flex flex-col space-y-5 bg-linear-to-r/srgb from-gray-200 to-slate-200 p-10 shadow-lg rounded-xl items-center w-5/12 max-w-lg	">
				<img src={oracPadrao} alt="Orac Logo" className=" w-7/12" />
				<h2 className="text-azul-ora text-2xl font-medium">Acesse sua conta</h2>
				<Input placeholder="Usuário" type="text" icon={<FaUser />}></Input>
				<Input placeholder="Senha" type="password" icon={<IoKey />}></Input>
				<Button>Entrar</Button>
				<Button>Sair</Button>
				<a
					href=""
					className="text-azul-ora  font-semibold hover:text-laranja-ora transition duration-250"
				>
					Esqueceu a senha?
				</a>
			</div>
		</div>
	);
}

export default Login;
