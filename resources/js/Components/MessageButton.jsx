// resources/js/Components/MessageButton.jsx
import React, { useState } from 'react';
import MessageModal from '@/Components/MessageModal';

export default function MessageButton({ userId, userName }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (e) => {
        e.stopPropagation();
        e.preventDefault();
        console.log(`MessageButton: openModal: Abrir modal para usuario ${userName} con ID ${userId}`);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        console.log("MessageButton: closeModal: Cerrar modal");
        setIsModalOpen(false);
    };

    return (
        <>
            <button
                onClick={openModal}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground text-black h-9 w-9 text-[15px] opacity-70"
            >
                <i className="fa-regular fa-message-plus"></i>
            </button>
            {isModalOpen && (
                <MessageModal userId={userId} userName={userName} onClose={closeModal} />
            )}
        </>
    );
}
