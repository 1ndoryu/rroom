// resources/js/Layouts/MainLayout.jsx

'use client';

import './decoration-bg.css'
import React, { useState } from 'react'; // Importa useState
import { Link, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Head } from '@inertiajs/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/Components/ui/avatar';

function AuthNavbar({ user }) {
    const userName = user?.name || '';
    const initials = userName.substring(0, 2).toUpperCase();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setSearchOpen] = useState(false);

    const handleSearch = (event) => {
        event.preventDefault();
        router.get('/content', { search: searchTerm }, { replace: true, preserveState: true });
    };

    const handleSearchClose = () => {
        setSearchOpen(!isSearchOpen);
        console.log(isSearchOpen)
        setSearchTerm('');
    };

    return (
        <div className="flex items-stretch justify-between w-full">
            <div id="sr" className="absolute z-50 w-full max-w-md -translate-x-1/2 top-3 left-1/2">
                <form className="flex items-center relative" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search rooms, roommates..."
                        className="w-full px-3 py-1 text-sm bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 max-[768px]:hidden"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div className='flex items-center justify-center w-full min-[768px]:hidden'>
                        <input
                            type="text"
                            placeholder="Search rooms, roommates..."
                            className={`search-cn ${isSearchOpen ? 'search-cn-open' : ''} w-[85%] px-3 py-1 text-sm bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 min-[768px]:hidden`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            />
                    </div>
                </form>
            </div>

            {/* Resto del componente AuthNavbar */}
            <div className="flex items-center justify-between w-full">
                <div></div>
                <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                            <i className="fa-regular fa-bell"></i>
                        </Button>
                        <Button variant="ghost" size="icon">
                            <i className="fa-regular fa-comment"></i>
                        </Button>
                        <span className='max-[768px]:block min-[768px]:hidden' onClick={() => handleSearchClose()}>
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
    const containerClasses = auth?.user
        ? "flex flex-col min-h-screen"
        : "flex flex-col min-h-screen";
    return (
        <>
            <Head>
                <link rel="stylesheet" href="/css/all.css" />
            </Head>
            <div className={containerClasses}>
                <nav className="bg-white border-b border-gray-200 h-14 w-full">
                    <div className="container flex items-stretch h-full px-4 mx-auto">
                        <div className='flex items-center'>
                            <Link href="/" className="text-xl font-bold">
                                Room
                            </Link>
                        </div>
                        {auth?.user ? <AuthNavbar user={auth.user} /> : <GuestNavbar />}
                    </div>
                </nav>

                <main className="container ly-decoration flex-grow px-4 py-8 mx-auto">
                    {children}
                </main>
            </div>
        </>
    );
}