// resources/js/Pages/Content/Index.jsx
import { Head, usePage, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ContentCard from '@/Components/ContentCard';
import SearchWithCustomFilter from './components/SearchWithCustomFilter';
import { useState, useEffect } from 'react'; // Importa useState y useEffect

export default function Index({ content, filterGender, filterCities, filterMinPrice, filterMaxPrice }) {
    const { auth, searchTerm: initialSearchTerm, filterCategory } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm || ''); // Inicializa con el searchTerm de las props, o vacío

    console.log("Index - Props Received:", { content, filterGender, filterCities, filterMinPrice, filterMaxPrice, auth, searchTerm, filterCategory });

    const handleSearch = (event) => {
        event.preventDefault();
        // Construye la URL con todos los parámetros de filtro y búsqueda
        const url = `/content?search=${searchTerm}&filterCategory=${filterCategory}&filterGender=${filterGender}&cities=${filterCities.join(',')}&minPrice=${filterMinPrice}&maxPrice=${filterMaxPrice}`;
        router.visit(url);
        console.log("Content:handleSearch - URL:", url);

    };

     useEffect(() => {
        setSearchTerm(initialSearchTerm || '');
    }, [initialSearchTerm]);


    return (
        <MainLayout auth={auth}>
            <Head title="Content List" />

            {/* Barra de Búsqueda */}
            <form onSubmit={handleSearch} className="flex items-center w-full max-w-md mx-auto mt-4 mb-4">
                <input
                    type="text"
                    placeholder="Search rooms, roommates..."
                    className="w-full px-4 py-2 bg-white border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>

            <SearchWithCustomFilter
                searchTerm={searchTerm}
                filterCategory={filterCategory}
                filterGender={filterGender}
                filterCities={filterCities}
                filterMinPrice={filterMinPrice}
                filterMaxPrice={filterMaxPrice}
            />

            <div className="grid grid-cols-1 card-wrapper gap-7 my-7 md:grid-cols-2 lg:gap-10 lg:my-10">
                {content?.map(item => (
                    <ContentCard key={`${item.type}-${item.id}`} item={item} />
                ))}
            </div>
        </MainLayout>
    );
}