// resources/js/Components/MessageListModal.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { route } from 'ziggy-js';

function MessageListModal({ onClose, onSelectUser }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(route('conversations.get'))
            .then(response => {
                setUsers(response.data.users);
                setLoading(false);
            })
            .catch(error => {
                console.error("MessageListModal: Error al cargar las conversaciones:", error);
                setLoading(false);
            });
    }, []);

    const handleModalContentClick = (e) => {
        e.stopPropagation();
    };

    const handleClose = (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log("MessageListModal: handleClose: Cerrar modal");
        onClose();
    };

    // Al hacer click en una conversación, se invoca la función de callback
    const handleConversationClick = (user) => {
        console.log(`MessageListModal: handleConversationClick: Usuario seleccionado ${user.name}`);
        onSelectUser(user);
    };

    return createPortal(
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50" onClick={handleClose}>
            <div
                className="relative w-full max-w-md overflow-hidden bg-white rounded-lg shadow-lg"
                onClick={handleModalContentClick}
            >
                <div className="flex items-center justify-between p-3 text-black bg-grey">
                    <h2 className="font-medium">Messages</h2>
                    <button
                        onClick={handleClose}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent text-foreground h-9 w-9 text-[15px] opacity-80"
                        aria-label="Close"
                    >
                        <i class="fa-solid fa-x"></i>
                    </button>
                </div>

                <div className="p-3 bg-grey" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="w-[25px] h-[25px] border-[#252525] border-[2px] border-t-transparent border-r-[#29292965] animate-[spin_0.6s_linear_infinite] rounded-[50%]"></div>
                        </div>
                    ) : (
                        users.length > 0 ? (
                            users.map((user) => (
                                <div
                                    key={user.id}
                                    onClick={() => handleConversationClick(user)}
                                    className="flex items-center justify-between p-2 my-2 border rounded-lg cursor-pointer hover:bg-gray-200"
                                >
                                    <div className="flex items-center">
                                        <div className="flex items-center justify-center w-8 h-8 mr-2 overflow-hidden bg-gray-300 rounded-full">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium">{user.name}</div>
                                            {user.last_message && (
                                                <div className={`text-sm ${user.last_message.is_sender ? 'text-gray-500' : 'text-black'}`}>
                                                    {user.last_message.is_sender ? 'You: ' : ''}
                                                    {user.last_message.content.length > 20
                                                        ? `${user.last_message.content.substring(0, 20)}...`
                                                        : user.last_message.content}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500">No messages yet.</div>
                        )
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

export default MessageListModal;
