// resources/js/Pages/Content/index.jsx
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ContentCard from '@/Components/ContentCard';
import SearchWithCustomFilter from './components/SearchWithCustomFilter';

export default function Index({ content, filterGender, filterCities, filterMinPrice, filterMaxPrice }) { // Receive filter values
    const { auth, searchTerm, filterCategory } = usePage().props;

    // console.log("Index - START - Component Rendered"); // REMOVED, just kept the important one
    console.log("Index - Props Received:", { content, filterGender, filterCities, filterMinPrice, filterMaxPrice, auth, searchTerm, filterCategory }); // Keep for checking

    return (
        <MainLayout auth={auth}>
            <Head title="Content List" />

            <SearchWithCustomFilter
                searchTerm={searchTerm}
                filterCategory={filterCategory}
                filterGender={filterGender}
                filterCities={filterCities}        // Pass to component
                filterMinPrice={filterMinPrice}      // Pass to component
                filterMaxPrice={filterMaxPrice}        // Pass to component
            />

            <div className="grid grid-cols-1 card-wrapper gap-7 my-7 md:grid-cols-2 lg:gap-10 lg:my-10">
                {content?.map(item => (
                    <ContentCard key={`${item.type}-${item.id}`} item={item} />
                ))}
            </div>
        </MainLayout>
    );
}