import Input from "../Input";
import Button from "./Button";
import { FaUser } from "react-icons/fa";
import { IoKey } from "react-icons/io5";
import oracPadrao from "../../assets/images/orac-padrao.png";

function Login() {
	return (
		<div className=" flex flex-col space-y-5 bg-linear-to-r/srgb from-gray-200 to-slate-200 p-10 shadow-lg rounded-xl items-center w-5/12 max-w-lg	">
			<img src={oracPadrao} alt="Orac Logo" className=" w-7/12" />
			<h2 className="text-azul-ora text-2xl font-medium">Acesse sua conta</h2>
			<Input placeholder="Usuario" type="text" icon={<FaUser />}></Input>
			<Input placeholder="Senha" type="password" icon={<IoKey />}></Input>
			<Button>Entrar</Button>
			<a
				href=""
				className="text-azul-ora  font-semibold hover:text-laranja-ora transition duration-250"
			>
				Esqueceu a senha?
			</a>
		</div>
	);
}

export default Login;
