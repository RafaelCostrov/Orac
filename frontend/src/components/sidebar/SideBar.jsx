import { FiMenu } from "react-icons/fi";
function SideBar({ isOpen, toggleSideBar }) {
	return (
		<aside
			onMouseEnter={toggleSideBar}
			onMouseLeave={toggleSideBar}
			className={`fixed top-0 w-48 left-0 h-full  text-azul-ora transition-transform duration-300 transform flex flex-col items-center p-4 ${
				isOpen ? "" : "-translate-x-32"
			}`}
		></aside>
	);
}

export default SideBar;
