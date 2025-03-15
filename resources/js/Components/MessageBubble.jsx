// resources/js/Components/MessageBubble.jsx
import React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es'; // Importa el idioma español
dayjs.locale('es'); // Establece el idioma global a español

function MessageBubble({ message, currentUserId }) {
    const isSender = message.sender_id === currentUserId;
    const bubbleClasses = isSender
        ? 'bg-blue-500 text-white ml-auto' // Alineado a la derecha
        : 'bg-gray-200 text-gray-800 mr-auto'; // Alineado a la izquierda

    return (
        <div className={`flex flex-col my-2 ${isSender ? 'items-end' : 'items-start'}`}>
            <div className={`flex flex-col max-w-[70%] rounded-lg px-3 py-2 ${bubbleClasses}`}>
                <div className="text-sm">{message.content}</div>
                <div className="mt-1 text-xs text-gray-500">
                    {dayjs(message.created_at).format('HH:mm')}
                </div>
            </div>

        </div>
    );
}

export default MessageBubble;