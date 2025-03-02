import React from 'react';
import { Head } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import MainLayout from '@/Layouts/MainLayout'; // Importamos MainLayout
import { usePage } from '@inertiajs/react'; // Importamos usePage

function Home() {

    const { auth } = usePage().props;

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
                        <form className="flex items-center">
                            <input
                                type="text"
                                placeholder="Search for places..."
                                className="w-full px-4 py-3 bg-white rounded-[200px] focus:outline-none focus:ring-2 focus:ring-gray-600"
                            />
                        </form>
                    </div>
                </div>
            )}

            {/* Sección para usuarios autenticados */}
            {auth.user && (
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <h1 className="text-6xl font-bold leading-tight text-[--black]">
                            Welcome Back!
                        </h1>
                        <p className="mt-3 text-[--grey]">
                            Find your perfect roommate or list your room.
                        </p>
                    </div>
                    <div className="w-full max-w-md mt-8">
                        <div className="flex justify-center space-x-4">
                            <Button asChild variant="secondary" size="lg">
                                <a href="/rooms/create">Post Room</a>
                            </Button>
                            <Button asChild variant="secondary" size="lg">
                                <a href="">Post My Profile</a>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}

export default Home;