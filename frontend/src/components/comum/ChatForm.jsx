import React, { useRef, useState } from "react";
import { IoMdSend, IoMdAttach, IoMdClose } from "react-icons/io";

function Chatform({chatHistory, setChatHistory, generateBotResponse}) {

    const inputRef = useRef();
    const fileInputRef = useRef();
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        if(!userMessage) return;
        inputRef.current.value = "";
        const newMessages = [];

        if (userMessage) {
            newMessages.push({ role: "user", text: userMessage })
        }

        if (selectedFile) {
            newMessages.push({role: "user", text: `Documento anexado: ${selectedFile.name}`})
            setSelectedFile(null)
        }

        inputRef.current.value = ""
        setSelectedFile(null);
        setChatHistory((history) => [...history, ...newMessages]);

        setTimeout(() => {
            setChatHistory((history) => [...history, {role: "model", text: "Pensando..."}]);
            generateBotResponse([...chatHistory, ...newMessages], selectedFile); 
        }, 600)
    };
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleAttachClick = () => {
        fileInputRef.current.click();
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        fileInputRef.current.value = "";
    };

    return (
        <form action='#' className="chat-form flex focus-within:outline-1 focus-within:outline-laranja-ora shadow-sm items-center rounded-2xl bg-white outline-1 outline-gray-300
        " onSubmit={handleFormSubmit}>
            <button
                    type="button"
                    onClick={handleAttachClick}
                    className="text-azul-ora p-2 hover:text-azul-ora-800 transition duration-300 cursor-pointer hover:scale-105"
                    title="Anexar documento"
                >
                    <IoMdAttach size={23} />
                </button>
                <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
            />
            {selectedFile && (
                <div className="flex items-center bg-gray-100 text-xs px-2 py-1 rounded-lg">
                    <span className="mr-1 truncate max-w-[100px]">{selectedFile.name}</span>
                    <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-red-500 hover:text-red-700 ml-1 cursor-pointer"
                        title="Remover anexo"
                    >
                        <IoMdClose size={14} />
                    </button>
                </div>
            )}
            <input ref={inputRef} type="text" className="h-10 outline-0 w-[100%] text-sm" placeholder="Mensagem..." required />  
                <button className="bg-azul-ora rounded-full cursor-pointer text-white p-1.5 mr-1 items-center justify-center
                        hover:bg-azul-ora-800 transition duration-300" type="submit">
                    <IoMdSend size={22}/>
                </button>
        </form>
    )
}

export default Chatform