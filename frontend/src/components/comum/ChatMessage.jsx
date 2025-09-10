import { RiRobot3Line } from "react-icons/ri";
import parse from 'html-react-parser';

function ChatMessage({chat}) {
    return (
        <div className={` ${chat.role === "model" ? "max-w-4/5 flex gap-3 items-center" : "self-end items-end max-w-4/5 flex flex-col" }`}>
            {chat.role === "model" && <RiRobot3Line size={40} className="bg-azul-ora p-2 rounded-full mb-0.5 shrink-0 self-end text-white"/>}
            <p className={`${chat.role ===  "model" ? "bg-azul-ora-100 px-2 py-1 rounded-bl-none rounded-xl" : "bg-azul-ora-800 px-2 text-white rounded-br-none py-1 rounded-xl" } `}>
                {parse(chat.text)}
            </p>
        </div>
    )

}

export default ChatMessage