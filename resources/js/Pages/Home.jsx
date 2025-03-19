// resources/js/Pages/Home.jsx
import React, { useState } from 'react'; // Importa useState
import { Head, Link, router } from '@inertiajs/react'; // Importa router
import { Button } from '@/Components/ui/button';
import MainLayout from '@/Layouts/MainLayout';
import { usePage } from '@inertiajs/react';
import ContentCard from '@/Components/ContentCard';

function Home({ rooms }) {
    const { auth } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

    const handleSearch = (event) => {
        event.preventDefault();
        console.log('Home:handleSearch - Término:', searchTerm);
        router.visit(`/content?search=${searchTerm}`); // Redirige a /content con el parámetro de búsqueda
    };

    return (
        <MainLayout auth={auth}>
            <Head title="Home" />

            {/* Sección para usuarios no autenticados */}
            {!auth.user && (
                <div className="flex flex-col items-center justify-center min-h-[70vh]">
                    <div className="text-center">
                        <div className="inline-block px-4 py-2 mb-4 text-blue-600 bg-blue-100 rounded-lg">
                            Find Your Next Roommate!
                        </div>
                        <h1 className="text-6xl font-bold leading-tight text-[--black]">
                            The Perfect Roommate.
                            <br />
                            No Hassle.
                        </h1>
                        <p className="mt-4 text-[--grey]">
                            Discover amazing rooms and roommates.
                            <br />
                            Your new home awaits!
                        </p>
                    </div>
                    <div className="w-full max-w-md mt-8">
                        {/* Formulario de búsqueda */}
                        <form className="flex items-center" onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Search for places..."
                                className="w-full px-4 py-3 bg-white rounded-[200px] focus:outline-none focus:ring-2 focus:ring-gray-600"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>
                    </div>
                </div>
            )}

          {/* Sección para usuarios autenticados */}
            {auth.user && (
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="relative text-center">
                        <h1 className="text-6xl font-bold leading-tight text-[--black]">
                            Welcome Back!
                        </h1>
                        <p className="mt-1 text-[--grey]">
                            Find your perfect roommate or list your room.
                        </p>
                    </div>

                    <div className="w-full max-w-md mt-8">
                        <div className="flex justify-center space-x-4">
                            <Button asChild variant="secondary" size="lg">
                                <a href="/rooms/create">Post Room</a>
                            </Button>
                            <Button asChild variant="secondary" size="lg">
                                <a href="/profiles/create">Post My Profile</a>
                            </Button>
                        </div>
                         <form className="flex items-center mt-4" onSubmit={handleSearch}>
                            <input
                                type="text"
                                placeholder="Search for places..."
                                className="w-full px-4 py-3 bg-white rounded-[200px] focus:outline-none focus:ring-2 focus:ring-gray-600"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>
                    </div>
                </div>
            )}

            {/* Sección de habitaciones (pública) */}
            <div className="mt-10">
                <h2 className="mb-5 text-2xl font-semibold text-center text-[--black]">
                  <Link href="/content">Discover Rooms</Link>
                </h2>
                <div className="grid grid-cols-1 card-wrapper gap-7 my-7 md:grid-cols-2 lg:gap-10 lg:my-10">
                    {/*  Asegúrate de que rooms sea un array antes de usar map */}
                    {Array.isArray(rooms) && rooms.map(room => (
                        <ContentCard key={room.id} item={room} />
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}

export default Home;