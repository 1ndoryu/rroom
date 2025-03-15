import React, { useState, useEffect, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';


export default function Show({ user, messages }) {
    const { auth } = usePage().props;
    const [messageList, setMessageList] = useState(messages);
    const { data, setData, post, processing, errors, reset } = useForm({
        content: '',
        receiver_id: user.id,
    });


    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messageList]); // Re-scroll whenever messageList changes


    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('messages.store'), {
            onSuccess: () => {
                setMessageList([...messageList, {
                    sender_id: auth.user.id,
                    sender_name: auth.user.name, // Use authenticated user's name
                    receiver_id: user.id,
                    receiver_name: user.name,
                    content: data.content,
                    created_at: new Date().toISOString(), // Use current date/time
                    is_sender: true,
                }]);

                reset('content'); // Limpia el campo de entrada *solo* si la petición fue exitosa.
            },
        });

    };

    return (
        <MainLayout auth={auth}>
            <div className="container p-4 mx-auto">
                <h1 className="mb-4 text-2xl font-bold">Conversation with {user.name}</h1>

                <div className="border rounded-lg p-4 h-[500px] overflow-y-auto flex flex-col">
                    {messageList.map((message) => (
                        <div
                            key={message.id}
                            className={`mb-2 p-2 rounded-md max-w-[70%] ${message.is_sender ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'
                                }`}
                        >
                            <p className="text-sm">
                                <strong>{message.is_sender ? 'You' : message.sender_name}:</strong>
                                {message.content}
                            </p>
                            <span className="text-xs text-gray-500">{message.created_at}</span>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSubmit} className="flex mt-4">
                    <input
                        type="text"
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        placeholder="Type your message..."
                        className="flex-grow p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-4 py-2 font-bold text-white bg-blue-500 hover:bg-blue-700 rounded-r-md disabled:opacity-50"
                    >
                        Send
                    </button>
                </form>
                {errors.content && <div className="mt-1 text-sm text-red-500">{errors.content}</div>}
            </div>
        </MainLayout>
    );
}