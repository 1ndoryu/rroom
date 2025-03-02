'use client';
// resources/js/Layouts/MainLayout.jsx
import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Head } from '@inertiajs/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/Components/ui/avatar';

function AuthNavbar({ user }) {
    // Usamos optional chaining Y un valor por defecto para username.
    const username = user?.username || ''; // Valor por defecto: cadena vacía.
    const initials = username.substring(0, 2).toUpperCase();


    return (
        <div className="flex items-stretch justify-between w-full">
            <div id="sr" className="absolute z-50 w-full max-w-md -translate-x-1/2 top-3 left-1/2">
                <form className="flex items-center">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full px-3 py-1 text-sm bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
                    />
                </form>
            </div>

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
                    </div>
                    <div className="flex items-center">
                        <Avatar>
                            {/* Aseguramos user y user.avatar antes de acceder a la propiedad */}
                            <AvatarImage src={user?.avatar || ''} alt={username} />
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
            <Button variant="ghost">
                <Link href="/login">Log in</Link>
            </Button>
            <Button variant="default">
                <Link href="/register">Register</Link>
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
                <nav className="relative bg-white border-b border-gray-200 h-14">
                    <div className="container flex items-stretch h-full px-4 mx-auto">
                        <div className='flex items-center'>
                            <Link href="/" className="text-xl font-bold">
                                Room
                            </Link>
                        </div>
                        {auth?.user ? <AuthNavbar user={auth.user} /> : <GuestNavbar />}
                    </div>
                </nav>

                <main className="container flex-grow px-4 py-8 mx-auto">
                    {children}
                </main>
            </div>
        </>
    );
}