// resources/js/Pages/Content/Index.jsx
import { Head, usePage, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ContentCard from '@/Components/ContentCard';
import SearchWithCustomFilter from './components/SearchWithCustomFilter';
import { useState, useEffect } from 'react';

export default function Index({ content, filterGender, filterCities, filterMinPrice, filterMaxPrice, selectedSort }) { // Recibir selectedSort
    const { auth, searchTerm: initialSearchTerm, filterCategory } = usePage().props;
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
    console.log("Index - Props Received:", { content, filterGender, filterCities, filterMinPrice, filterMaxPrice, selectedSort, auth, searchTerm, filterCategory }); //agrege selectedSort

    const handleSearch = (event) => {
        event.preventDefault();
        const url = `/content?search=${searchTerm}&filterCategory=${filterCategory}&filterGender=${filterGender}&cities=${filterCities.join(',')}&minPrice=${filterMinPrice}&maxPrice=${filterMaxPrice}&selectedSort=${selectedSort}`; // Incluir selectedSort
        router.visit(url);
        console.log("Content:handleSearch - URL:", url);
    };

    useEffect(() => {
        setSearchTerm(initialSearchTerm || '');
    }, [initialSearchTerm]);

    return (
        <MainLayout auth={auth}>
            <Head title="Content List" />
            <form onSubmit={handleSearch} className="flex items-center w-full max-w-md mx-auto mt-0 mb-6">
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
                selectedSort={selectedSort} // Pasar selectedSort al componente
            />
            <div className="grid grid-cols-1 card-wrapper gap-7 my-7 md:grid-cols-2 lg:gap-10 lg:my-10">
                {content?.map(item => (
                    <ContentCard key={`${item.type}-${item.id}`} item={item} />
                ))}
            </div>
        </MainLayout>
    );
}