// resources/js/Components/MessageModal.jsx
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePage } from '@inertiajs/react';
import { route } from 'ziggy-js';
import axios from 'axios';
import MessageBubble from './MessageBubble';

export default function MessageModal({ userId, userName, onClose }) {
    const { props } = usePage();
    const csrfToken = props.csrf_token;
    const [messages, setMessages] = useState([]);
    const [data, setData] = useState({ content: '' });
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const chatAreaRef = React.useRef(null);

    useEffect(() => {
        console.log("MessageModal: useEffect: Loading messages for user", userId);
        setLoading(true);
        axios.get(route('messages.get', { user: userId }))
            .then(response => {
                console.log("MessageModal: useEffect: Messages loaded:", response.data.messages);
                setMessages(response.data.messages);
                setLoading(false);
            })
            .catch(error => {
                console.error("MessageModal: useEffect: Error loading messages:", error);
                alert('Error loading messages.');
                setLoading(false);
            });
    }, [userId]);

    useEffect(() => {
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        return () => {
            console.log("MessageModal: cleanup: Modal cleanup");
            setData({ content: '' });
        };
    }, [userId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setProcessing(true);
        console.log(`MessageModal: handleSubmit: Sending message to ${userName} with ID ${userId}`);
        axios.post(route('messages.store'), {
            receiver_id: userId,
            content: data.content,
            _token: csrfToken,
        })
            .then(response => {
                console.log("MessageModal: onSuccess: Message sent successfully.", response.data);
                setMessages([...messages, response.data.message]);
                setData({ content: '' });
                setProcessing(false);
            })
            .catch(error => {
                console.error("MessageModal: onError: Error sending message:", error);
                alert('Error sending message.');
                setProcessing(false);
            });
    };

    const handleClose = (e) => {
        e.stopPropagation();
        console.log("MessageModal: handleClose: Closing modal");
        onClose();
    };

    const handleModalContentClick = (e) => {
        e.stopPropagation();
        console.log("MessageModal: handleModalContentClick: Stopping propagation on modal content");
    };

    return createPortal(
        <div className="fixed bottom-0 right-0 z-50 flex items-end justify-end p-4" onClick={handleClose}>
            <div
                className="relative w-full max-w-xl overflow-hidden bg-white rounded-lg shadow-lg"
                onClick={handleModalContentClick}
                style={{ maxHeight: '420px', width: '280px;'}}
            >
                <div className="flex items-center justify-between p-3 text-white bg-blue-500">
                    <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 mr-2 overflow-hidden bg-gray-300 rounded-full">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="font-medium">{userName}</h2>
                    </div>
                    <div className="flex">
                        <button
                            onClick={handleClose}
                            className="p-1 text-white rounded-full hover:bg-blue-600"
                            aria-label="Close"
                        >
                            <i className="fa-solid fa-x"></i>
                        </button>
                    </div>
                </div>
                <div ref={chatAreaRef} className="p-3 bg-gray-100" style={{ height: '250px', overflowY: 'auto' }}>
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="w-16 h-16 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        messages.length > 0 ? (
                            messages.map((message) => (
                                <MessageBubble key={message.id} message={message} currentUserId={props.auth.user.id} />
                            ))
                        ) : (
                            <div className="flex justify-center my-4">
                                <div className="px-3 py-1 text-xs text-gray-500 bg-gray-200 rounded-full">Start of the conversation</div>
                            </div>
                        )
                    )}
                </div>
                <form onSubmit={handleSubmit} className="bg-white border-t">
                    <input type="hidden" name="_token" value={csrfToken} />
                    <div className="flex items-center p-2">
                        <div className="relative flex-1">
                            <textarea
                                value={data.content}
                                onChange={(e) => setData({ content: e.target.value })}
                                className="w-full p-2 pr-4 text-sm border rounded-full resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Aa"
                                required
                                rows="1"
                                style={{ maxHeight: '60px', minHeight: '36px' }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="ml-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}

