// resources/js/Pages/MyRooms/Index.jsx
import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import MyRoomCard from '@/Components/MyRoomCard';

export default function Index({ rooms }) {
    const { auth } = usePage().props;
    console.log("MyRooms - Index - START - Component Rendered", { rooms });

    return (
        <MainLayout auth={auth}>
            <Head title="My Rooms" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {rooms.length > 0 ? (
                        <div className="grid grid-cols-1 justify-items-center gap-7 ">
                            {rooms.map(room => (
                                <MyRoomCard key={room.id} room={room} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <Link href={route('rooms.create')} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                                Publicar Room
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}