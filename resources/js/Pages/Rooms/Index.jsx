// resources/js/Pages/Rooms/Index.jsx
import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import RoomCard from '@/Components/RoomCard'; // Importa el componente

export default function Index({ rooms }) {
    const { auth } = usePage().props;
    return (
        <MainLayout auth={auth}>
            <div className="rooms-index">
                <Head title="Rooms List" />

                <div className="grid grid-cols-1 card-wrapper gap-7 my-7 md:grid-cols-2 lg:gap-10 lg:my-10">
                    {rooms?.map(room => (
                        <RoomCard key={room.id} room={room} /> // Usa el componente
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}