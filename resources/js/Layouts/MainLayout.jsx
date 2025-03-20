// resources/js/Layouts/MainLayout.jsx
'use client';
import './decoration-bg.css'
import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Head } from '@inertiajs/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/Components/ui/avatar';
import MessageListModal from '@/Components/MessageListModal';
import MessageModal from '@/Components/MessageModal';

function AuthNavbar({ user }) {
    const userName = user?.name || '';
    const initials = userName.substring(0, 2).toUpperCase();
    const [isMessagesOpen, setMessagesOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleMessages = () => {
        setMessagesOpen(!isMessagesOpen);
    };


    const handleSelectUser = (user) => {
        console.log(`AuthNavbar: handleSelectUser: Usuario seleccionado ${user.name}`);
        setSelectedUser(user);
        setMessagesOpen(false);
    };

    return (
        <div className="flex items-stretch justify-between w-full">

            <div className="flex justify-center items-center max-[768px]:hidden">
                <Button className="border-none hover:bg-transparent" variant="outline" onClick={() => router.visit('/myrooms')}>
                    My rooms
                </Button>
                <Button className="border-none hover:bg-transparent" variant="outline" onClick={() => router.visit('/content')}>
                    Explorer
                </Button>
            </div>

            
            {/* Eliminado el bloque de búsqueda de aquí */}

            <div className="flex items-center justify-between w-full">
                <div></div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                            <i className="fa-regular fa-bell"></i>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={toggleMessages}>
                            <i className="fa-regular fa-comment"></i>
                        </Button>
                    </div>
                    <div className="flex items-center">
                        <Avatar>
                            <AvatarImage src={user?.avatar || ''} alt={userName} />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                    </div>

                    <div className='min-[768px]:hidden menu-bars' onClick={() => {setIsNavOpen(!isNavOpen)}}>
                        <span className={`menu-bar__1 ${isNavOpen ? 'active' : ''}`}></span>
                        <span className={`menu-bar__2 ${isNavOpen ? 'active' : ''}`}></span>
                        <span className={`menu-bar__3 ${isNavOpen ? 'active' : ''}`}></span>
                    </div>
                </div>
                {/* Modal de la lista de mensajes */}
                {isMessagesOpen && (
                    <MessageListModal onClose={toggleMessages} onSelectUser={handleSelectUser} />
                )}
                {/* Modal de conversación */}
                {selectedUser && (
                    <MessageModal
                        userId={selectedUser.id}
                        userName={selectedUser.name}
                        onClose={() => setSelectedUser(null)}
                    />
                )}
            </div>

            <div className={`content-menu ${isNavOpen ? 'active' : ''}`}>
                <div className='flex flex-col gap-2'>
                    <Button variant="outline" onClick={() => router.visit('/myrooms')}>
                        My rooms
                    </Button>
                    <Button variant="outline" onClick={() => router.visit('/content')}>
                        Explorer
                    </Button>
                </div>
            </div>
        </div>
    );
}

function GuestNavbar() {
    return (
        <div className="flex items-center justify-end w-full gap-5">
            <Button variant="ghost" onClick={() => router.visit('/login')}>
                Log in
            </Button>
            <Button variant="default" onClick={() => router.visit('/register')}>
                Register
            </Button>
        </div>
    );
}

export default function MainLayout({ children, auth }) {
    const containerClasses = auth?.user ? "flex flex-col min-h-screen" : "flex flex-col min-h-screen";

    return (
        <>
            <Head>
                <link rel="stylesheet" href="/css/all.css" />
            </Head>
            <div className={containerClasses}>
                <nav className="w-full bg-white border-b border-gray-200 h-14">
                    <div className="container flex items-stretch h-full px-4 mx-auto relative">
                        <div className="flex items-center">
                            <Link href="/" className="text-xl font-bold">
                                Room
                            </Link>
                        </div>
                        {auth?.user ? <AuthNavbar user={auth.user} /> : <GuestNavbar />}
                    </div>
                </nav>

                <main className="container flex-grow px-4 py-8 mx-auto ly-decoration">
                    {children}
                </main>
            </div>
        </>
    );
}