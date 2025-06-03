import { jwtDecode } from "jwt-decode";

export function useAuth() {
	const token = localStorage.getItem("token");
	const nome = localStorage.getItem("nome");

	if (!token) {
		return { isAuthenticated: false, nome: null };
	}

	try {
		const { exp } = jwtDecode(token);
		const isValid = Date.now() < exp * 1000;

		return {
			isAuthenticated: isValid,
			nome: isValid ? nome : null,
		};
	} catch (e) {
		console.error("Token inválido:", e);
		return { isAuthenticated: false, nome: null };
	}
}
