import { RiRobot3Line, RiMessage3Fill  } from "react-icons/ri";
import { IoIosArrowDown, IoMdClose } from "react-icons/io";
import Chatform from "./ChatForm";
import ChatMessage from "./ChatMessage";
import { useState } from "react";
import { useAuth } from "../../utils/UseAuth";

function Chatbot() {

    const autenticado = useAuth();
    const [chatHistory, setChatHistory] = useState([]);

    const generateBotResponse = async (history, file = null) => {
        const lastMessage = history[history.length - 1]?.text;

        const formData = new FormData();
        formData.append("mensagem", lastMessage);
        formData.append("email", autenticado.email);
        formData.append("nome_usuario", autenticado.nome)
        if (file) {
            formData.append("arquivo", file);
        }

        try {
            const response = await fetch("http://localhost:5000/orac-ia", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error("Erro na requisição");
            }

            const data = await response.json();
            setChatHistory((prev) => [
                ...prev.slice(0, -1),
                {role: "model", text: data.resposta.output || "Resposta recebida!"}
            ]);
        } 
        catch (error) {
            setChatHistory((prev) => [
                ...prev.slice(0, -1),
                {role: "model", text: "Erro ao obter resposta, tente novamente."}
            ]);
            console.log(error)
        }
    }

    const [isChatOpen, setIsChatOpen] = useState(false);

    const toggleChat = () => {
        setIsChatOpen((prev) => !prev);
    };

    return (
        <div className="container bg-linear-180 from-azul-ora-100 to-azul-ora-200
        w-[100%] min-h-[100vh]">
            <button
                id="chatbot-toggler"
                onClick={toggleChat}
                className="fixed bottom-15 right-8 border-0 h-12 w-12 flex cursor-pointer rounded-full bg-azul-ora items-center justify-center"
            >
                <span className={`absolute text-white bg-azul-ora rounded-full p-2 transition duration-300 hover:bg-azul-ora-800 ${isChatOpen ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                    <RiMessage3Fill size={30} />
                </span>
                <span className={`absolute text-white bg-azul-ora rounded-full p-2 transition duration-300 hover:bg-azul-ora-800 ${isChatOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                    <IoMdClose size={30} />
                </span>
            </button>

            <div className={`chatbot-popup w-md fixed bottom-13 right-25 bg-white rounded-xl shadow-lg overflow-hidden transition-opacity duration-300 ${isChatOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
                {/* Chatbot Header */}
                <div className="chat-header bg-azul-ora items-center justify-between flex
                py-3 px-8">
                    <div className="header-info flex gap-2 items-center">
                        <RiRobot3Line size={50} className="bg-white p-2 rounded-full shrink-0 text-azul-ora"/>
                        <h2 className="text-white text-xl font-semibold">Chatbot</h2>
                    </div>
                    <button className="rounded-full hover:bg-azul-ora-800 p-3 cursor-pointer transition-all duration-300" onClick={toggleChat}>
                        <IoIosArrowDown size={25} className="text-white" />
                    </button>
                </div>
                {/* Chatbot Body */}
                <div className="chat-body px-3 py-8 h-116 flex flex-col gap-3 overflow-y-auto mb-10 scrollbar-hide">
                    <div className="bot-message max-w-3/4 flex gap-3 items-center">
                        <RiRobot3Line size={40} className="bg-azul-ora p-2 rounded-full mb-0.5 shrink-0 self-end text-white"/>
                        <p className="bg-azul-ora-100 px-2 py-1 rounded-bl-none rounded-xl">
                            Olá, tudo bem? 👋<br /> Como posso te ajudar?
                        </p>
                    </div>
                    {chatHistory.map((chat, index) => {
                        return <ChatMessage key={index} chat={chat}/>
                    })}
                    
                </div>
                {/* Chatbot Footer */}
                <div className="chat-footer absolute bottom-0 w-[100%] bg-white p-3">
                    <Chatform setChatHistory={setChatHistory}  generateBotResponse={generateBotResponse} chatHistory={chatHistory}/>
                    
                </div>
            </div>
        </div>
    )
}

export default Chatbot;