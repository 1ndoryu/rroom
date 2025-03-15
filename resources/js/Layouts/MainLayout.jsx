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
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setSearchOpen] = useState(false);
    const [isMessagesOpen, setMessagesOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleSearch = (event) => {
        event.preventDefault();
        console.log('AuthNavbar:handleSearch - Término:', searchTerm);
        router.visit(`/content?search=${searchTerm}`);
    };

    const handleSearchClose = () => {
        setSearchOpen(!isSearchOpen);
        console.log('AuthNavbar:handleSearchClose - Estado de búsqueda:', isSearchOpen);
        setSearchTerm('');
    };

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
            <div className="flex items-center ml-auto mb-[-4px] p-1 space-x-0">
                <Button className="border-none hover:bg-transparent" variant="outline" onClick={() => router.visit('/myrooms')}>
                    My rooms
                </Button>
                <Button className="border-none hover:bg-transparent" variant="outline" onClick={() => router.visit('/content')}>
                    Explorer
                </Button>
            </div>
            <div id="sr" className="absolute z-50 w-full max-w-md -translate-x-1/2 top-3 left-1/2">
                <form className="relative flex items-center" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search rooms, roommates..."
                        className="w-full px-3 py-1 text-sm bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 max-[768px]:hidden"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch(e);
                            }
                        }}
                    />
                    <div className="flex items-center justify-center w-full min-[768px]:hidden">
                        <input
                            type="text"
                            placeholder="Search rooms, roommates..."
                            className={`search-cn ${isSearchOpen ? 'search-cn-open' : ''} w-[85%] px-3 py-1 text-sm bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 min-[768px]:hidden`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch(e);
                                }
                            }}
                        />
                    </div>
                </form>
            </div>

            <div className="flex items-center justify-between w-full">
                <div></div>
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                            <i className="fa-regular fa-bell"></i>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={toggleMessages}>
                            <i className="fa-regular fa-comment"></i>
                        </Button>
                        <span className="max-[768px]:block min-[768px]:hidden" onClick={handleSearchClose}>
                            <Button variant="ghost" size="icon">
                                <i className="fa-solid fa-magnifying-glass"></i>
                            </Button>
                        </span>
                    </div>
                    <div className="flex items-center">
                        <Avatar>
                            <AvatarImage src={user?.avatar || ''} alt={userName} />
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
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
                    <div className="container flex items-stretch h-full px-4 mx-auto">
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