export default function GradientText({ children, className = "" }) {
	return (
		<span
			className={`text-transparent bg-clip-text bg-gradient-to-r from-azul-ora via-laranja-ora to-azul-ora animate-gradient bg-[length:300%_100%] ${className}`}
		>
			{children}
		</span>
	);
}
