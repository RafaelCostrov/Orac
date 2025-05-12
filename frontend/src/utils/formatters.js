export function formatarCNPJ(cnpj) {
	if (!cnpj) return "";
	return cnpj
		.replace(/\D/g, "")
		.replace(/^(\d{2})(\d)/, "$1.$2")
		.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
		.replace(/\.(\d{3})(\d)/, ".$1/$2")
		.replace(/(\d{4})(\d)/, "$1-$2")
		.slice(0, 18);
}

export function validaCNPJ(cnpj) {
	var b = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
	var c = String(cnpj).replace(/[^\d]/g, "");

	if (c.length !== 14) return false;

	if (/0{14}/.test(c)) return false;

	for (var i = 0, n = 0; i < 12; n += c[i] * b[++i]);
	if (c[12] != ((n %= 11) < 2 ? 0 : 11 - n)) return false;

	for (var i = 0, n = 0; i <= 12; n += c[i] * b[i++]);
	if (c[13] != ((n %= 11) < 2 ? 0 : 11 - n)) return false;

	return true;
}

export function formatarDataEscrita(data) {
	if (!data) return "";
	const numeros = data.replace(/\D/g, "");
	let formatado = "";

	if (numeros.length <= 2) {
		formatado = numeros;
	} else if (numeros.length <= 4) {
		formatado = numeros.replace(/(\d{2})(\d{1,2})/, "$1/$2");
	} else {
		formatado = numeros.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
	}

	return formatado.slice(0, 10);
}

export function formatarDataBD(dataStr) {
	const [dia, mes, ano] = dataStr.split("/");
	if (!dia || !mes || !ano) return "";
	return `${ano}-${mes.padStart(2, "0")}-${dia.padStart(2, "0")}`;
}
